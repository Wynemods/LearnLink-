import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: QuizOption[];
  points: number;
  explanation?: string;
  selectedAnswer?: string;
  isAnswered?: boolean;
}

export interface QuizOption {
  id: string;
  text: string;
  correct?: boolean; // Only visible to instructors
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  courseName?: string;
  duration: number;
  order: number;
  isPublished: boolean;
  questions: QuizQuestion[];
  totalQuestions: number;
  totalPoints: number;
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: any[];
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent?: number;
  isCompleted: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface QuizResult {
  attemptId: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  answers: any[];
  timeSpent?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createQuiz(quizData: any): Observable<ApiResponse<Quiz>> {
    return this.http.post<ApiResponse<Quiz>>(`${this.API_URL}/quizzes`, quizData)
      .pipe(
        catchError(error => {
          console.error('Error creating quiz:', error);
          throw error;
        })
      );
  }

  getQuizzesByCourse(courseId: string): Observable<ApiResponse<Quiz[]>> {
    return this.http.get<ApiResponse<Quiz[]>>(`${this.API_URL}/quizzes/course/${courseId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching quizzes:', error);
          throw error;
        })
      );
  }

  getQuiz(quizId: string): Observable<ApiResponse<Quiz>> {
    return this.http.get<ApiResponse<Quiz>>(`${this.API_URL}/quizzes/${quizId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching quiz:', error);
          throw error;
        })
      );
  }

  updateQuiz(quizId: string, quizData: any): Observable<ApiResponse<Quiz>> {
    return this.http.put<ApiResponse<Quiz>>(`${this.API_URL}/quizzes/${quizId}`, quizData)
      .pipe(
        catchError(error => {
          console.error('Error updating quiz:', error);
          throw error;
        })
      );
  }

  deleteQuiz(quizId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/quizzes/${quizId}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting quiz:', error);
          throw error;
        })
      );
  }

  submitQuiz(quizId: string, answers: any[], timeSpent?: number): Observable<ApiResponse<QuizResult>> {
    const submitData = {
      answers,
      timeSpent
    };

    return this.http.post<ApiResponse<QuizResult>>(`${this.API_URL}/quizzes/${quizId}/submit`, submitData)
      .pipe(
        catchError(error => {
          console.error('Error submitting quiz:', error);
          throw error;
        })
      );
  }

  getQuizAttempt(quizId: string): Observable<ApiResponse<QuizAttempt>> {
    return this.http.get<ApiResponse<QuizAttempt>>(`${this.API_URL}/quizzes/${quizId}/attempt`)
      .pipe(
        catchError(error => {
          console.error('Error fetching quiz attempt:', error);
          throw error;
        })
      );
  }
}