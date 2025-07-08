import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
 
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  originalPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  @IsOptional()
  level?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  modules?: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  heroImage?: string;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsArray()
  @IsOptional()
  learningOutcomes?: string[];

  @IsArray()
  @IsOptional()
  requirements?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  originalPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  @IsOptional()
  level?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  modules?: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  heroImage?: string;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsArray()
  @IsOptional()
  learningOutcomes?: string[];

  @IsArray()
  @IsOptional()
  requirements?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class RateCourseDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateProgressDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @IsNumber()
  @Min(1)
  currentLesson: number;

  @IsArray()
  @IsOptional()
  completedLessons?: string[];
}

export class BulkCreateCoursesDto {
  @IsArray()
  courses: CreateCourseDto[];
}