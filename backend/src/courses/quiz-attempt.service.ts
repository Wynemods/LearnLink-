import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoursesService } from './courses.service';

export interface QuizSubmissionDto {
  quizId: string;
  answers: Array<{
    questionId: string;
    answer: any;
  }>;
}

@Injectable()
export class QuizAttemptService {
  constructor(
    private prisma: PrismaService,
    private coursesService: CoursesService
  ) {}

  async submitQuiz(userId: string, submission: QuizSubmissionDto): Promise<any> {
    // Get quiz with questions
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: submission.quizId },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check if user is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: quiz.courseId
        }
      }
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled in the course to take this quiz');
    }

    // Check if user has already completed this quiz
    const existingAttempt = await this.prisma.quizAttempt.findUnique({
      where: {
        studentId_quizId: {
          studentId: userId,
          quizId: submission.quizId
        }
      }
    });

    if (existingAttempt && existingAttempt.isCompleted) {
      throw new ForbiddenException('You have already completed this quiz');
    }

    // Calculate score
    const questions = quiz.questions as any[];
    const { score, maxScore, percentage } = this.calculateScore(questions, submission.answers);

    // Create or update quiz attempt
    const quizAttempt = await this.prisma.quizAttempt.upsert({
      where: {
        studentId_quizId: {
          studentId: userId,
          quizId: submission.quizId
        }
      },
      update: {
        answers: submission.answers,
        score,
        maxScore,
        percentage,
        isCompleted: true,
        completedAt: new Date()
      },
      create: {
        studentId: userId,
        quizId: submission.quizId,
        courseId: quiz.courseId,
        answers: submission.answers,
        score,
        maxScore,
        percentage,
        isCompleted: true,
        completedAt: new Date()
      }
    });

    // Check if user qualifies for certificate (80% or higher)
    if (percentage >= 80) {
      await this.coursesService.checkAndGenerateCertificate(userId, quiz.courseId, percentage);
    }

    return {
      quizId: submission.quizId,
      courseTitle: quiz.course.title,
      score,
      maxScore,
      percentage,
      passed: percentage >= 80,
      certificateEarned: percentage >= 80,
      feedback: this.generateFeedback(percentage)
    };
  }

  async getQuizResults(userId: string, quizId: string): Promise<any> {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: {
        studentId_quizId: {
          studentId: userId,
          quizId: quizId
        }
      },
      include: {
        quiz: {
          select: {
            title: true,
            questions: true,
            course: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });

    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    return {
      quizTitle: attempt.quiz.title,
      courseTitle: attempt.quiz.course.title,
      score: attempt.score,
      maxScore: attempt.maxScore,
      percentage: attempt.percentage,
      passed: attempt.percentage >= 80,
      completedAt: attempt.completedAt,
      answers: attempt.answers,
      feedback: this.generateFeedback(attempt.percentage)
    };
  }

  async getQuizAttempts(userId: string, courseId?: string): Promise<any[]> {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: {
        studentId: userId,
        ...(courseId && { courseId })
      },
      include: {
        quiz: {
          select: {
            title: true,
            course: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    return attempts.map(attempt => ({
      id: attempt.id,
      quizTitle: attempt.quiz.title,
      courseTitle: attempt.quiz.course.title,
      score: attempt.score,
      maxScore: attempt.maxScore,
      percentage: attempt.percentage,
      passed: attempt.percentage >= 80,
      completedAt: attempt.completedAt,
      timeSpent: attempt.timeSpent
    }));
  }

  async retakeQuiz(userId: string, quizId: string): Promise<any> {
    // Check if quiz allows retakes (you might want to add this to your Quiz model)
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check if user is enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: quiz.courseId
        }
      }
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled in the course to retake this quiz');
    }

    // Reset the quiz attempt
    await this.prisma.quizAttempt.update({
      where: {
        studentId_quizId: {
          studentId: userId,
          quizId: quizId
        }
      },
      data: {
        isCompleted: false,
        completedAt: null,
        answers: [],
        score: 0,
        percentage: 0,
        startedAt: new Date()
      }
    });

    return {
      message: 'Quiz reset successfully. You can now retake the quiz.',
      quizId: quizId,
      courseTitle: quiz.course.title
    };
  }

  private calculateScore(questions: any[], answers: any[]): { score: number; maxScore: number; percentage: number } {
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    // Create a map of answers for quick lookup
    const answerMap = new Map();
    answers.forEach(answer => {
      answerMap.set(answer.questionId, answer.answer);
    });

    // Check each question
    questions.forEach(question => {
      const userAnswer = answerMap.get(question.id);
      if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = correctAnswers;
    const maxScore = totalQuestions;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return { score, maxScore, percentage };
  }

  private generateFeedback(percentage: number): string {
    if (percentage >= 90) {
      return 'Excellent work! You have mastered this material.';
    } else if (percentage >= 80) {
      return 'Great job! You have earned a certificate for this course.';
    } else if (percentage >= 70) {
      return 'Good effort! You may want to review some concepts and try again.';
    } else if (percentage >= 60) {
      return 'You\'re making progress. Please review the material and try again.';
    } else {
      return 'Please review the course material carefully and try again.';
    }
  }
}