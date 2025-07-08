import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  heroImage?: string;
  image?: string;
  instructor: string;
  instructorId: string;
  instructorAvatar?: string;
  instructorBio?: string;
  instructorTitle?: string;
  instructorExperience?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  totalReviews: number;
  duration: string;
  level: string;
  modules: number;
  totalLessons?: number;
  totalSections?: number;
  totalLectures?: number;
  totalQuizzes?: number;
  progress?: number;
  currentLesson?: number;
  lastLessonId?: string;
  firstQuizId?: string;
  enrollments?: number;
  category?: string;
  categoryId?: string;
  categorySlug?: string;
  categoryIcon?: string;
  categoryColor?: string;
  features?: string[];
  learningOutcomes?: string[];
  requirements?: string[];
  whatYouLearn?: string[];
  courseContent?: string[];
  courseRequirements?: string[];
  targetAudience?: string[];
  curriculum?: {
    sections: Array<{
      id: string;
      title: string;
      lessons: Array<{
        id: string;
        title: string;
        duration: string;
        type: string;
        isPreview?: boolean;
      }>;
      quizzes: Array<{
        id: string;
        title: string;
        duration: number;
        order: number;
      }>;
      totalDuration: number;
    }>;
    totalSections: number;
    totalLessons: number;
    totalQuizzes: number;
  };
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
export class CourseService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCourses(page: number = 1, limit: number = 10, search?: string, category?: string, level?: string): Observable<ApiResponse<PaginatedResponse<Course>>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());
    
    if (search) {
      params = params.append('search', search);
    }
    if (category) {
      params = params.append('category', category);
    }
    if (level) {
      params = params.append('level', level);
    }

    return this.http.get<ApiResponse<PaginatedResponse<Course>>>(`${this.API_URL}/courses`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching courses:', error);
          throw error;
        })
      );
  }

  searchCourses(searchTerm: string, page: number = 1, limit: number = 10): Observable<ApiResponse<PaginatedResponse<Course>>> {
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Course>>>(`${this.API_URL}/courses/search`, { params })
      .pipe(
        catchError(error => {
          console.error('Error searching courses:', error);
          throw error;
        })
      );
  }

  getCourse(id: string): Observable<ApiResponse<Course>> {
    return this.http.get<ApiResponse<Course>>(`${this.API_URL}/courses/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching course:', error);
          throw error;
        })
      );
  }

  getCategories(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/courses/categories`)
      .pipe(
        catchError(error => {
          console.error('Error fetching categories:', error);
          throw error;
        })
      );
  }

  getInstructorCourses(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(`${this.API_URL}/courses/instructor/my-courses`);
  }

  getInstructorStudents(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/courses/instructor/students`);
  }

  getInstructorAnalytics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/courses/instructor/analytics`);
  }

  enrollInCourse(courseId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/courses/${courseId}/enroll`, {});
  }

  publishCourse(courseId: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.API_URL}/courses/${courseId}`, { isPublished: true });
  }

  unpublishCourse(courseId: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.API_URL}/courses/${courseId}`, { isPublished: false });
  }

  createCourse(courseData: any): Observable<ApiResponse<Course>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Add token if available
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    console.log('Creating course with data:', courseData);
    console.log('Headers:', headers);

    return this.http.post<ApiResponse<Course>>(`${this.API_URL}/courses`, courseData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error creating course:', error);
          throw error;
        })
      );
  }

  updateCourse(courseId: string, courseData: any): Observable<ApiResponse<Course>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.put<ApiResponse<Course>>(`${this.API_URL}/courses/${courseId}`, courseData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating course:', error);
          throw error;
        })
      );
  }

  deleteCourse(courseId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/courses/${courseId}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting course:', error);
          throw error;
        })
      );
  }
}