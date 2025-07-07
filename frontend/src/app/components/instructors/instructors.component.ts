import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InstructorService, Instructor } from '../../services/instructor.service';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style='font-family: Lexend, "Noto Sans", sans-serif;'>
      <div class="layout-container flex h-full grow flex-col">
        <div class="px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div class="flex flex-wrap justify-between gap-3 p-4">
              <div class="flex min-w-72 flex-col gap-3">
                <p class="text-[#111418] tracking-light text-[32px] font-bold leading-tight">Instructors</p>
                <p class="text-[#637488] text-sm font-normal leading-normal">Browse courses taught by our top instructors</p>
              </div>
            </div>
            
            <!-- Loading State -->
            <div *ngIf="loading" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
            
            <h2 class="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Instructors</h2>
            <div class="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div 
                *ngFor="let instructor of instructors" 
                class="flex flex-col gap-3 pb-3 cursor-pointer hover:transform hover:scale-105 transition-transform duration-300"
                (click)="viewInstructorDetails(instructor.id)"
              >
                <div
                  class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  [style.background-image]="'url(' + getInstructorImage(instructor) + ')'"
                ></div>
                <div>
                  <p class="text-[#111418] text-base font-medium leading-normal">{{ getInstructorName(instructor) }}</p>
                  <p class="text-[#637488] text-sm font-normal leading-normal">{{ instructor.specialty || 'Instructor' }}, {{ instructor.experience || 'Experienced' }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-yellow-500 text-sm mr-1">⭐</span>
                    <span class="text-[#637488] text-sm">{{ instructor.rating || 4.5 }} • {{ instructor.students || instructor.totalStudents || 0 }} students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class InstructorsComponent implements OnInit {
  instructors: Instructor[] = [];
  loading = false;

  constructor(
    private router: Router,
    private instructorService: InstructorService
  ) {}

  ngOnInit() {
    this.loadInstructors();
  }

  async loadInstructors() {
    this.loading = true;
    try {
      this.instructors = await this.instructorService.getInstructors().toPromise() || [];
    } catch (error) {
      console.error('Error loading instructors:', error);
      this.instructors = [];
    } finally {
      this.loading = false;
    }
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
}