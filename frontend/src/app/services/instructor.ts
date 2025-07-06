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
  bio?: string;
  title?: string;
  specialty?: string;
  experience?: string;
  expertise?: string;
  rating: number;
  students: number;
  courses: number;
  about?: string;
  coursesList: CourseItem[];
  createdAt?: Date;
}

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  image: string;
  rating?: number;
  reviews?: number;
  price?: number;
}

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getInstructors(page: number = 1, limit: number = 10, search?: string): Observable<any> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    return this.http.get<any>(`${this.API_URL}/instructors?${params.toString()}`)
      .pipe(map(response => response.data));
  }

  getInstructor(id: string): Observable<Instructor> {
    return this.http.get<any>(`${this.API_URL}/instructors/${id}`)
      .pipe(map(response => response.data));
  }

  getTopInstructors(limit: number = 5): Observable<Instructor[]> {
    return this.http.get<any>(`${this.API_URL}/instructors/top?limit=${limit}`)
      .pipe(map(response => response.data));
  }
}