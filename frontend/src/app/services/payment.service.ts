import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentRequest {
  phoneNumber: string;
  amount: number;
  courseId: string;
}

export interface PaymentResponse {
  status: 'success' | 'failed';
  message: string;
  data?: {
    paymentId: string;
    enrolled: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) { }

  initiatePayment(paymentData: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}`, paymentData);
  }

  checkPaymentStatus(paymentId: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/status/${paymentId}`);
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    // Kenyan phone number validation
    const kenyaPhoneRegex = /^(\+254|254|0)[17]\d{8}$/;
    return kenyaPhoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }
}