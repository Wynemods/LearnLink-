import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  profilePicture?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
  };
  enrollments: number;
  rating: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeUsers: number;
  publishedCourses: number;
  totalInstructors: number;
  totalStudents: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // User Management
  getUsers(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { params });
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  updateUserStatus(id: string, isActive: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/status`, { isActive });
  }

  // Course Management
  getCourses(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses`, { params });
  }

  getCourse(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${id}`);
  }

  updateCourse(id: string, courseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/courses/${id}`, courseData);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${id}`);
  }

  // Analytics
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getAnalytics(dateRange?: { startDate: string; endDate: string }): Observable<any> {
    const params = dateRange || {};
    return this.http.get(`${this.apiUrl}/analytics`, { params });
  }

  // Categories
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, categoryData);
  }

  updateCategory(id: string, categoryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories/${id}`, categoryData);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  // Payments
  getPayments(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments`, { params });
  }

  getPayment(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/${id}`);
  }

  // Sample data for development
  getSampleUsers(): User[] {
    return [
      {
        id: '1',
        firstName: 'Jimmy',
        lastName: 'Kimunyi',
        email: 'jkkimunyi@gmail.com',
        role: 'ADMIN',
        isActive: true,
        isVerified: true,
        createdAt: new Date('2024-01-01'),
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '2',
        firstName: 'Jimmy',
        lastName: 'K',
        email: 'jimmykimunyi@gmail.com',
        role: 'INSTRUCTOR',
        isActive: true,
        isVerified: true,
        createdAt: new Date('2024-01-02'),
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '3',
        firstName: 'Kimunyi',
        lastName: 'Jimmy',
        email: 'kimunyi.jimmy@gmail.com',
        role: 'STUDENT',
        isActive: true,
        isVerified: true,
        createdAt: new Date('2024-01-03'),
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      }
    ];
  }

  getSampleCourses(): Course[] {
    return [
      {
        id: '1',
        title: 'Complete React Development Course',
        description: 'Master React from basics to advanced concepts',
        price: 199.99,
        level: 'intermediate',
        instructor: {
          id: '2',
          firstName: 'Jimmy',
          lastName: 'K',
          email: 'jimmykimunyi@gmail.com'
        },
        category: {
          id: '1',
          name: 'Development'
        },
        enrollments: 150,
        rating: 4.8,
        isPublished: true,
        createdAt: new Date('2024-01-10')
      },
      {
        id: '2',
        title: 'Python for Data Science',
        description: 'Learn Python programming for data analysis',
        price: 179.99,
        level: 'beginner',
        instructor: {
          id: '2',
          firstName: 'Jimmy',
          lastName: 'K',
          email: 'jimmykimunyi@gmail.com'
        },
        category: {
          id: '2',
          name: 'Data Science'
        },
        enrollments: 89,
        rating: 4.9,
        isPublished: true,
        createdAt: new Date('2024-01-15')
      }
    ];
  }

  getSampleStats(): AdminStats {
    return {
      totalUsers: 1250,
      totalCourses: 85,
      totalRevenue: 125000,
      activeUsers: 950,
      publishedCourses: 78,
      totalInstructors: 25,
      totalStudents: 1200
    };
  }
}