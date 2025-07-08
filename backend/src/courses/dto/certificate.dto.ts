import { IsString, IsNumber } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  studentId: string;

  @IsString()
  courseId: string;

  @IsNumber()
  score: number;

  @IsString()
  url?: string;
}