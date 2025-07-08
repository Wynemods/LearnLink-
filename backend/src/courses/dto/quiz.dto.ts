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

  @IsArray()
  questions: any[];
}