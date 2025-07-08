import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorService, Instructor } from '../../../services/instructor.service';

@Component({
  selector: 'app-instructor-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor-detail.html',
  styleUrls: ['./instructor-detail.css']
})
export class InstructorDetail implements OnInit {
  instructor: Instructor | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private instructorService: InstructorService
  ) {}

  ngOnInit() {
    const instructorId = this.route.snapshot.paramMap.get('id');
    if (instructorId) {
      this.loadInstructor(instructorId);
    }
  }

  async loadInstructor(id: string) {
    this.loading = true;
    try {
      const response = await this.instructorService.getInstructor(id).toPromise();
      this.instructor = response?.data || null;
    } catch (error) {
      console.error('Error loading instructor:', error);
      this.instructor = null;
    } finally {
      this.loading = false;
    }
  }

  viewCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  goBack() {
    this.router.navigate(['/instructors']);
  }

  getInstructorName(): string {
    if (!this.instructor) return '';
    return this.instructor.name || `${this.instructor.firstName} ${this.instructor.lastName}`;
  }

  getInstructorImage(): string {
    if (!this.instructor) return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
    return this.instructor.image || this.instructor.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
  }

  getCourseImage(course: any): string {
    return course.image || course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop';
  }
}
