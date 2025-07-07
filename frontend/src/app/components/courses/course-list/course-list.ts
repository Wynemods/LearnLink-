import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
  coursesPerPage = 12;
  totalCourses = 0;
  
  // Data
  courses: Course[] = [];
  myCourses: Course[] = [];
  categories: CourseCategory[] = [];
  selectedCategory: string | null = null;
  
  // Loading states
  loading = false;
  loadingCategories = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    // Check for category filter from query params
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || null;
      this.currentPage = 1; // Reset to first page when category changes
      this.loadAllData();
    });
  }

  private async loadAllData() {
    await Promise.all([
      this.loadCourses(),
      this.loadCategories(),
      this.loadMyCourses()
    ]);
  }

  async loadCourses() {
    this.loading = true;
    try {
      const response = await this.courseService.getCourses(
        this.currentPage, 
        this.coursesPerPage,
        undefined // search term
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

  async loadMyCourses() {
    try {
      const courses = await this.courseService.getMyCourses().toPromise();
      this.myCourses = courses || [];
    } catch (error) {
      console.error('Error loading my courses:', error);
      this.myCourses = [];
    }
  }

  async loadCategories() {
    this.loadingCategories = true;
    try {
      const response = await this.courseService.getCategories().toPromise();
      this.categories = response || [];
    } catch (error) {
      console.error('Error loading categories:', error);
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
      },
      {
        id: 'marketing',
        name: 'Marketing',
        slug: 'marketing',
        icon: 'campaign',
        color: 'orange',
        description: 'Digital marketing and growth courses'
      }
    ];
  }

  // Category filtering
  selectCategory(categorySlug: string): void {
    this.router.navigate(['/courses'], { 
      queryParams: { category: categorySlug } 
    });
  }

  clearCategoryFilter(): void {
    this.router.navigate(['/courses']);
  }

  getCategoryName(slug: string): string {
    const category = this.categories.find(c => c.slug === slug);
    return category ? category.name : 'Category';
  }

  // Filtered courses based on selected category
  get filteredCourses(): Course[] {
    if (!this.selectedCategory) {
      return this.courses;
    }
    
    return this.courses.filter(course => {
      const categoryMatch = course.category?.toLowerCase() === this.selectedCategory?.toLowerCase();
      return categoryMatch;
    });
  }

  get paginatedFilteredCourses(): Course[] {
    const start = (this.currentPage - 1) * this.coursesPerPage;
    return this.filteredCourses.slice(start, start + this.coursesPerPage);
  }

  get totalFilteredPages(): number {
    return Math.ceil(this.filteredCourses.length / this.coursesPerPage);
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalFilteredPages;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  async previousPage(): Promise<void> {
    if (this.canGoPrevious) {
      this.currentPage--;
      if (!this.selectedCategory) {
        await this.loadCourses();
      }
    }
  }

  async nextPage(): Promise<void> {
    if (this.canGoNext) {
      this.currentPage++;
      if (!this.selectedCategory) {
        await this.loadCourses();
      }
    }
  }

  // Navigation methods
  continueLearning(courseId: string, lastLessonId: string = '1'): void {
    this.router.navigate(['/learn/course', courseId, 'lesson', lastLessonId]);
  }

  viewCourseDetails(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  continueCourse(courseId: string) {
    this.router.navigate(['/learn/course', courseId, 'lesson', '1']);
  }

  viewHistory(): void {
    this.router.navigate(['/dashboard/student/history']);
  }

  // Utility methods
  getCategoryIcon(category: string | undefined): string {
    if (!category) return 'school';
    
    const iconMap: { [key: string]: string } = {
      'development': 'code',
      'design': 'brush',
      'business': 'business_center',
      'data-science': 'analytics',
      'marketing': 'campaign'
    };
    return iconMap[category.toLowerCase()] || 'school';
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
    return this.filteredCourses.length === 0 && !this.loading;
  }

  get emptyStateMessage(): string {
    if (this.selectedCategory) {
      return `No courses found in ${this.getCategoryName(this.selectedCategory)} category.`;
    }
    return "You haven't enrolled in any courses yet. Start your learning journey by exploring our course catalog!";
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
