import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, LoginRequest } from '../../../services/auth';

@Component({
  selector: 'app-login',
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
            <h1 class="text-4xl font-bold">Welcome Back!</h1>
            <p class="text-lg mt-2">Sign in to continue learning</p>
          </div>
        </div>
        <div class="w-1/2 p-16 flex flex-col justify-center">
          <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">Login</h2>
          
          <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
          
          <form (ngSubmit)="onLogin()" #loginForm="ngForm">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2" for="username">Email or Username</label>
              <input 
                class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
                id="username" 
                placeholder="Enter your email or username" 
                type="text"
                [(ngModel)]="loginData.username"
                name="username"
                required/>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2" for="password">Password</label>
              <div class="relative">
                <input 
                  class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  id="password" 
                  placeholder="Enter your password" 
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="loginData.password"
                  name="password"
                  required/>
                <span class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer" (click)="togglePassword()">
                  <i class="material-icons text-gray-400">{{ showPassword ? 'visibility' : 'visibility_off' }}</i>
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between mb-6">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  class="mr-2 leading-tight"
                  [(ngModel)]="loginData.rememberMe"
                  name="rememberMe"/>
                <span class="text-sm text-gray-700">Remember me</span>
              </label>
              <a class="text-sm text-teal-500 hover:text-teal-600" (click)="goToForgotPassword()">
                Forgot password?
              </a>
            </div>
            <button 
              class="w-full bg-teal-400 text-white py-3 rounded-full font-semibold hover:bg-teal-500 transition duration-300 mb-4" 
              type="submit"
              [disabled]="!loginForm.valid || loading">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
          
          <div class="text-center">
            <p class="text-gray-600">
              Don't have an account? 
              <a class="text-teal-500 hover:text-teal-600 font-semibold" (click)="goToRegister()">
                Sign up
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
export class Login {
  loginData: LoginRequest = {
    username: '',
    password: '',
    rememberMe: false
  };
  
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    this.loading = true;
    this.error = '';
    
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          // Redirect based on user role
          const user = response.data?.user;
          if (user?.role === 'ADMIN') {
            this.router.navigate(['/dashboard/admin']);
          } else if (user?.role === 'INSTRUCTOR') {
            this.router.navigate(['/dashboard/instructor']);
          } else {
            this.router.navigate(['/dashboard/student']);
          }
        } else {
          this.error = response.message || 'Login failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }
}
