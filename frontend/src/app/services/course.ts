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

  getRecommendedCourses(limit: number = 10): Observable<Course[]> {
    return this.http.get<any>(`${this.API_URL}/courses/recommended?limit=${limit}`)
      .pipe(map(response => response.data));
  }

  getMyCourses(): Observable<Course[]> {
    return this.http.get<any>(`${this.API_URL}/courses/my-courses`)
      .pipe(map(response => response.data));
  }

  // Add the missing getCategories method
  getCategories(): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/courses/categories`)
      .pipe(map(response => response.data));
  }

  // Additional methods for course management
  enrollInCourse(courseId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/courses/${courseId}/enroll`, {})
      .pipe(map(response => response.data));
  }

  getCourseProgress(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/courses/${courseId}/progress`)
      .pipe(map(response => response.data));
  }

  updateCourseProgress(courseId: string, progressData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/courses/${courseId}/progress`, progressData)
      .pipe(map(response => response.data));
  }

  rateCourse(courseId: string, rating: number, comment?: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/courses/${courseId}/rate`, {
      rating,
      comment
    }).pipe(map(response => response.data));
  }

  searchCourses(query: string, filters?: any): Observable<any> {
    const params = new URLSearchParams();
    params.append('search', query);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
    }

    return this.http.get<any>(`${this.API_URL}/courses/search?${params.toString()}`)
      .pipe(map(response => response.data));
  }
}
