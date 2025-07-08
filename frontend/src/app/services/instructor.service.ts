import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Instructor {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  profilePicture?: string;
  bio: string;
  title: string;
  specialty: string;
  experience: string;
  expertise: string;
  rating: number;
  students: number;
  totalStudents?: number;
  courses: number;
  coursesCount?: number;
  about: string;
  coursesList: any[];
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getInstructors(): Observable<ApiResponse<PaginatedResponse<Instructor>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Instructor>>>(`${this.API_URL}/instructors`);
  }

  getInstructor(id: string): Observable<ApiResponse<Instructor>> {
    return this.http.get<ApiResponse<Instructor>>(`${this.API_URL}/instructors/${id}`);
  }

  getTopInstructors(limit: number = 5): Observable<ApiResponse<Instructor[]>> {
    return this.http.get<ApiResponse<Instructor[]>>(`${this.API_URL}/instructors/top?limit=${limit}`);
  }
}