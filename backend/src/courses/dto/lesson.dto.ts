import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  order: number;

  @IsString()
  courseId: string; // Add this field to specify which course the lesson belongs to

  @IsEnum(['video', 'text', 'quiz', 'assignment'])
  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  isPreview?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateLessonDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  courseId?: string; // Add this field for updates

  @IsEnum(['video', 'text', 'quiz', 'assignment'])
  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  isPreview?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}