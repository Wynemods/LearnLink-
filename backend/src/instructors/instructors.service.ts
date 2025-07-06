import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
import { Role } from '@prisma/client';

@Injectable()
export class InstructorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto = {}): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where = {
      role: Role.INSTRUCTOR,
      isActive: true,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { specialty: { contains: search, mode: 'insensitive' as const } },
          { expertise: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [instructors, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profilePicture: true,
          bio: true,
          title: true,
          specialty: true,
          experience: true,
          expertise: true,
          rating: true,
          totalStudents: true,
          createdAt: true,
          coursesCreated: {
            where: { isPublished: true },
            select: {
              id: true,
              title: true,
              description: true,
              thumbnail: true,
              rating: true,
              totalReviews: true,
              price: true,
            },
          },
          _count: {
            select: {
              coursesCreated: {
                where: { isPublished: true },
              },
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const transformedInstructors = instructors.map(instructor => ({
      id: instructor.id,
      name: `${instructor.firstName} ${instructor.lastName}`,
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      email: instructor.email,
      image: instructor.profilePicture || '/assets/default-avatar.png',
      bio: instructor.bio,
      title: instructor.title,
      specialty: instructor.specialty,
      experience: instructor.experience,
      expertise: instructor.expertise,
      rating: instructor.rating || 0,
      students: instructor.totalStudents || 0,
      courses: instructor._count.coursesCreated,
      about: instructor.bio,
      coursesList: instructor.coursesCreated.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        image: course.thumbnail || '/assets/default-course.png',
        rating: course.rating || 0,
        reviews: course.totalReviews || 0,
        price: course.price,
      })),
      createdAt: instructor.createdAt,
    }));

    return new PaginatedResponse(transformedInstructors, total, page, limit);
  }

  async findOne(id: string): Promise<any> {
    const instructor = await this.prisma.user.findUnique({
      where: { id, role: Role.INSTRUCTOR, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePicture: true,
        bio: true,
        title: true,
        specialty: true,
        experience: true,
        expertise: true,
        rating: true,
        totalStudents: true,
        createdAt: true,
        coursesCreated: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            rating: true,
            totalReviews: true,
            price: true,
          },
        },
        _count: {
          select: {
            coursesCreated: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    return {
      id: instructor.id,
      name: `${instructor.firstName} ${instructor.lastName}`,
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      email: instructor.email,
      image: instructor.profilePicture || '/assets/default-avatar.png',
      bio: instructor.bio,
      title: instructor.title,
      specialty: instructor.specialty,
      experience: instructor.experience,
      expertise: instructor.expertise,
      rating: instructor.rating || 0,
      students: instructor.totalStudents || 0,
      courses: instructor._count.coursesCreated,
      about: instructor.bio,
      coursesList: instructor.coursesCreated.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        image: course.thumbnail || '/assets/default-course.png',
        rating: course.rating || 0,
        reviews: course.totalReviews || 0,
        price: course.price,
      })),
      createdAt: instructor.createdAt,
    };
  }

  async getTopInstructors(limit: number = 5): Promise<any[]> {
    const instructors = await this.prisma.user.findMany({
      where: {
        role: Role.INSTRUCTOR,
        isActive: true,
      },
      orderBy: [
        { rating: 'desc' },
        { totalStudents: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        rating: true,
        totalStudents: true,
        specialty: true,
        _count: {
          select: {
            coursesCreated: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    return instructors.map(instructor => ({
      id: instructor.id,
      name: `${instructor.firstName} ${instructor.lastName}`,
      image: instructor.profilePicture || '/assets/default-avatar.png',
      rating: instructor.rating || 0,
      students: instructor.totalStudents || 0,
      courses: instructor._count.coursesCreated,
      specialty: instructor.specialty,
    }));
  }
}
