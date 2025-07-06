import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, RegisterRequest } from '../../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-100 flex items-center justify-center min-h-screen py-8">
      <div class="bg-white rounded-3xl shadow-2xl flex max-w-6xl w-full max-h-[700px]">
        <div class="w-1/2 relative">
          <img alt="Students learning together" 
               class="rounded-l-3xl h-full w-full object-cover" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuAinctr9Gq_bYdbdExol8ZNJ-_NUM2DYzZqb4ulu3x_iDfZOC6jojNTccaob-c2KsdyEmB8BzXuKjhgnxQ8RYQnsE9XI7pVrtwlta8S5vqWvx6-4pUdknM80uqBICROMZkZUu8LSKZ6Ea6Vdb38RYmFNnuvGinBmITzv0j37aXs7UgfdWn9XIPTUx-OAU5kQytZWDi3cPsYiK8LCKpsu4Wj1-9EPG3AlAOWeoiOCrkFFH29DhVRsLLQxDEwbuvFfhuxiph30_Fqxk4"/>
          <div class="absolute bottom-10 left-10 text-white">
            <h1 class="text-4xl font-bold">Join LearnLink</h1>
            <p class="text-lg mt-2">Start your learning journey today</p>
          </div>
        </div>
        <div class="w-1/2 p-12 flex flex-col justify-center overflow-y-auto">
          <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">Create Account</h2>
          
          <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
          
          <div *ngIf="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ success }}
          </div>
          
          <form (ngSubmit)="onRegister()" #registerForm="ngForm">
            <div class="flex space-x-4 mb-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-2" for="firstName">First Name</label>
                <input 
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  id="firstName" 
                  placeholder="Enter your first name" 
                  type="text"
                  [(ngModel)]="registerData.firstName"
                  name="firstName"
                  required/>
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-2" for="lastName">Last Name</label>
                <input 
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  id="lastName" 
                  placeholder="Enter your last name" 
                  type="text"
                  [(ngModel)]="registerData.lastName"
                  name="lastName"
                  required/>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2" for="email">Email</label>
              <input 
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
                id="email" 
                placeholder="Enter your email" 
                type="email"
                [(ngModel)]="registerData.email"
                name="email"
                required/>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2" for="accountType">Account Type</label>
              <select 
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                id="accountType"
                [(ngModel)]="registerData.accountType"
                name="accountType"
                required>
                <option value="">Select account type</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2" for="password">Password</label>
              <div class="relative">
                <input 
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  id="password" 
                  placeholder="Enter your password" 
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="registerData.password"
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
              <label class="block text-sm font-medium text-gray-700 mb-2" for="confirmPassword">Confirm Password</label>
              <div class="relative">
                <input 
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  id="confirmPassword" 
                  placeholder="Confirm your password" 
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  [(ngModel)]="registerData.confirmPassword"
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
              [disabled]="!registerForm.valid || loading">
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
          
          <div class="text-center">
            <p class="text-gray-600">
              Already have an account? 
              <a class="text-teal-500 hover:text-teal-600 font-semibold" (click)="goToLogin()">
                Sign in
              </a>
            </p>
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
export class Register {
  registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'student'
  };
  
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  error = '';
  success = '';

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister() {
    // Validate passwords match
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(this.registerData.password)) {
      this.error = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.success = response.message || 'Registration successful! Please check your email to verify your account.';
          // Clear form
          this.registerData = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            accountType: 'student'
          };
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        } else {
          this.error = response.message || 'Registration failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
