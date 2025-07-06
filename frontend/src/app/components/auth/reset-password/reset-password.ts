import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="bg-white rounded-3xl shadow-2xl flex max-w-6xl w-full h-[600px]">
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
          <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">Reset Password</h2>
          <p class="text-gray-500 text-center mb-8">
            Enter your new password below
          </p>
          
          <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
          
          <div *ngIf="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ success }}
          </div>
          
          <form (ngSubmit)="onSubmit()" #resetForm="ngForm">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2" for="password">New Password</label>
              <div class="relative">
                <input 
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  id="password" 
                  placeholder="Enter your new password" 
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  required
                  minlength="6"/>
                <span class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer" (click)="togglePassword()">
                  <i class="material-icons text-gray-400">{{ showPassword ? 'visibility' : 'visibility_off' }}</i>
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">Must contain at least one uppercase letter, one lowercase letter, and one number</p>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2" for="confirmPassword">Confirm New Password</label>
              <div class="relative">
                <input 
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  id="confirmPassword" 
                  placeholder="Confirm your new password" 
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  required/>
                <span class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer" (click)="toggleConfirmPassword()">
                  <i class="material-icons text-gray-400">{{ showConfirmPassword ? 'visibility' : 'visibility_off' }}</i>
                </span>
              </div>
            </div>
            <button 
              class="w-full bg-teal-400 text-white py-3 rounded-full font-semibold hover:bg-teal-500 transition duration-300 mb-4" 
              type="submit"
              [disabled]="!resetForm.valid || loading">
              {{ loading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </form>
          <div class="text-center">
            <a class="text-teal-500 hover:text-teal-600 text-sm" (click)="goToLogin()">
              Back to Login
            </a>
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
export class ResetPassword {
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  error = '';
  success = '';
  token = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: Auth
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.error = 'Invalid reset token';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(this.password)) {
      this.error = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.resetPassword(this.token, this.password, this.confirmPassword).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.success = 'Password reset successful! You can now login with your new password.';
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        } else {
          this.error = response.message || 'Password reset failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Password reset failed. Please try again.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
