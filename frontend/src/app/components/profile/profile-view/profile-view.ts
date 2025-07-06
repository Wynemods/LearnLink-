import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Profile Header -->
        <div class="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div class="h-32 bg-gradient-to-r from-teal-400 to-blue-500"></div>
          <div class="relative px-6 pb-6">
            <div class="flex items-center space-x-6">
              <div class="relative -mt-16">
                <img 
                  class="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" 
                  [src]="user.avatar" 
                  [alt]="user.name"
                />
                <div class="absolute bottom-0 right-0 bg-teal-400 rounded-full p-2">
                  <i class="material-icons text-white text-sm">camera_alt</i>
                </div>
              </div>
              <div class="pt-16 flex-1">
                <div class="flex items-center justify-between">
                  <div>
                    <h1 class="text-3xl font-bold text-gray-900">{{ user.name }}</h1>
                    <p class="text-gray-600">{{ user.email }}</p>
                    <p class="text-sm text-gray-500">{{ user.role }} • Member since {{ user.joinDate }}</p>
                  </div>
                  <a 
                    routerLink="/profile/edit"
                    class="bg-teal-400 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-500 transition duration-300 flex items-center space-x-2"
                  >
                    <i class="material-icons text-sm">edit</i>
                    <span>Edit Profile</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Navigation -->
        <div class="mt-8 bg-white shadow-lg rounded-2xl">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6">
              <a 
                routerLink="/profile" 
                routerLinkActive="border-teal-400 text-teal-600"
                class="py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Overview
              </a>
              <a 
                routerLink="/profile/purchase-history" 
                routerLinkActive="border-teal-400 text-teal-600"
                class="py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Purchase History
              </a>
              <a 
                routerLink="/profile/certificates" 
                routerLinkActive="border-teal-400 text-teal-600"
                class="py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Certificates
              </a>
            </nav>
          </div>

          <!-- Profile Content -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Personal Information -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <p class="text-gray-900">{{ user.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <p class="text-gray-900">{{ user.email }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Phone</label>
                    <p class="text-gray-900">{{ user.phone || 'Not provided' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Bio</label>
                    <p class="text-gray-900">{{ user.bio || 'No bio provided' }}</p>
                  </div>
                </div>
              </div>

              <!-- Learning Stats -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-700">Courses Enrolled</span>
                    <span class="text-2xl font-bold text-teal-600">{{ stats.coursesEnrolled }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-700">Courses Completed</span>
                    <span class="text-2xl font-bold text-green-600">{{ stats.coursesCompleted }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-700">Certificates Earned</span>
                    <span class="text-2xl font-bold text-purple-600">{{ stats.certificates }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-700">Total Hours</span>
                    <span class="text-2xl font-bold text-blue-600">{{ stats.totalHours }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div class="space-y-4">
                <div 
                  *ngFor="let activity of recentActivity" 
                  class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <i class="material-icons text-teal-600 text-sm">{{ activity.icon }}</i>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-xs text-gray-500">{{ activity.date }}</p>
                  </div>
                </div>
              </div>
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
export class ProfileView implements OnInit {
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate learner and educator with a focus on technology and innovation.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Student',
    joinDate: 'January 2024'
  };

  stats = {
    coursesEnrolled: 12,
    coursesCompleted: 8,
    certificates: 5,
    totalHours: 156
  };

  recentActivity = [
    {
      icon: 'school',
      title: 'Completed "Advanced JavaScript" course',
      date: '2 days ago'
    },
    {
      icon: 'certificate',
      title: 'Earned certificate in "React Development"',
      date: '1 week ago'
    },
    {
      icon: 'shopping_cart',
      title: 'Purchased "Python for Data Science" course',
      date: '2 weeks ago'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
