import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorService, Instructor } from '../../services/instructor.service';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style='font-family: Lexend, "Noto Sans", sans-serif;'>
      <div class="layout-container flex h-full grow flex-col">
        <div class="px-4 md:px-8 lg:px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-[1200px] flex-1">
            
            <!-- Header Section -->
            <div class="flex flex-wrap justify-between gap-3 p-4">
              <div class="flex min-w-72 flex-col gap-3">
                <p class="text-[#111418] tracking-light text-[32px] font-bold leading-tight">Meet Our Instructors</p>
                <p class="text-[#637488] text-sm font-normal leading-normal">
                  Learn from industry experts with years of experience. Our instructors are passionate about sharing their knowledge.
                </p>
              </div>
              
              <!-- Search and Filter Section -->
              <div class="flex gap-3 items-center">
                <div class="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Search instructors..." 
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [(ngModel)]="searchTerm"
                    (input)="onSearch()"
                  >
                  <select 
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [(ngModel)]="selectedSpecialty"
                    (change)="onSpecialtyChange()"
                  >
                    <option value="">All Specialties</option>
                    <option *ngFor="let specialty of specialties" [value]="specialty">{{ specialty }}</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Loading State -->
            <div *ngIf="loading" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            
            <!-- Error State -->
            <div *ngIf="error" class="flex justify-center items-center py-12">
              <div class="text-center">
                <p class="text-red-500 text-lg mb-4">{{ error }}</p>
                <button 
                  (click)="loadInstructors()"
                  class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
            
            <!-- Instructors Grid -->
            <div *ngIf="!loading && !error" class="px-4">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  {{ filteredInstructors.length }} Instructor{{ filteredInstructors.length !== 1 ? 's' : '' }}
                </h2>
                <div class="flex gap-2">
                  <button 
                    (click)="viewType = 'grid'"
                    [class]="'px-3 py-1 rounded-md text-sm ' + (viewType === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600')"
                  >
                    Grid
                  </button>
                  <button 
                    (click)="viewType = 'list'"
                    [class]="'px-3 py-1 rounded-md text-sm ' + (viewType === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600')"
                  >
                    List
                  </button>
                </div>
              </div>
              
              <!-- Grid View -->
              <div *ngIf="viewType === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div 
                  *ngFor="let instructor of filteredInstructors; trackBy: trackByInstructor" 
                  class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                  (click)="viewInstructorDetails(instructor.id)"
                >
                  <div class="aspect-square overflow-hidden">
                    <img 
                      [src]="getInstructorImage(instructor)" 
                      [alt]="getInstructorName(instructor)"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onerror="this.src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'"
                    >
                  </div>
                  <div class="p-4">
                    <h3 class="text-[#111418] text-lg font-semibold mb-1">{{ getInstructorName(instructor) }}</h3>
                    <p class="text-[#637488] text-sm mb-2">{{ instructor.title || 'Instructor' }}</p>
                    <p class="text-[#637488] text-xs mb-3">{{ instructor.specialty || 'Various Topics' }}</p>
                    
                    <div class="flex items-center justify-between text-sm">
                      <div class="flex items-center">
                        <span class="text-yellow-500 mr-1">⭐</span>
                        <span class="text-[#637488]">{{ instructor.rating || 4.5 }}</span>
                      </div>
                      <div class="text-[#637488]">
                        {{ instructor.totalStudents || instructor.students || 0 }} students
                      </div>
                    </div>
                    
                    <div class="mt-3 text-xs text-[#637488]">
                      {{ instructor.courses || 0 }} courses • {{ instructor.experience || 'Experienced' }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- List View -->
              <div *ngIf="viewType === 'list'" class="space-y-4">
                <div 
                  *ngFor="let instructor of filteredInstructors; trackBy: trackByInstructor"
                  class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 cursor-pointer"
                  (click)="viewInstructorDetails(instructor.id)"
                >
                  <div class="flex items-start gap-4">
                    <img 
                      [src]="getInstructorImage(instructor)" 
                      [alt]="getInstructorName(instructor)"
                      class="w-20 h-20 rounded-full object-cover flex-shrink-0"
                      onerror="this.src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'"
                    >
                    <div class="flex-1">
                      <h3 class="text-[#111418] text-xl font-semibold mb-1">{{ getInstructorName(instructor) }}</h3>
                      <p class="text-[#637488] text-sm mb-2">{{ instructor.title || 'Instructor' }}</p>
                      <p class="text-[#637488] text-sm mb-3">{{ instructor.bio || 'No bio available.' }}</p>
                      
                      <div class="flex items-center gap-4 text-sm text-[#637488]">
                        <div class="flex items-center">
                          <span class="text-yellow-500 mr-1">⭐</span>
                          <span>{{ instructor.rating || 4.5 }}</span>
                        </div>
                        <div>{{ instructor.totalStudents || instructor.students || 0 }} students</div>
                        <div>{{ instructor.courses || 0 }} courses</div>
                        <div>{{ instructor.experience || 'Experienced' }}</div>
                      </div>
                      
                      <div class="mt-2 text-xs text-[#637488]">
                        <strong>Expertise:</strong> {{ instructor.expertise || 'Various technologies' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div *ngIf="filteredInstructors.length === 0" class="text-center py-12">
                <div class="text-gray-400 text-6xl mb-4">👨‍🏫</div>
                <p class="text-[#637488] text-lg mb-2">No instructors found</p>
                <p class="text-[#637488] text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .instructor-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .instructor-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    .instructor-image {
      transition: transform 0.3s ease;
    }
    
    .instructor-card:hover .instructor-image {
      transform: scale(1.05);
    }
  `]
})
export class InstructorsComponent implements OnInit {
  instructors: Instructor[] = [];
  filteredInstructors: Instructor[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  selectedSpecialty = '';
  viewType: 'grid' | 'list' = 'grid';
  specialties: string[] = [];

  constructor(
    private router: Router,
    private instructorService: InstructorService
  ) {}

  ngOnInit() {
    this.loadInstructors();
  }

  async loadInstructors() {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await this.instructorService.getInstructors().toPromise();
      // Fix: Use the correct API response structure
      this.instructors = response?.data?.data || [];
      this.filteredInstructors = [...this.instructors];
      
      // Fix: Filter out undefined values before creating Set
      this.specialties = [...new Set(this.instructors
        .map(instructor => instructor.specialty)
        .filter(specialty => specialty !== undefined && specialty !== null)
      )];
      
    } catch (error) {
      console.error('Error loading instructors:', error);
      this.error = 'Failed to load instructors. Please try again.';
      this.instructors = [];
      this.filteredInstructors = [];
    } finally {
      this.loading = false;
    }
  }

  onSearch() {
    this.filterInstructors();
  }

  onSpecialtyChange() {
    this.filterInstructors();
  }

  private filterInstructors() {
    this.filteredInstructors = this.instructors.filter(instructor => {
      const matchesSearch = !this.searchTerm || 
        this.getInstructorName(instructor).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (instructor.specialty && instructor.specialty.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (instructor.expertise && instructor.expertise.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesSpecialty = !this.selectedSpecialty || instructor.specialty === this.selectedSpecialty;
      
      return matchesSearch && matchesSpecialty;
    });
  }

  viewInstructorDetails(instructorId: string) {
    this.router.navigate(['/instructors', instructorId]);
  }

  getInstructorName(instructor: Instructor): string {
    return instructor.name || `${instructor.firstName} ${instructor.lastName}`;
  }

  getInstructorImage(instructor: Instructor): string {
    return instructor.image || instructor.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
  }

  trackByInstructor(index: number, instructor: Instructor): string {
    return instructor.id;
  }
}