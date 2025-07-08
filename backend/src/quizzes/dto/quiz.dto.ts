import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionOptionDto {
  @IsString()
  id: string;

  @IsString()
  text: string;

  @IsBoolean()
  correct: boolean;
}

export class QuestionDto {
  @IsString()
  id: string;

  @IsString()
  question: string;

  @IsString()
  type: string; // 'multiple_choice', 'true_false', 'short_answer'

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options: QuestionOptionDto[];

  @IsNumber()
  @Min(1)
  points: number;

  @IsString()
  @IsOptional()
  explanation?: string;
}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  courseId: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  duration?: number; // in minutes

  @IsNumber()
  @Min(1)
  order: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  passingScore?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateQuizDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  duration?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  order?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  passingScore?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class SubmitQuizDto {
  @IsArray()
  answers: Array<{
    questionId: string;
    answer: string | string[];
  }>;

  @IsNumber()
  @IsOptional()
  timeSpent?: number; // in seconds
}