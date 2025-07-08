import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { AuthService } from './auth.service'; // adjust path as needed

export interface PaymentRequest {
  phoneNumber: string;
  amount: number;
  courseId: string;
}

export interface PaymentResponse {
  success: boolean;
  status? : string,
  message: string;
  data?: {
    paymentId: string,
        
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

 

  // Process course purchase - check authentication first
  buyCourse(courseId: string, phoneNumber: string, amount: number): Observable<PaymentResponse> {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!token || !isAuthenticated) {
      return throwError(() => new Error('Please log in to purchase courses'));
    }

    console.log('Processing payment for authenticated user');
    console.log('Course ID:', courseId, 'Amount:', amount);

    const paymentData: PaymentRequest = {
      phoneNumber: phoneNumber,
      amount: amount,
      courseId: courseId,
      
    };

    return this.initiatePayment(paymentData);
  }

  // Check if user is authenticated
  isUserAuthenticated(): boolean {
    // Use the same logic as AuthService
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return !!(token && isAuthenticated);
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber: string): boolean {
    const kenyanPhoneRegex = /^(\+254|254|0)?[17]\d{8}$/;
    return kenyanPhoneRegex.test(phoneNumber);
  }

  // Format phone number for display
  formatPhoneNumber(phoneNumber: string): string {
    let cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.startsWith('254')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+254${cleaned.slice(1)}`;
    } else if (cleaned.length === 9) {
      return `+254${cleaned}`;
    }

    return phoneNumber;
  }

  // Initiate payment (Mpesa or card)
  initiatePayment(paymentData: PaymentRequest): Observable<PaymentResponse> {
    const token = this.authService.getToken();
    console.log('initiatePayment: token from AuthService:', token);
    if (!token) {
      return throwError(() => new Error('Please log in to complete your purchase'));
    }
    return this.http.post<PaymentResponse>(
      `${this.API_URL}/payments/initiate`,
      paymentData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}