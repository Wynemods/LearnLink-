import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto, UpdateQuizDto, SubmitQuizDto } from './dto/quiz.dto';
import { User } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto, user: User): Promise<any> {
    // Verify the course exists and user is the instructor
    const course = await this.prisma.course.findUnique({
      where: { id: createQuizDto.courseId },
      select: { instructorId: true, title: true }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor can create quizzes for this course');
    }

    // Calculate total points
    const totalPoints = createQuizDto.questions.reduce((sum, q) => sum + q.points, 0);

    // Convert to plain object for JSON storage
    const questionsData = {
      questions: createQuizDto.questions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          correct: opt.correct
        })),
        points: q.points,
        explanation: q.explanation
      })),
      totalPoints,
      passingScore: createQuizDto.passingScore || 70
    };

    const quiz = await this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        description: createQuizDto.description,
        courseId: createQuizDto.courseId,
        duration: createQuizDto.duration || 30,
        order: createQuizDto.order,
        isPublished: createQuizDto.isPublished || false,
        questions: questionsData as any // Explicitly cast for Prisma JSON
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    return this.transformQuizResponse(quiz, user.role === 'INSTRUCTOR' && course.instructorId === user.id);
  }

  async findAllByCourse(courseId: string, user: User): Promise<any[]> {
    // Check if user has access to this course
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { 
        instructorId: true,
        isPublished: true,
        enrollments: {
          where: { studentId: user.id },
          select: { id: true }
        }
      }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const isInstructor = course.instructorId === user.id;
    const isEnrolled = course.enrollments.length > 0;
    const isAdmin = user.role === 'ADMIN';

    if (!isInstructor && !isEnrolled && !isAdmin) {
      throw new ForbiddenException('You do not have access to this course');
    }

    const quizzes = await this.prisma.quiz.findMany({
      where: {
        courseId,
        ...(isInstructor || isAdmin ? {} : { isPublished: true })
      },
      orderBy: { order: 'asc' },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return quizzes.map(quiz => this.transformQuizResponse(quiz, isInstructor || isAdmin));
  }

  async findOne(id: string, user: User): Promise<any> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
            enrollments: {
              where: { studentId: user.id },
              select: { id: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const isInstructor = quiz.course.instructorId === user.id;
    const isEnrolled = quiz.course.enrollments.length > 0;
    const isAdmin = user.role === 'ADMIN';

    if (!isInstructor && !isEnrolled && !isAdmin) {
      throw new ForbiddenException('You do not have access to this quiz');
    }

    if (!isInstructor && !isAdmin && !quiz.isPublished) {
      throw new ForbiddenException('This quiz is not yet published');
    }

    return this.transformQuizResponse(quiz, isInstructor || isAdmin);
  }

  async update(id: string, updateQuizDto: UpdateQuizDto, user: User): Promise<any> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        course: {
          select: { instructorId: true }
        }
      }
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor can update this quiz');
    }

    const updateData: any = { ...updateQuizDto };

    if (updateQuizDto.questions) {
      const totalPoints = updateQuizDto.questions.reduce((sum, q) => sum + q.points, 0);
      const questionsData = {
        ...quiz.questions as any,
        questions: updateQuizDto.questions.map(q => ({
          id: q.id,
          question: q.question,
          type: q.type,
          options: q.options.map(opt => ({
            id: opt.id,
            text: opt.text,
            correct: opt.correct
          })),
          points: q.points,
          explanation: q.explanation
        })),
        totalPoints,
        ...(updateQuizDto.passingScore && { passingScore: updateQuizDto.passingScore })
      };
      updateData.questions = questionsData;
    }

    const updatedQuiz = await this.prisma.quiz.update({
      where: { id },
      data: updateData,
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return this.transformQuizResponse(updatedQuiz, true);
  }

  async remove(id: string, user: User): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        course: {
          select: { instructorId: true }
        }
      }
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor can delete this quiz');
    }

    await this.prisma.quiz.delete({
      where: { id }
    });
  }

  async submitQuiz(quizId: string, submitDto: SubmitQuizDto, user: User): Promise<any> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          select: {
            id: true,
            enrollments: {
              where: { studentId: user.id },
              select: { id: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (!quiz.isPublished) {
      throw new BadRequestException('Quiz is not published');
    }

    const isEnrolled = quiz.course.enrollments.length > 0;
    if (!isEnrolled && user.role !== 'ADMIN') {
      throw new ForbiddenException('You must be enrolled in the course to take this quiz');
    }

    // Check if already attempted
    const existingAttempt = await this.prisma.quizAttempt.findUnique({
      where: {
        studentId_quizId: {
          studentId: user.id,
          quizId
        }
      }
    });

    if (existingAttempt && existingAttempt.isCompleted) {
      throw new BadRequestException('You have already completed this quiz');
    }

    // Calculate score
    const quizData = quiz.questions as any;
    const questions = quizData.questions;
    let correctAnswers = 0;
    let totalQuestions = questions.length;

    const gradedAnswers = submitDto.answers.map(answer => {
      const question = questions.find((q: any) => q.id === answer.questionId);
      if (!question) return { ...answer, correct: false, points: 0 };

      let isCorrect = false;
      if (question.type === 'multiple_choice') {
        const correctOption = question.options.find((opt: any) => opt.correct);
        isCorrect = answer.answer === correctOption?.id;
      }

      if (isCorrect) correctAnswers++;

      return {
        ...answer,
        correct: isCorrect,
        points: isCorrect ? question.points : 0,
        correctAnswer: question.options.find((opt: any) => opt.correct)?.id
      };
    });

    const score = gradedAnswers.reduce((sum, answer) => sum + answer.points, 0);
    const maxScore = quizData.totalPoints;
    const percentage = (score / maxScore) * 100;

    // Save or update attempt
    const attemptData = {
      studentId: user.id,
      quizId,
      courseId: quiz.courseId,
      answers: gradedAnswers as any, // Cast for Prisma JSON
      score,
      maxScore,
      percentage,
      timeSpent: submitDto.timeSpent,
      isCompleted: true,
      completedAt: new Date()
    };

    const attempt = existingAttempt
      ? await this.prisma.quizAttempt.update({
          where: { id: existingAttempt.id },
          data: attemptData
        })
      : await this.prisma.quizAttempt.create({
          data: attemptData
        });

    return {
      attemptId: attempt.id,
      score,
      maxScore,
      percentage,
      correctAnswers,
      totalQuestions,
      passed: percentage >= quizData.passingScore,
      answers: gradedAnswers,
      timeSpent: submitDto.timeSpent
    };
  }

  async getQuizAttempt(quizId: string, user: User): Promise<any> {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: {
        studentId_quizId: {
          studentId: user.id,
          quizId
        }
      }
    });

    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    return attempt;
  }

  private transformQuizResponse(quiz: any, showCorrectAnswers: boolean = false) {
    const quizData = quiz.questions as any;
    
    // For students, hide correct answers
    const questions = showCorrectAnswers 
      ? quizData.questions 
      : quizData.questions.map((q: any) => ({
          ...q,
          options: q.options.map((opt: any) => ({
            id: opt.id,
            text: opt.text
            // Don't include 'correct' property for students
          }))
        }));

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      courseId: quiz.courseId,
      courseName: quiz.course?.title,
      duration: quiz.duration,
      order: quiz.order,
      isPublished: quiz.isPublished,
      questions,
      totalQuestions: questions.length,
      totalPoints: quizData.totalPoints,
      passingScore: quizData.passingScore,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    };
  }
}