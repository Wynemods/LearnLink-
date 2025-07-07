import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  accountNumber: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    requestId: string;
    merchantRequestId: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  initiateMpesaPayment(paymentData: MpesaPaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.API_URL}/payments/mpesa/stkpush`, paymentData);
  }

  checkPaymentStatus(checkoutRequestId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/payments/mpesa/status/${checkoutRequestId}`);
  }

  getPaymentHistory(): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/payments/history`);
  }
}