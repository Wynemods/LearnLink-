import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CertificateService } from '../../../services/certificate.service';

interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  score: number;
  issuedAt: Date;
  url: string;
}

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
          <p class="text-gray-600">View and download your earned certificates</p>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p class="mt-2 text-gray-600">Loading certificates...</p>
        </div>

        <div *ngIf="!loading && certificates.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <i class="material-icons text-6xl">emoji_events</i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
          <p class="text-gray-600 mb-4">Complete courses with 80% or higher score to earn certificates</p>
          <button (click)="browseCourses()" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Browse Courses
          </button>
        </div>

        <div *ngIf="!loading && certificates.length > 0" class="grid gap-6">
          <div *ngFor="let certificate of certificates" class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <i class="material-icons text-yellow-500 mr-2">emoji_events</i>
                  <h3 class="text-xl font-semibold text-gray-900">{{ certificate.courseTitle }}</h3>
                </div>
                <p class="text-gray-600 mb-2">Instructor: {{ certificate.instructorName }}</p>
                <p class="text-gray-600 mb-2">Score: {{ certificate.score }}%</p>
                <p class="text-gray-500 text-sm">Issued: {{ formatDate(certificate.issuedAt) }}</p>
              </div>
              <div class="flex space-x-2">
                <button 
                  (click)="viewCertificate(certificate)"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View
                </button>
                <button 
                  (click)="downloadCertificate(certificate)"
                  class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CertificateList implements OnInit {
  certificates: Certificate[] = [];
  loading = true;

  constructor(
    private certificateService: CertificateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCertificates();
  }

  async loadCertificates() {
    try {
      this.loading = true;
      const response = await this.certificateService.getUserCertificates().toPromise();
      this.certificates = response?.data || [];
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      this.loading = false;
    }
  }

  viewCertificate(certificate: Certificate) {
    window.open(certificate.url, '_blank');
  }

  downloadCertificate(certificate: Certificate) {
    // Implement download functionality
    const link = document.createElement('a');
    link.href = certificate.url;
    link.download = `${certificate.courseTitle}-Certificate.pdf`;
    link.click();
  }

  browseCourses() {
    this.router.navigate(['/courses']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}