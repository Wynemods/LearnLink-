import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p class="text-gray-600 mt-1">Update your personal information and preferences</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="p-6 space-y-6">
            <!-- Profile Picture -->
            <div class="flex items-center space-x-6">
              <div class="relative">
                <img 
                  class="w-24 h-24 rounded-full object-cover border-4 border-gray-200" 
                  [src]="user.avatar" 
                  [alt]="user.firstName + ' ' + user.lastName"
                />
                <button 
                  type="button"
                  class="absolute bottom-0 right-0 bg-teal-400 rounded-full p-2 hover:bg-teal-500 transition duration-300"
                >
                  <i class="material-icons text-white text-sm">camera_alt</i>
                </button>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Profile Picture</h3>
                <p class="text-sm text-gray-600">Upload a new profile picture</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  class="hidden" 
                  #fileInput
                  (change)="onFileSelected($event)"
                />
                <button 
                  type="button"
                  class="mt-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  (click)="fileInput.click()"
                >
                  Change Picture
                </button>
              </div>
            </div>

            <!-- Personal Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input 
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  [(ngModel)]="user.firstName"
                  name="firstName"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input 
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  [(ngModel)]="user.lastName"
                  name="lastName"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                [(ngModel)]="user.email"
                name="email"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                [(ngModel)]="user.phone"
                name="phone"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                rows="4"
                [(ngModel)]="user.bio"
                name="bio"
                placeholder="Tell us about yourself"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                [(ngModel)]="user.location"
                name="location"
                placeholder="Enter your location"
              />
            </div>

            <!-- Preferences -->
            <div class="pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p class="text-sm text-gray-500">Receive email notifications about course updates</p>
                  </div>
                  <input 
                    type="checkbox"
                    class="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    [(ngModel)]="user.emailNotifications"
                    name="emailNotifications"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Marketing Emails</label>
                    <p class="text-sm text-gray-500">Receive emails about new courses and promotions</p>
                  </div>
                  <input 
                    type="checkbox"
                    class="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    [(ngModel)]="user.marketingEmails"
                    name="marketingEmails"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Profile Visibility</label>
                    <p class="text-sm text-gray-500">Make your profile visible to other users</p>
                  </div>
                  <input 
                    type="checkbox"
                    class="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    [(ngModel)]="user.profileVisibility"
                    name="profileVisibility"
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="button"
                class="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-300"
                (click)="onCancel()"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-6 py-3 bg-teal-400 text-white rounded-lg text-sm font-medium hover:bg-teal-500 transition duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
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
export class ProfileEdit implements OnInit {
  user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate learner and educator with a focus on technology and innovation.',
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    emailNotifications: true,
    marketingEmails: false,
    profileVisibility: true
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    console.log('Saving profile:', this.user);
    // Simulate API call
    setTimeout(() => {
      alert('Profile updated successfully!');
      this.router.navigate(['/profile']);
    }, 1000);
  }

  onCancel() {
    this.router.navigate(['/profile']);
  }
}
