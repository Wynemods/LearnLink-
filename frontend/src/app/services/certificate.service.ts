import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getUserCertificates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/certificates/my-certificates`);
  }

  getCourseCertificate(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/certificates/me`);
  }

  createCertificate(courseId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/certificates`, data);
  }

  deleteCertificate(certId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/certificates/${certId}`);
  }
}