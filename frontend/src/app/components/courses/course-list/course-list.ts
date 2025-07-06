import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseService } from '../../../services/course';

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  instructorAvatar?: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  totalReviews: number;
  modules: number;
  progress?: number;
  currentLesson?: number;
  totalLessons?: number;
  category?: string;
  level?: string;
  enrollments?: number;
  createdAt?: Date;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.css']
})
export class CourseList implements OnInit {
  // Pagination
  currentPage = 1;
  coursesPerPage = 10;
  totalCourses = 0;
  
  // Data
  courses: Course[] = [];
  myCourses: Course[] = [];
  recommendedCourses: Course[] = [];
  categories: CourseCategory[] = [];
  
  // Loading states
  loading = false;
  loadingRecommended = false;
  loadingCategories = false;
  
  // Pagination for different sections
  recommendedCurrentPage = 0;
  recommendedCoursesPerPage = 8; // Show more courses
  
  constructor(
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadAllData();
  }

  private async loadAllData() {
    await Promise.all([
      this.loadCourses(),
      this.loadRecommendedCourses(),
      this.loadCategories(),
      this.loadMyCourses()
    ]);
  }

  async loadCourses() {
    this.loading = true;
    try {
      const response = await this.courseService.getCourses(
        this.currentPage, 
        this.coursesPerPage
      ).toPromise();
      
      this.courses = response.data || [];
      this.totalCourses = response.total || 0;
    } catch (error) {
      console.error('Error loading courses:', error);
      this.courses = [];
    } finally {
      this.loading = false;
    }
  }

  async loadRecommendedCourses() {
    this.loadingRecommended = true;
    try {
      // Load more recommended courses to show all
      const courses = await this.courseService.getRecommendedCourses(20).toPromise();
      this.recommendedCourses = courses || [];
    } catch (error) {
      console.error('Error loading recommended courses:', error);
      this.recommendedCourses = [];
    } finally {
      this.loadingRecommended = false;
    }
  }

  async loadMyCourses() {
    try {
      const courses = await this.courseService.getMyCourses().toPromise();
      this.myCourses = courses || [];
    } catch (error) {
      console.error('Error loading my courses:', error);
      // User might not be logged in or have no courses
      this.myCourses = [];
    }
  }

  async loadCategories() {
    this.loadingCategories = true;
    try {
      // You'll need to add this method to CourseService
      const response = await this.courseService.getCategories().toPromise();
      this.categories = response || [];
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to default categories
      this.categories = this.getDefaultCategories();
    } finally {
      this.loadingCategories = false;
    }
  }

  private getDefaultCategories(): CourseCategory[] {
    return [
      {
        id: 'development',
        name: 'Development',
        slug: 'development',
        icon: 'code',
        color: 'blue',
        description: 'Programming and software development courses'
      },
      {
        id: 'design',
        name: 'Design',
        slug: 'design',
        icon: 'brush',
        color: 'teal',
        description: 'UI/UX design and creative courses'
      },
      {
        id: 'business',
        name: 'Business',
        slug: 'business',
        icon: 'business_center',
        color: 'green',
        description: 'Business and entrepreneurship courses'
      },
      {
        id: 'data-science',
        name: 'Data Science',
        slug: 'data-science',
        icon: 'analytics',
        color: 'purple',
        description: 'Data analysis and machine learning courses'
      }
    ];
  }

  // Navigation methods
  continueLearning(courseId: string, lastLessonId: string = '1'): void {
    this.router.navigate(['/learn/course', courseId, 'lesson', lastLessonId]);
  }

  startQuiz(courseId: string, quizId: string): void {
    this.router.navigate(['/learn/course', courseId, 'quiz', quizId]);
  }

  viewCourseDetails(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  continueCourse(courseId: string) {
    this.router.navigate(['/learn/course', courseId, 'lesson', '1']);
  }

  selectCategory(categorySlug: string): void {
    this.router.navigate(['/courses'], { 
      queryParams: { category: categorySlug } 
    });
  }

  viewHistory(): void {
    this.router.navigate(['/dashboard/student/history']);
  }

  // Pagination for all courses
  get paginatedCourses() {
    return this.myCourses; // Show enrolled courses first
  }

  get totalPages(): number {
    return Math.ceil(this.totalCourses / this.coursesPerPage);
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  async previousPage(): Promise<void> {
    if (this.canGoPrevious) {
      this.currentPage--;
      await this.loadCourses();
    }
  }

  async nextPage(): Promise<void> {
    if (this.canGoNext) {
      this.currentPage++;
      await this.loadCourses();
    }
  }

  // Pagination for recommended courses
  get paginatedRecommendedCourses() {
    const start = this.recommendedCurrentPage * this.recommendedCoursesPerPage;
    return this.recommendedCourses.slice(start, start + this.recommendedCoursesPerPage);
  }

  get totalRecommendedPages(): number {
    return Math.ceil(this.recommendedCourses.length / this.recommendedCoursesPerPage);
  }

  get canGoNextRecommended(): boolean {
    return this.recommendedCurrentPage < this.totalRecommendedPages - 1;
  }

  get canGoPreviousRecommended(): boolean {
    return this.recommendedCurrentPage > 0;
  }

  previousRecommendedPage(): void {
    if (this.canGoPreviousRecommended) {
      this.recommendedCurrentPage--;
    }
  }

  nextRecommendedPage(): void {
    if (this.canGoNextRecommended) {
      this.recommendedCurrentPage++;
    }
  }

  seeAllRecommended(): void {
    this.router.navigate(['/courses'], { 
      queryParams: { recommended: 'true' } 
    });
  }

  // Utility methods
  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'development': 'code',
      'design': 'brush',
      'business': 'business_center',
      'data-science': 'analytics',
      'marketing': 'campaign'
    };
    return iconMap[category?.toLowerCase()] || 'school';
  }

  getCategoryColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'teal': 'bg-teal-100 text-teal-600',
      'blue': 'bg-blue-100 text-blue-600',
      'indigo': 'bg-indigo-100 text-indigo-600',
      'green': 'bg-green-100 text-green-600',
      'purple': 'bg-purple-100 text-purple-600',
      'orange': 'bg-orange-100 text-orange-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  }

  get hasNoCourses(): boolean {
    return this.myCourses.length === 0 && !this.loading;
  }

  get emptyStateMessage(): string {
    return "You haven't enrolled in any courses yet. Start your learning journey by exploring our course catalog!";
  }

  exploreCoursesCategory() {
    this.router.navigate(['/courses'], { 
      queryParams: { explore: 'true' } 
    });
  }

  // Format data for display
  getInstructorName(course: Course): string {
    return course.instructor || 'Unknown Instructor';
  }

  getInstructorAvatar(course: Course): string {
    return course.instructorAvatar || '/assets/images/default-avatar.png';
  }

  getCourseImage(course: Course): string {
    return course.image || '/assets/images/default-course.png';
  }

  getDiscountedPrice(course: Course): number {
    if (course.discount && course.originalPrice) {
      return course.originalPrice * (1 - course.discount / 100);
    }
    return course.price;
  }
}
