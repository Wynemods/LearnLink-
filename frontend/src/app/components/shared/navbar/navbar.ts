import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth, User } from '../../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="text-2xl font-bold text-teal-600">
              LearnLink
            </a>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a routerLink="/courses" class="text-gray-700 hover:text-teal-600 transition-colors">
              Courses
            </a>
            <a routerLink="/instructors" class="text-gray-700 hover:text-teal-600 transition-colors">
              Instructors
            </a>
            <a routerLink="/community" class="text-gray-700 hover:text-teal-600 transition-colors">
              Community
            </a>
          </div>

          <!-- User Profile / Auth -->
          <div class="flex items-center space-x-4">
            <div *ngIf="currentUser; else authButtons" class="relative">
              <!-- Profile Image with Dropdown -->
              <button 
                (click)="toggleDropdown()"
                class="flex items-center space-x-2 focus:outline-none"
              >
                <img 
                  [src]="currentUser.profilePicture || '/assets/default-avatar.png'" 
                  [alt]="currentUser.firstName + ' ' + currentUser.lastName"
                  class="w-8 h-8 rounded-full object-cover border-2 border-gray-300 hover:border-teal-500 transition-colors"
                />
                <span class="material-icons text-gray-500 text-sm">expand_more</span>
              </button>

              <!-- Dropdown Menu -->
              <div 
                *ngIf="showDropdown"
                class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <div class="py-2">
                  <!-- User Info -->
                  <div class="px-4 py-2 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-800">
                      {{ currentUser.firstName }} {{ currentUser.lastName }}
                    </p>
                    <p class="text-xs text-gray-500">{{ currentUser.email }}</p>
                  </div>

                  <!-- Menu Items -->
                  <a 
                    routerLink="/profile" 
                    (click)="closeDropdown()"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span class="material-icons text-gray-500 mr-3 text-sm">person</span>
                    Profile
                  </a>

                  <a 
                    routerLink="/dashboard" 
                    (click)="closeDropdown()"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span class="material-icons text-gray-500 mr-3 text-sm">dashboard</span>
                    Dashboard
                  </a>

                  <div class="border-t border-gray-100 mt-2 pt-2">
                    <button 
                      (click)="logout()"
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span class="material-icons text-red-500 mr-3 text-sm">logout</span>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Auth Buttons -->
            <ng-template #authButtons>
              <a 
                routerLink="/auth/login" 
                class="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Login
              </a>
              <a 
                routerLink="/auth/register" 
                class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Sign Up
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .material-icons {
      font-size: 20px;
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  showDropdown = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  logout() {
    this.authService.logout();
    this.closeDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showDropdown = false;
    }
  }
}