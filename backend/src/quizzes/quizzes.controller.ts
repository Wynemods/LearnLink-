import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto, UpdateQuizDto, SubmitQuizDto } from './dto/quiz.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiResponse } from '../common/dto/response.dto';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async create(@Body(ValidationPipe) createQuizDto: CreateQuizDto, @GetUser() user: any): Promise<ApiResponse<any>> {
    const quiz = await this.quizzesService.create(createQuizDto, user);
    return new ApiResponse(true, 'Quiz created successfully', quiz);
  }

  @Get('course/:courseId')
  async findAllByCourse(@Param('courseId') courseId: string, @GetUser() user: any): Promise<ApiResponse<any[]>> {
    const quizzes = await this.quizzesService.findAllByCourse(courseId, user);
    return new ApiResponse(true, 'Quizzes retrieved successfully', quizzes);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: any): Promise<ApiResponse<any>> {
    const quiz = await this.quizzesService.findOne(id, user);
    return new ApiResponse(true, 'Quiz retrieved successfully', quiz);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateQuizDto: UpdateQuizDto, @GetUser() user: any): Promise<ApiResponse<any>> {
    const quiz = await this.quizzesService.update(id, updateQuizDto, user);
    return new ApiResponse(true, 'Quiz updated successfully', quiz);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: any): Promise<ApiResponse<null>> {
    await this.quizzesService.remove(id, user);
    return new ApiResponse(true, 'Quiz deleted successfully', null);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Body(ValidationPipe) submitDto: SubmitQuizDto, @GetUser() user: any): Promise<ApiResponse<any>> {
    const result = await this.quizzesService.submitQuiz(id, submitDto, user);
    return new ApiResponse(true, 'Quiz submitted successfully', result);
  }

  @Get(':id/attempt')
  async getAttempt(@Param('id') id: string, @GetUser() user: any): Promise<ApiResponse<any>> {
    const attempt = await this.quizzesService.getQuizAttempt(id, user);
    return new ApiResponse(true, 'Quiz attempt retrieved successfully', attempt);
  }
}