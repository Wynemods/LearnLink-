import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div *ngIf="loading" class="py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p class="text-gray-600">Verifying your email...</p>
        </div>
        
        <div *ngIf="success" class="py-8">
          <i class="material-icons text-6xl text-green-500 mb-4">check_circle</i>
          <h2 class="text-2xl font-bold text-gray-700 mb-4">Email Verified!</h2>
          <p class="text-gray-600 mb-6">Your email has been successfully verified. You can now log in to your account.</p>
          <button 
            class="bg-teal-400 text-white py-3 px-6 rounded-full font-semibold hover:bg-teal-500 transition duration-300"
            (click)="goToLogin()">
            Go to Login
          </button>
        </div>
        
        <div *ngIf="error" class="py-8">
          <i class="material-icons text-6xl text-red-500 mb-4">error</i>
          <h2 class="text-2xl font-bold text-gray-700 mb-4">Verification Failed</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button 
            class="bg-teal-400 text-white py-3 px-6 rounded-full font-semibold hover:bg-teal-500 transition duration-300"
            (click)="goToLogin()">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class VerifyEmail implements OnInit {
  loading = true;
  success = false;
  error = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: Auth
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      } else {
        this.loading = false;
        this.error = 'Invalid verification token';
      }
    });
  }

  verifyEmail(token: string) {
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.success = true;
        } else {
          this.error = response.message || 'Email verification failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Email verification failed. The link may have expired.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}