import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  instructorAvatar?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  totalReviews: number;
  duration: string;
  modules: number;
  totalLessons: number;
  progress?: number;
  currentLesson?: number;
  lastLessonId?: string;
  firstQuizId?: string;
  enrollments?: number;
  category?: string;
  level?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCourses(page: number = 1, limit: number = 10, search?: string): Observable<any> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    return this.http.get<any>(`${this.API_URL}/courses?${params.toString()}`)
      .pipe(map(response => response.data));
  }

  getCourse(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/courses/${id}`)
      .pipe(map(response => response.data));
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/courses/categories`)
      .pipe(map(response => response.data));
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/courses`, courseData)
      .pipe(map(response => response.data));
  }

  updateCourse(courseId: string, courseData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/courses/${courseId}`, courseData)
      .pipe(map(response => response.data));
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/courses/${courseId}`)
      .pipe(map(response => response));
  }

  getInstructorCourses(): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/courses/instructor/my-courses`)
      .pipe(map(response => response.data));
  }

  getInstructorStudents(): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/courses/instructor/students`)
      .pipe(map(response => response.data));
  }

  getInstructorAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/courses/instructor/analytics`)
      .pipe(map(response => response.data));
  }

  enrollInCourse(courseId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/courses/${courseId}/enroll`, {})
      .pipe(map(response => response.data));
  }

  publishCourse(courseId: string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/courses/${courseId}`, { isPublished: true })
      .pipe(map(response => response.data));
  }

  unpublishCourse(courseId: string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/courses/${courseId}`, { isPublished: false })
      .pipe(map(response => response.data));
  }
}