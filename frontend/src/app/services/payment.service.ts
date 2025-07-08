import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, delay } from 'rxjs/operators';

export interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  courseId: string;
  accountReference?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    requestId: string;
    merchantRequestId: string;
    paymentId: string;
    enrolled: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  initiateMpesaPayment(paymentData: MpesaPaymentRequest): Observable<PaymentResponse> {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!token || !isAuthenticated) {
      return throwError(() => new Error('User must be logged in to make payments'));
    }

    // For production, use real API
    // return this.http.post<PaymentResponse>(`${this.API_URL}/payments/mpesa/stkpush`, paymentData);

    // For testing - simulate successful payment for logged-in users
    console.log('Processing test payment for course:', paymentData.courseId);
    console.log('User authenticated:', !!token);

    return of({
      success: true,
      message: 'Payment initiated successfully. Please check your phone for M-Pesa prompt.',
      data: {
        requestId: 'TEST_' + Date.now(),
        merchantRequestId: 'TEST_MERCHANT_' + Date.now(),
        paymentId: 'test-payment-' + Date.now(),
        enrolled: true
      }
    }).pipe(delay(2000)); // Simulate 2 second processing time
  }

  checkPaymentStatus(checkoutRequestId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!token || !isAuthenticated) {
      return throwError(() => new Error('User must be logged in'));
    }

    // For testing - always return successful status for authenticated users
    return of({
      success: true,
      message: 'Payment completed successfully',
      data: {
        status: 'COMPLETED',
        amount: 0,
        completedAt: new Date(),
        enrolled: true
      }
    }).pipe(delay(1000));

    // For production, use real API
    // return this.http.get<any>(`${this.API_URL}/payments/mpesa/status/${checkoutRequestId}`);
  }

  getPaymentHistory(): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/payments/history`)
      .pipe(map(response => response.data || []));
  }

  // Process course purchase - check authentication first
  buyCourse(courseId: string, phoneNumber: string, amount: number): Observable<PaymentResponse> {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!token || !isAuthenticated) {
      return throwError(() => new Error('Please log in to purchase courses'));
    }

    console.log('Processing payment for authenticated user');
    console.log('Course ID:', courseId, 'Amount:', amount);

    const paymentData: MpesaPaymentRequest = {
      phoneNumber: phoneNumber,
      amount: amount,
      courseId: courseId,
      accountReference: courseId
    };

    return this.initiateMpesaPayment(paymentData);
  }

  // Check if user is authenticated
  isUserAuthenticated(): boolean {
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
}