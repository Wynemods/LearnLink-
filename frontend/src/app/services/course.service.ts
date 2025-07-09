import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getCourses(params?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params });
  }

  getCourse(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(this.apiUrl, courseData);
  }

  updateCourse(id: string, courseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, courseData);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Instructor-specific methods
  getInstructorCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/instructor/my-courses`);
  }

  getInstructorCoursesList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/instructor/courses-list`);
  }

  getInstructorStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/instructor/students`);
  }

  getInstructorAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/instructor/analytics`);
  }

  // Lesson Management
  createLesson(lessonData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lessons`, lessonData);
  }

  updateLesson(lessonId: string, lessonData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/lessons/${lessonId}`, lessonData);
  }

  deleteLesson(lessonId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/lessons/${lessonId}`);
  }

  getCourseLessons(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/lessons`);
  }

  // Quiz Management
  createQuiz(quizData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/quizzes`, quizData);
  }

  updateQuiz(quizId: string, quizData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/quizzes/${quizId}`, quizData);
  }

  deleteQuiz(quizId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/quizzes/${quizId}`);
  }

  getCourseQuizzes(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/quizzes`);
  }

  // Quiz Attempts (Student)
  submitQuiz(quizId: string, answers: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/quizzes/${quizId}/submit`, { answers });
  }

  getQuizResults(quizId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/quizzes/${quizId}/results`);
  }

  getMyQuizAttempts(courseId?: string): Observable<any> {
    // Fix the parameter handling
    const params: any = {};
    if (courseId) {
      params.courseId = courseId;
    }
    return this.http.get(`${this.apiUrl}/my-quiz-attempts`, { params });
  }

  retakeQuiz(quizId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/quizzes/${quizId}/retake`, {});
  }

  // Student methods
  getMyCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-courses`);
  }

  enrollInCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/enroll`, {});
  }

  getCourseProgress(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/progress`);
  }

  // Categories
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  // Certificates
  getUserCertificates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/certificates/my-certificates`);
  }

  // Course publishing
  publishCourse(courseId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}`, { isPublished: true });
  }

  unpublishCourse(courseId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}`, { isPublished: false });
  }
}