import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="bg-white rounded-3xl shadow-2xl flex max-w-6xl w-full max-h-[600px]">
        <div class="w-1/2 relative">
          <img alt="A young girl raising her hand in a classroom" 
               class="rounded-l-3xl h-full w-full object-cover" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuAinctr9Gq_bYdbdExol8ZNJ-_NUM2DYzZqb4ulu3x_iDfZOC6jojNTccaob-c2KsdyEmB8BzXuKjhgnxQ8RYQnsE9XI7pVrtwlta8S5vqWvx6-4pUdknM80uqBICROMZkZUu8LSKZ6Ea6Vdb38RYmFNnuvGinBmITzv0j37aXs7UgfdWn9XIPTUx-OAU5kQytZWDi3cPsYiK8LCKpsu4Wj1-9EPG3AlAOWeoiOCrkFFH29DhVRsLLQxDEwbuvFfhuxiph30_Fqxk4"/>
          <div class="absolute bottom-10 left-10 text-white">
            <h1 class="text-4xl font-bold">Welcome to LearnLink</h1>
            <p class="text-lg mt-2">Your gateway to online learning</p>
          </div>
        </div>
        <div class="w-1/2 p-16 flex flex-col justify-center">
          <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">Forgot Password</h2>
          <p class="text-gray-500 text-center mb-8">
            Enter your email address and we'll send you a link to reset your password
          </p>
          
          <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
          
          <div *ngIf="!emailSent">
            <form (ngSubmit)="onSubmit()" #forgotForm="ngForm">
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2" for="email">Email Address</label>
                <input 
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  id="email" 
                  placeholder="Enter your email address" 
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required/>
              </div>
              <button 
                class="w-full bg-teal-400 text-white py-3 rounded-full font-semibold hover:bg-teal-500 transition duration-300 mb-4" 
                type="submit"
                [disabled]="!forgotForm.valid || loading">
                {{ loading ? 'Sending...' : 'Send Reset Link' }}
              </button>
            </form>
            <div class="text-center">
              <a class="text-teal-500 hover:text-teal-600 text-sm" (click)="goToLogin()">
                Back to Login
              </a>
            </div>
          </div>

          <div *ngIf="emailSent" class="text-center">
            <div class="mb-6">
              <i class="material-icons text-6xl text-teal-400 mb-4">mail_outline</i>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">Check your email</h3>
              <p class="text-gray-500 mb-4">
                We've sent a password reset link to<br>
                <strong>{{ email }}</strong>
              </p>
              <p class="text-sm text-gray-400 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
            <button 
              class="w-full bg-teal-400 text-white py-3 rounded-full font-semibold hover:bg-teal-500 transition duration-300 mb-4"
              (click)="resendEmail()"
              [disabled]="loading">
              {{ loading ? 'Resending...' : 'Resend Email' }}
            </button>
            <div class="text-center">
              <a class="text-teal-500 hover:text-teal-600 text-sm" (click)="goToLogin()">
                Back to Login
              </a>
            </div>
          </div>
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
export class ForgotPassword {
  email = '';
  emailSent = false;
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.emailSent = true;
        } else {
          this.error = response.message || 'Failed to send reset email';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to send reset email. Please try again.';
      }
    });
  }

  resendEmail() {
    this.onSubmit();
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}