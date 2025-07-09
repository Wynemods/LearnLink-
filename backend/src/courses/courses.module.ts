import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { QuizAttemptService } from './quiz-attempt.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, QuizAttemptService],
  exports: [CoursesService],
})
export class CoursesModule {}
