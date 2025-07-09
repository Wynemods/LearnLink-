import { IsString, IsNumber, IsArray, IsOptional, Min } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  order?: number;

  @IsString()
  courseId: string; // Add this field to specify which course the quiz belongs to

  @IsArray()
  questions: any[];
}