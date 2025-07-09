import { Controller, Get, Post, Body, Param, Query, UseGuards, ValidationPipe, Put, Delete, ForbiddenException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, RateCourseDto, UpdateProgressDto, BulkCreateCoursesDto } from './dto/course.dto';
import { CreateQuizDto } from './dto/quiz.dto';
import { CreateCertificateDto } from './dto/certificate.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { QuizAttemptService, QuizSubmissionDto } from './quiz-attempt.service';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly quizAttemptService: QuizAttemptService
  ) {}

  @Public()
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const courses = await this.coursesService.findAll(paginationDto);
      return new ApiResponse(true, 'Courses retrieved successfully', courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      return new ApiResponse(false, 'Failed to retrieve courses', null);
    }
  }

  @Public()
  @Get('search')
  async searchCourses(
    @Query('q') searchTerm: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const searchDto = { ...paginationDto, search: searchTerm };
      const courses = await this.coursesService.findAll(searchDto);
      return new ApiResponse(true, 'Search results retrieved successfully', courses);
    } catch (error) {
      console.error('Error searching courses:', error);
      return new ApiResponse(false, 'Failed to search courses', null);
    }
  }

  @Public()
  @Get('categories')
  async getCategories(): Promise<ApiResponse<any[]>> {
    try {
      const categories = await this.coursesService.getCategories();
      return new ApiResponse(true, 'Categories retrieved successfully', categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return new ApiResponse(false, 'Failed to retrieve categories', []);
    }
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

  @UseGuards(JwtAuthGuard)
  @Get('instructor/courses-list')
  async getInstructorCoursesList(@GetUser() user: any): Promise<ApiResponse<any[]>> {
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can access this endpoint');
    }
    
    const courses = await this.coursesService.getInstructorCoursesList(user.id);
    return new ApiResponse(true, 'Instructor courses list retrieved successfully', courses);
  }

  // --- LESSON ROUTES ---
  @Post('lessons')
  @UseGuards(JwtAuthGuard)
  async createLesson(
    @Body(ValidationPipe) dto: CreateLessonDto, 
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const lesson = await this.coursesService.createLesson(dto, user);
    return new ApiResponse(true, 'Lesson created successfully', lesson);
  }

  @Get(':id/lessons')
  async getCourseLessons(@Param('id') courseId: string): Promise<ApiResponse<any[]>> {
    const lessons = await this.coursesService.getCourseLessons(courseId);
    return new ApiResponse(true, 'Lessons retrieved successfully', lessons);
  }

  @Put('lessons/:lessonId')
  @UseGuards(JwtAuthGuard)
  async updateLesson(
    @Param('lessonId') lessonId: string, 
    @Body(ValidationPipe) dto: UpdateLessonDto, 
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const lesson = await this.coursesService.updateLesson(lessonId, dto, user);
    return new ApiResponse(true, 'Lesson updated successfully', lesson);
  }

  @Delete('lessons/:lessonId')
  @UseGuards(JwtAuthGuard)
  async deleteLesson(
    @Param('lessonId') lessonId: string, 
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const result = await this.coursesService.deleteLesson(lessonId, user);
    return new ApiResponse(true, 'Lesson deleted successfully', result);
  }

  // --- QUIZ ROUTES ---
  @Post('quizzes')
  @UseGuards(JwtAuthGuard)
  async createQuiz(
    @Body(ValidationPipe) dto: CreateQuizDto, 
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const quiz = await this.coursesService.createQuiz(dto, user);
    return new ApiResponse(true, 'Quiz created successfully', quiz);
  }

  @Get(':id/quizzes')
  async getCourseQuizzes(@Param('id') courseId: string): Promise<ApiResponse<any[]>> {
    const quizzes = await this.coursesService.getCourseQuizzes(courseId);
    return new ApiResponse(true, 'Quizzes retrieved successfully', quizzes);
  }

  @Put('quizzes/:quizId')
  @UseGuards(JwtAuthGuard)
  async updateQuiz(
    @Param('quizId') quizId: string, 
    @Body(ValidationPipe) dto: Partial<CreateQuizDto>, 
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const quiz = await this.coursesService.updateQuiz(quizId, dto, user);
    return new ApiResponse(true, 'Quiz updated successfully', quiz);
  }

  @Delete('quizzes/:quizId')
  @UseGuards(JwtAuthGuard)
  async deleteQuiz(
    @Param('quizId') quizId: string, 
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const result = await this.coursesService.deleteQuiz(quizId, user);
    return new ApiResponse(true, 'Quiz deleted successfully', result);
  }

  // --- CERTIFICATE ROUTES ---
  @UseGuards(JwtAuthGuard)
  @Post(':id/certificates')
  async createCertificate(@Param('id') id: string, @Body() dto: CreateCertificateDto, @GetUser() user: any) {
    dto.courseId = id;
    return new ApiResponse(true, 'Certificate created', await this.coursesService.createCertificate(dto, user));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/certificates')
  async getCourseCertificates(@Param('id') id: string, @GetUser() user: any) {
    return new ApiResponse(true, 'Certificates fetched', await this.coursesService.getCourseCertificates(id, user));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/certificates/me')
  async getMyCertificate(@Param('id') id: string, @GetUser() user: any) {
    return new ApiResponse(true, 'My certificate', await this.coursesService.getMyCertificate(id, user));
  }

  @UseGuards(JwtAuthGuard)
  @Delete('certificates/:certId')
  async deleteCertificate(@Param('certId') certId: string, @GetUser() user: any) {
    return new ApiResponse(true, 'Certificate deleted', await this.coursesService.deleteCertificate(certId, user));
  }

  // --- QUIZ ATTEMPT ROUTES ---
  @Post('quizzes/:quizId/submit')
  @UseGuards(JwtAuthGuard)
  async submitQuiz(
    @Param('quizId') quizId: string,
    @Body() submission: { answers: any[] },
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const quizSubmission: QuizSubmissionDto = {
      quizId,
      answers: submission.answers
    };
    
    const result = await this.quizAttemptService.submitQuiz(user.id, quizSubmission);
    return new ApiResponse(true, 'Quiz submitted successfully', result);
  }

  @Get('quizzes/:quizId/results')
  @UseGuards(JwtAuthGuard)
  async getQuizResults(
    @Param('quizId') quizId: string,
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const results = await this.quizAttemptService.getQuizResults(user.id, quizId);
    return new ApiResponse(true, 'Quiz results retrieved successfully', results);
  }

  @Get('my-quiz-attempts')
  @UseGuards(JwtAuthGuard)
  async getMyQuizAttempts(
    @GetUser() user: any,
    @Query('courseId') courseId?: string
  ): Promise<ApiResponse<any[]>> {
    const attempts = await this.quizAttemptService.getQuizAttempts(user.id, courseId);
    return new ApiResponse(true, 'Quiz attempts retrieved successfully', attempts);
  }

  @Post('quizzes/:quizId/retake')
  @UseGuards(JwtAuthGuard)
  async retakeQuiz(
    @Param('quizId') quizId: string,
    @GetUser() user: any
  ): Promise<ApiResponse<any>> {
    const result = await this.quizAttemptService.retakeQuiz(user.id, quizId);
    return new ApiResponse(true, 'Quiz retake initiated successfully', result);
  }

  // --- USER CERTIFICATE ROUTES ---
  @Get('certificates/my-certificates')
  @UseGuards(JwtAuthGuard)
  async getUserCertificates(@GetUser() user: any): Promise<ApiResponse<any[]>> {
    const certificates = await this.coursesService.getUserCertificates(user.id);
    return new ApiResponse(true, 'User certificates retrieved successfully', certificates);
  }
}