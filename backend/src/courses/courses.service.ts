import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
import { User } from '@prisma/client';
import { CreateQuizDto } from './dto/quiz.dto';
import { CreateCertificateDto } from './dto/certificate.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto = {}): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const { category, level, priceMin, priceMax, instructorId } = paginationDto as any;
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { instructor: { firstName: { contains: search, mode: 'insensitive' } } },
          { instructor: { lastName: { contains: search, mode: 'insensitive' } } },
          { category: { name: { contains: search, mode: 'insensitive' } } }
        ]
      }),
      ...(category && { category: { slug: category } }),
      ...(level && { level }),
      ...(priceMin !== undefined && { price: { gte: Number(priceMin) } }),
      ...(priceMax !== undefined && { price: { lte: Number(priceMax) } }),
      ...(instructorId && { instructorId })
    };

    // Handle price range filter when both min and max are provided
    if (priceMin !== undefined && priceMax !== undefined) {
      where.price = {
        gte: Number(priceMin),
        lte: Number(priceMax)
      };
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
              rating: true,
              bio: true,
              title: true,
              experience: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
              color: true
            }
          },
          lessons: {
            select: {
              id: true,
              title: true,
              duration: true,
              order: true,
              type: true,
              isPreview: true
            },
            orderBy: { order: 'asc' }
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              duration: true,
              order: true
            },
            orderBy: { order: 'asc' }
          },
          _count: {
            select: {
              enrollments: true,
              reviews: true,
              lessons: true,
              quizzes: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        }
      }),
      this.prisma.course.count({ where })
    ]);

    // Transform the data to match frontend expectations
    const transformedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.thumbnail || '/assets/images/default-course.png',
      thumbnail: course.thumbnail,
      heroImage: course.heroImage,
      price: course.price,
      originalPrice: course.originalPrice,
      discount: course.discount,
      rating: course.rating || 0,
      totalReviews: course._count.reviews,
      duration: course.duration,
      modules: course.modules || 0,
      level: course.level,
      instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
      instructorId: course.instructor.id,
      instructorAvatar: course.instructor.profilePicture || '/assets/images/default-avatar.png',
      instructorBio: course.instructor.bio,
      instructorTitle: course.instructor.title,
      instructorExperience: course.instructor.experience,
      category: course.category?.name || 'General',
      categoryId: course.category?.id,
      categorySlug: course.category?.slug,
      categoryIcon: course.category?.icon,
      categoryColor: course.category?.color,
      enrollments: course._count.enrollments,
      totalLessons: course._count.lessons,
      totalQuizzes: course._count.quizzes,
      totalSections: course.totalSections || Math.ceil(course._count.lessons / 5),
      features: course.features || [],
      learningOutcomes: course.learningOutcomes || [],
      requirements: course.requirements || [],
      whatYouLearn: course.whatYouLearn || course.learningOutcomes || [],
      courseContent: course.courseContent || [],
      courseRequirements: course.courseRequirements || course.requirements || [],
      targetAudience: course.targetAudience || [],
      isPublished: course.isPublished,
      curriculum: this.buildCurriculumStructure(course.lessons, course.quizzes, course.curriculum),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }));

    return new PaginatedResponse(transformedCourses, total, page, limit);
  }

  async findOne(id: string): Promise<any> {
    const course = await this.prisma.course.findUnique({
      where: { id, isPublished: true },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            bio: true,
            title: true,
            rating: true,
            totalStudents: true,
            _count: {
              select: {
                coursesCreated: {
                  where: { isPublished: true },
                },
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
            type: true,
            isPreview: true,
          },
          orderBy: { order: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.thumbnail || '/assets/default-course.png',
      heroImage: course.heroImage || course.thumbnail || '/assets/default-course.png',
      instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
      instructorId: course.instructor.id,
      instructorAvatar: course.instructor.profilePicture || '/assets/default-avatar.png',
      instructorBio: course.instructor.bio,
      instructorTitle: course.instructor.title,
      instructorRating: course.instructor.rating || 0,
      instructorStudents: course.instructor.totalStudents || 0,
      instructorCourses: course.instructor._count.coursesCreated,
      category: course.category?.name || 'General',
      categorySlug: course.category?.slug,
      price: course.price,
      originalPrice: course.originalPrice || course.price,
      discount: course.discount || 0,
      rating: course.rating || 0,
      totalReviews: course.totalReviews || 0,
      duration: course.duration || '0 hours',
      level: course.level,
      modules: course.modules || course._count.lessons,
      totalLessons: course._count.lessons,
      totalSections: Math.ceil(course._count.lessons / 5),
      totalDuration: course.duration || '0 hours',
      enrollments: course._count.enrollments,
      features: course.features || [],
      learningOutcomes: course.learningOutcomes || [],
      requirements: course.requirements || [],
      curriculum: this.groupLessonsIntoSections(course.lessons),
      reviews: course.reviews.map(review => ({
        id: review.id,
        userName: `${review.user.firstName} ${review.user.lastName}`,
        userAvatar: review.user.profilePicture || '/assets/default-avatar.png',
        rating: review.rating,
        comment: review.comment,
        timeAgo: this.getTimeAgo(review.createdAt),
      })),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }

  async create(createCourseDto: CreateCourseDto, user: User): Promise<any> {
    // Only instructors can create courses
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can create courses');
    }

    // Remove categoryId if it's invalid or doesn't exist
    const createData: any = { ...createCourseDto };
    
    if (createData.categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: createData.categoryId }
      });
      
      if (!categoryExists) {
        // Remove invalid categoryId
        delete createData.categoryId;
      }
    }

    const course = await this.prisma.course.create({
      data: {
        ...createData,
        instructorId: user.id,
        isPublished: createData.isPublished || false,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          }
        },
        category: true,
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          }
        }
      }
    });

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, user: User): Promise<any> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: { instructorId: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only update your own courses');
    }

    const updateData: any = { ...updateCourseDto };

    // Handle category relationship
    if (updateCourseDto.categoryId) {
      updateData.category = {
        connect: { id: updateCourseDto.categoryId }
      };
      delete updateData.categoryId;
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return {
      id: updatedCourse.id,
      title: updatedCourse.title,
      description: updatedCourse.description,
      instructor: `${updatedCourse.instructor.firstName} ${updatedCourse.instructor.lastName}`,
      category: updatedCourse.category?.name || 'General',
      price: updatedCourse.price,
      originalPrice: updatedCourse.originalPrice,
      discount: updatedCourse.discount,
      duration: updatedCourse.duration,
      level: updatedCourse.level,
      modules: updatedCourse.modules,
      isPublished: updatedCourse.isPublished,
      updatedAt: updatedCourse.updatedAt,
    };
  }

  async remove(id: string, user: User): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: { instructorId: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.prisma.course.delete({
      where: { id },
    });
  }

  async enroll(courseId: string, userId: string): Promise<any> {
    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new ForbiddenException('Already enrolled in this course');
    }

    const enrollment = await this.prisma.enrollment.create({
      data: {
        studentId: userId,
        courseId: courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });

    return {
      id: enrollment.id,
      courseId: enrollment.courseId,
      courseTitle: enrollment.course.title,
      progress: enrollment.progress,
      enrolledAt: enrollment.enrolledAt,
    };
  }

  async getProgress(courseId: string, userId: string): Promise<any> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: courseId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return {
      courseId: enrollment.courseId,
      courseTitle: enrollment.course.title,
      progress: enrollment.progress,
      currentLesson: enrollment.currentLesson,
      completedLessons: enrollment.completedLessons,
      totalLessons: enrollment.course._count.lessons,
      lastAccessedAt: enrollment.lastAccessedAt,
    };
  }

  async updateProgress(courseId: string, userId: string, progressData: any): Promise<any> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const updatedEnrollment = await this.prisma.enrollment.update({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: courseId,
        },
      },
      data: {
        progress: progressData.progress,
        currentLesson: progressData.currentLesson,
        completedLessons: progressData.completedLessons,
        lastAccessedAt: new Date(),
      },
    });

    return {
      courseId: updatedEnrollment.courseId,
      progress: updatedEnrollment.progress,
      currentLesson: updatedEnrollment.currentLesson,
      completedLessons: updatedEnrollment.completedLessons,
    };
  }

  async getRecommendedCourses(limit: number = 10): Promise<any[]> {
    const courses = await this.prisma.course.findMany({
      where: {
        isPublished: true
      },
      take: limit,
      orderBy: [
        { rating: 'desc' },
        { enrollments: { _count: 'desc' } },
        { createdAt: 'desc' }
      ],
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        },
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true
          }
        }
      }
    });

    return courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.thumbnail || '/assets/images/default-course.png',
      price: course.price,
      originalPrice: course.originalPrice,
      discount: course.discount,
      rating: course.rating || 0,
      totalReviews: course._count.reviews,
      duration: course.duration,
      modules: course.modules || 0,
      instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
      instructorAvatar: course.instructor.profilePicture || '/assets/images/default-avatar.png',
      category: course.category?.name || 'General',
      enrollments: course._count.enrollments
    }));
  }

  async getMyCourses(userId: string): Promise<any[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId: userId
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                firstName: true,
                lastName: true,
                profilePicture: true
              }
            },
            category: {
              select: {
                name: true,
                slug: true
              }
            },
            _count: {
              select: {
                reviews: true
              }
            }
          }
        }
      }
    });

    return enrollments.map(enrollment => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      image: enrollment.course.thumbnail || '/assets/images/default-course.png',
      price: enrollment.course.price,
      originalPrice: enrollment.course.originalPrice,
      discount: enrollment.course.discount,
      rating: enrollment.course.rating || 0,
      totalReviews: enrollment.course._count.reviews,
      duration: enrollment.course.duration,
      modules: enrollment.course.modules || 0,
      instructor: `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`,
      instructorAvatar: enrollment.course.instructor.profilePicture || '/assets/images/default-avatar.png',
      category: enrollment.course.category?.name || 'General',
      progress: enrollment.progress || 0,
      currentLesson: enrollment.currentLesson || 1,
      totalLessons: enrollment.course.modules || 0,
      enrolledAt: enrollment.enrolledAt,
      lastAccessedAt: enrollment.lastAccessedAt
    }));
  }

  async getCategories(): Promise<any[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon || 'category',
      color: category.color || 'gray'
    }));
  }

  async rateCourse(courseId: string, userId: string, rating: number, comment?: string): Promise<any> {
    // Check if user is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled in the course to rate it');
    }

    // Check if user has already rated this course
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });

    if (existingReview) {
      // Update existing review
      const review = await this.prisma.review.update({
        where: { id: existingReview.id },
        data: { rating, comment },
      });

      // Update course rating
      await this.updateCourseRating(courseId);

      return review;
    } else {
      // Create new review
      const review = await this.prisma.review.create({
        data: {
          userId: userId,
          courseId: courseId,
          rating,
          comment,
        },
      });

      // Update course rating
      await this.updateCourseRating(courseId);

      return review;
    }
  }

  async getCourseReviews(courseId: string): Promise<any[]> {
    const reviews = await this.prisma.review.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map(review => ({
      id: review.id,
      userName: `${review.user.firstName} ${review.user.lastName}`,
      userAvatar: review.user.profilePicture || '/assets/default-avatar.png',
      rating: review.rating,
      comment: review.comment,
      timeAgo: this.getTimeAgo(review.createdAt),
    }));
  }

  async bulkCreateCourses(courses: CreateCourseDto[], instructorId: string): Promise<any[]> {
    const createdCourses = [];

    for (const courseDto of courses) {
      const courseData: any = {
        title: courseDto.title,
        description: courseDto.description,
        price: courseDto.price,
        originalPrice: courseDto.originalPrice,
        discount: courseDto.discount,
        duration: courseDto.duration,
        level: courseDto.level,
        modules: courseDto.modules,
        thumbnail: courseDto.thumbnail,
        heroImage: courseDto.heroImage,
        features: courseDto.features,
        learningOutcomes: courseDto.learningOutcomes,
        requirements: courseDto.requirements,
        instructorId: instructorId,
        isPublished: true,
      };

      // Handle category relationship
      if (courseDto.categoryId) {
        courseData.category = {
          connect: { id: courseDto.categoryId }
        };
      }

      const course = await this.prisma.course.create({
        data: courseData,
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      createdCourses.push({
        id: course.id,
        title: course.title,
        description: course.description,
        instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
        category: course.category?.name || 'General',
        price: course.price,
        originalPrice: course.originalPrice,
        discount: course.discount,
        duration: course.duration,
        level: course.level,
        modules: course.modules,
        isPublished: course.isPublished,
        createdAt: course.createdAt,
      });
    }

    return createdCourses;
  }

  async getInstructorCourses(instructorId: string): Promise<any[]> {
    const courses = await this.prisma.course.findMany({
      where: {
        instructorId,
      },
      include: {
        category: true,
        _count: {
          select: {
            enrollments: true,
            lessons: true,
            reviews: true,
          }
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return courses.map(course => ({
      ...course,
      totalStudents: course._count.enrollments,
      totalLessons: course._count.lessons,
      totalReviews: course._count.reviews,
    }));
  }

  async getInstructorCoursesList(instructorId: string): Promise<any[]> {
    const courses = await this.prisma.course.findMany({
      where: {
        instructorId,
        isPublished: true // Only show published courses
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        level: true,
        _count: {
          select: {
            lessons: true,
            quizzes: true,
            enrollments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      level: course.level,
      totalLessons: course._count.lessons,
      totalQuizzes: course._count.quizzes,
      totalEnrollments: course._count.enrollments
    }));
  }

  async getInstructorStudents(instructorId: string): Promise<any[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        course: {
          instructorId,
        }
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
            createdAt: true,
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    });

    return enrollments.map(enrollment => ({
      id: enrollment.student.id,
      name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
      email: enrollment.student.email,
      avatar: enrollment.student.profilePicture,
      enrolledDate: enrollment.enrolledAt,
      progress: enrollment.progress,
      coursesEnrolled: [enrollment.course.title],
      lastActive: enrollment.lastAccessedAt,
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
    }));
  }

  async getInstructorAnalytics(instructorId: string): Promise<any> {
    const [
      totalCourses,
      totalStudents,
      totalRevenue,
      courseStats,
      monthlyEnrollments,
      recentActivities
    ] = await Promise.all([
      this.prisma.course.count({
        where: { instructorId }
      }),
      this.prisma.enrollment.count({
        where: {
          course: { instructorId }
        }
      }),
      this.prisma.course.aggregate({
        where: { instructorId },
        _sum: { price: true }
      }),
      this.prisma.course.findMany({
        where: { instructorId },
        include: {
          _count: {
            select: {
              enrollments: true,
              reviews: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.enrollment.groupBy({
        by: ['enrolledAt'],
        where: {
          course: { instructorId },
          enrolledAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        _count: true
      }),
      this.prisma.enrollment.findMany({
        where: {
          course: { instructorId }
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              profilePicture: true,
            }
          },
          course: {
            select: {
              title: true,
            }
          }
        },
        orderBy: {
          enrolledAt: 'desc'
        },
        take: 10
      })
    ]);

    const averageRating = courseStats.reduce((acc, course) => acc + (course.rating || 0), 0) / courseStats.length || 0;

    return {
      totalCourses,
      totalStudents,
      totalRevenue: totalRevenue._sum.price || 0,
      averageRating: Math.round(averageRating * 10) / 10,
      courseProgress: courseStats.map(course => ({
        id: course.id,
        title: course.title,
        progress: Math.round((course._count.enrollments / (course._count.enrollments + 10)) * 100),
        color: 'bg-teal-500'
      })),
      monthlyEnrollments,
      recentActivities: recentActivities.map(activity => ({
        id: activity.id,
        type: 'enrollment',
        message: `${activity.student.firstName} ${activity.student.lastName} enrolled in ${activity.course.title}`,
        timestamp: activity.enrolledAt,
        avatar: activity.student.profilePicture
      }))
    };
  }

  // Lesson CRUD (Instructor only)
  async createLesson(dto: CreateLessonDto, user: any) {
    // Verify the course exists and belongs to the instructor
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
      select: { instructorId: true, title: true }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only create lessons for your own courses');
    }

    const lesson = await this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        videoUrl: dto.videoUrl,
        duration: dto.duration,
        order: dto.order,
        courseId: dto.courseId,
        type: dto.type || 'video',
        isPreview: dto.isPreview || false,
        isPublished: dto.isPublished || false
      },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return lesson;
  }

  async updateLesson(lessonId: string, dto: UpdateLessonDto, user: any) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: { select: { instructorId: true } } }
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor can update lessons');
    }

    const updatedLesson = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: dto
    });

    return updatedLesson;
  }

  async deleteLesson(lessonId: string, user: any) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: { select: { instructorId: true } } }
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor can delete lessons');
    }

    await this.prisma.lesson.delete({
      where: { id: lessonId }
    });

    return { message: 'Lesson deleted successfully' };
  }

  async getCourseLessons(courseId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    });

    return lessons;
  }

  // Quiz CRUD (Instructor only)
  async createQuiz(dto: CreateQuizDto, user: any) {
    // Verify the course exists and belongs to the instructor
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
      select: { instructorId: true, title: true }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only create quizzes for your own courses');
    }

    const quiz = await this.prisma.quiz.create({
      data: {
        title: dto.title,
        description: dto.description,
        duration: dto.duration,
        order: dto.order || await this.getNextQuizOrder(dto.courseId),
        courseId: dto.courseId,
        questions: dto.questions,
        isPublished: true
      },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return quiz;
  }

  async updateQuiz(quizId: string, dto: Partial<CreateQuizDto>, user: any) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { course: { select: { instructorId: true } } }
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor can update quizzes');
    }

    const updatedQuiz = await this.prisma.quiz.update({
      where: { id: quizId },
      data: dto
    });

    return updatedQuiz;
  }

  async deleteQuiz(quizId: string, user: any) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { course: { select: { instructorId: true } } }
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor can delete quizzes');
    }

    await this.prisma.quiz.delete({
      where: { id: quizId }
    });

    return { message: 'Quiz deleted successfully' };
  }

  async getCourseQuizzes(courseId: string) {
    const quizzes = await this.prisma.quiz.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    });

    return quizzes;
  }

  private async getNextQuizOrder(courseId: string): Promise<number> {
    const lastQuiz = await this.prisma.quiz.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    return lastQuiz ? lastQuiz.order + 1 : 1;
  }

  private async updateCourseRating(courseId: string): Promise<void> {
    const reviews = await this.prisma.review.findMany({
      where: { courseId },
      select: { rating: true },
    });

    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await this.prisma.course.update({
        where: { id: courseId },
        data: {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          totalReviews: reviews.length,
        },
      });
    }
  }

  private groupLessonsIntoSections(lessons: any[]): any[] {
    const sections = [];
    const lessonsPerSection = 5;
    
    for (let i = 0; i < lessons.length; i += lessonsPerSection) {
      const sectionLessons = lessons.slice(i, i + lessonsPerSection);
      sections.push({
        id: `section-${Math.floor(i / lessonsPerSection) + 1}`,
        title: `Section ${Math.floor(i / lessonsPerSection) + 1}`,
        lessons: sectionLessons,
        isExpanded: false,
      });
    }
    
    return sections;
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }

  private buildCurriculumStructure(lessons: any[], quizzes: any[], existingCurriculum: any): any {
    if (existingCurriculum) {
      return existingCurriculum;
    }

    // Group lessons and quizzes into sections
    const sections = [];
    const itemsPerSection = 5;
    const allItems = [...lessons, ...quizzes].sort((a, b) => a.order - b.order);
    
    for (let i = 0; i < allItems.length; i += itemsPerSection) {
      const sectionItems = allItems.slice(i, i + itemsPerSection);
      sections.push({
        id: `section-${Math.floor(i / itemsPerSection) + 1}`,
        title: `Section ${Math.floor(i / itemsPerSection) + 1}`,
        lessons: sectionItems.filter(item => item.type !== undefined), // lessons have type
        quizzes: sectionItems.filter(item => item.duration !== undefined && item.type === undefined), // quizzes have duration but no type
        totalDuration: sectionItems.reduce((acc, item) => {
          const duration = item.duration || '0';
          const minutes = parseInt(duration.split(' ')[0]) || 0;
          return acc + minutes;
        }, 0)
      });
    }

    return {
      sections,
      totalSections: sections.length,
      totalLessons: lessons.length,
      totalQuizzes: quizzes.length
    };
  }

  // Certificate CRUD methods
  async createCertificate(dto: CreateCertificateDto, user: any): Promise<any> {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
      include: { instructor: true }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Only instructor of the course or admin can manually create certificates
    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor or admin can create certificates');
    }

    // Check if student exists
    const student = await this.prisma.user.findUnique({
      where: { id: dto.studentId }
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check if student is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: dto.studentId,
          courseId: dto.courseId
        }
      }
    });

    if (!enrollment) {
      throw new ForbiddenException('Student must be enrolled in the course');
    }

    // Check if certificate already exists
    const existingCertificate = await this.prisma.certificate.findUnique({
      where: {
        studentId_courseId: {
          studentId: dto.studentId,
          courseId: dto.courseId
        }
      }
    });

    if (existingCertificate) {
      throw new ForbiddenException('Certificate already exists for this student and course');
    }

    // Create certificate
    const certificate = await this.prisma.certificate.create({
      data: {
        studentId: dto.studentId,
        courseId: dto.courseId,
        score: dto.score,
        url: dto.url || this.generateCertificateUrl(dto.studentId, dto.courseId)
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    return {
      id: certificate.id,
      studentName: `${certificate.student.firstName} ${certificate.student.lastName}`,
      courseTitle: certificate.course.title,
      instructorName: `${certificate.course.instructor.firstName} ${certificate.course.instructor.lastName}`,
      score: certificate.score,
      issuedAt: certificate.issuedAt,
      url: certificate.url
    };
  }

  async getCourseCertificates(courseId: string, user: any): Promise<any[]> {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Only instructor of the course or admin can view all certificates
    if (course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor or admin can view certificates');
    }

    const certificates = await this.prisma.certificate.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    });

    return certificates.map(cert => ({
      id: cert.id,
      studentId: cert.studentId,
      studentName: `${cert.student.firstName} ${cert.student.lastName}`,
      studentEmail: cert.student.email,
      courseTitle: cert.course.title,
      score: cert.score,
      issuedAt: cert.issuedAt,
      url: cert.url
    }));
  }

  async getMyCertificate(courseId: string, user: any): Promise<any> {
    const certificate = await this.prisma.certificate.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: courseId
        }
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return {
      id: certificate.id,
      studentName: `${user.firstName} ${user.lastName}`,
      courseTitle: certificate.course.title,
      instructorName: `${certificate.course.instructor.firstName} ${certificate.course.instructor.lastName}`,
      score: certificate.score,
      issuedAt: certificate.issuedAt,
      url: certificate.url
    };
  }

  async deleteCertificate(certId: string, user: any): Promise<any> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certId },
      include: {
        course: {
          select: {
            instructorId: true
          }
        }
      }
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    // Only instructor of the course or admin can delete certificates
    if (certificate.course.instructorId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor or admin can delete certificates');
    }

    await this.prisma.certificate.delete({
      where: { id: certId }
    });

    return { message: 'Certificate deleted successfully' };
  }

  // Automatic certificate generation when user scores 80+%
  async checkAndGenerateCertificate(userId: string, courseId: string, quizScore: number): Promise<void> {
    // Check if score is 80% or higher
    if (quizScore < 80) {
      return;
    }

    // Check if certificate already exists
    const existingCertificate = await this.prisma.certificate.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: courseId
        }
      }
    });

    if (existingCertificate) {
      return; // Certificate already exists
    }

    // Check if student is enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: courseId
        }
      }
    });

    if (!enrollment) {
      return; // Student not enrolled
    }

    // Create certificate automatically
    await this.prisma.certificate.create({
      data: {
        studentId: userId,
        courseId: courseId,
        score: quizScore,
        url: this.generateCertificateUrl(userId, courseId)
      }
    });
  }

  // Get user's certificates
  async getUserCertificates(userId: string): Promise<any[]> {
    const certificates = await this.prisma.certificate.findMany({
      where: { studentId: userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    });

    return certificates.map(cert => ({
      id: cert.id,
      courseId: cert.courseId,
      courseTitle: cert.course.title,
      instructorName: `${cert.course.instructor.firstName} ${cert.course.instructor.lastName}`,
      score: cert.score,
      issuedAt: cert.issuedAt,
      url: cert.url
    }));
  }

  private generateCertificateUrl(studentId: string, courseId: string): string {
    // Generate a unique certificate URL
    const certificateId = `${studentId}-${courseId}-${Date.now()}`;
    return `${process.env.FRONTEND_URL || 'http://localhost:4200'}/certificates/${certificateId}`;
  }
}
