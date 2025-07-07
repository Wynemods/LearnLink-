import { Controller, Get, Post, Body, Param, Query, UseGuards, ValidationPipe, Put, Delete, ForbiddenException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, RateCourseDto, UpdateProgressDto, BulkCreateCoursesDto } from './dto/course.dto';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    const courses = await this.coursesService.findAll(paginationDto);
    return new ApiResponse(true, 'Courses retrieved successfully', courses);
  }

  @Public()
  @Get('categories')
  async getCategories(): Promise<ApiResponse<any[]>> {
    const categories = await this.coursesService.getCategories();
    return new ApiResponse(true, 'Categories retrieved successfully', categories);
  }

  @Public()
  @Get('recommended')
  async getRecommendedCourses(
    @Query('limit') limit?: string,
  ): Promise<ApiResponse<any[]>> {
    const courses = await this.coursesService.getRecommendedCourses(
      limit ? parseInt(limit) : 10,
    );
    return new ApiResponse(true, 'Recommended courses retrieved successfully', courses);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-courses')
  async getMyCourses(@GetUser() user: any): Promise<ApiResponse<any[]>> {
    const courses = await this.coursesService.getMyCourses(user.id);
    return new ApiResponse(true, 'My courses retrieved successfully', courses);
  }

  @Public()
  @Get('search')
  async search(@Query() query: PaginationDto): Promise<ApiResponse<PaginatedResponse<any>>> {
    const courses = await this.coursesService.findAll(query);
    return new ApiResponse(true, 'Search results retrieved successfully', courses);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<any>> {
    const course = await this.coursesService.findOne(id);
    
    if (!course) {
      return new ApiResponse(false, 'Course not found', null);
    }

    return new ApiResponse(true, 'Course retrieved successfully', course);
  }

  @Public()
  @Get(':id/reviews')
  async getCourseReviews(@Param('id') id: string): Promise<ApiResponse<any[]>> {
    const reviews = await this.coursesService.getCourseReviews(id);
    return new ApiResponse(true, 'Course reviews retrieved successfully', reviews);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/progress')
  async getProgress(@Param('id') id: string, @GetUser() user: any): Promise<ApiResponse<any>> {
    const progress = await this.coursesService.getProgress(id, user.id);
    return new ApiResponse(true, 'Course progress retrieved successfully', progress);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body(ValidationPipe) createCourseDto: CreateCourseDto, @GetUser() user: any): Promise<ApiResponse<any>> {
    const course = await this.coursesService.create(createCourseDto, user);
    return new ApiResponse(true, 'Course created successfully', course);
  }

  @Post('bulk-create')
  @UseGuards(JwtAuthGuard)
  async bulkCreate(@Body(ValidationPipe) bulkCreateDto: BulkCreateCoursesDto, @GetUser() user: any): Promise<ApiResponse<any[]>> {
    const courses = await this.coursesService.bulkCreateCourses(bulkCreateDto.courses, user.id);
    return new ApiResponse(true, 'Courses created successfully', courses);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  async enroll(@Param('id') id: string, @GetUser() user: any): Promise<ApiResponse<any>> {
    const enrollment = await this.coursesService.enroll(id, user.id);
    return new ApiResponse(true, 'Successfully enrolled in course', enrollment);
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  async rateCourse(@Param('id') id: string, @Body(ValidationPipe) rateDto: RateCourseDto, @GetUser() user: any): Promise<ApiResponse<any>> {
    const rating = await this.coursesService.rateCourse(id, user.id, rateDto.rating, rateDto.comment);
    return new ApiResponse(true, 'Course rated successfully', rating);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body(ValidationPipe) updateCourseDto: UpdateCourseDto, @GetUser() user: any): Promise<ApiResponse<any>> {
    const course = await this.coursesService.update(id, updateCourseDto, user);
    return new ApiResponse(true, 'Course updated successfully', course);
  }

  @Put(':id/progress')
  @UseGuards(JwtAuthGuard)
  async updateProgress(@Param('id') id: string, @Body(ValidationPipe) progressDto: UpdateProgressDto, @GetUser() user: any): Promise<ApiResponse<any>> {
    const progress = await this.coursesService.updateProgress(id, user.id, progressDto);
    return new ApiResponse(true, 'Progress updated successfully', progress);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @GetUser() user: any): Promise<ApiResponse<null>> {
    await this.coursesService.remove(id, user);
    return new ApiResponse(true, 'Course deleted successfully', null);
  }

  @UseGuards(JwtAuthGuard)
  @Get('instructor/my-courses')
  async getInstructorCourses(@GetUser() user: any): Promise<ApiResponse<any[]>> {
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can access this endpoint');
    }
    
    const courses = await this.coursesService.getInstructorCourses(user.id);
    return new ApiResponse(true, 'Instructor courses retrieved successfully', courses);
  }

  @UseGuards(JwtAuthGuard)
  @Get('instructor/students')
  async getInstructorStudents(@GetUser() user: any): Promise<ApiResponse<any[]>> {
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can access this endpoint');
    }
    
    const students = await this.coursesService.getInstructorStudents(user.id);
    return new ApiResponse(true, 'Instructor students retrieved successfully', students);
  }

  @UseGuards(JwtAuthGuard)
  @Get('instructor/analytics')
  async getInstructorAnalytics(@GetUser() user: any): Promise<ApiResponse<any>> {
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can access this endpoint');
    }
    
    const analytics = await this.coursesService.getInstructorAnalytics(user.id);
    return new ApiResponse(true, 'Instructor analytics retrieved successfully', analytics);
  }
}