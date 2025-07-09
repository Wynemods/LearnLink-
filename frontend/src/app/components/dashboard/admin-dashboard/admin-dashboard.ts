import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { AdminService, AdminStats, User, Course } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // UI State
  currentView: 'overview' | 'users' | 'courses' | 'analytics' = 'overview';
  isMobileMenuOpen = false;
  showUserForm = false;
  showCourseForm = false;
  editingUser: User | null = null;
  editingCourse: Course | null = null;
  
  // Data
  users: User[] = [];
  courses: Course[] = [];
  adminStats: AdminStats = {
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeUsers: 0,
    publishedCourses: 0,
    totalInstructors: 0,
    totalStudents: 0
  };
  
  // Analytics data
  analyticsData: {
    totalUsers: number;
    totalCourses: number;
    activeUsers: number;
    totalRevenue: number;
    newUsersThisMonth: number;
    coursesPublishedThisMonth: number;
    revenueThisMonth: number;
    userGrowthRate: number;
    courseGrowthRate: number;
    revenueGrowthRate: number;
  } = {
    totalUsers: 0,
    totalCourses: 0,
    activeUsers: 0,
    totalRevenue: 0,
    newUsersThisMonth: 0,
    coursesPublishedThisMonth: 0,
    revenueThisMonth: 0,
    userGrowthRate: 0,
    courseGrowthRate: 0,
    revenueGrowthRate: 0
  };
  
  // Date range filters
  startDate: string = '';
  endDate: string = '';
  
  // Filters and Search
  userSearchTerm = '';
  courseSearchTerm = '';
  selectedUserRole: string = 'ALL';
  selectedCourseStatus: string = 'ALL';
  
  // Pagination
  currentUserPage = 1;
  currentCoursePage = 1;
  itemsPerPage = 10;
  totalUsers = 0;
  totalCourses = 0;
  
  // Loading states
  loading = false;
  usersLoading = false;
  coursesLoading = false;
  
  // Forms
  userForm = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'STUDENT' as 'ADMIN' | 'INSTRUCTOR' | 'STUDENT',
    isActive: true,
    isVerified: false
  };
  
  courseForm = {
    title: '',
    description: '',
    price: 0,
    level: 'beginner',
    categoryId: '',
    isPublished: false
  };
  
  categories: any[] = [];
  
  constructor(
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService,
    private adminService: AdminService
  ) {}
  
  ngOnInit() {
    this.loadDashboardData();
    this.loadCategories();
    this.initializeDateRange();
    this.loadAnalyticsData();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  initializeDateRange() {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    
    this.endDate = today.toISOString().split('T')[0];
    this.startDate = lastMonth.toISOString().split('T')[0];
  }
  
  async loadDashboardData() {
    this.loading = true;
    try {
      await Promise.all([
        this.loadUsers(),
        this.loadCourses(),
        this.loadAdminStats()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading = false;
    }
  }
  
  async loadUsers() {
    this.usersLoading = true;
    try {
      // For development, use sample data
      this.users = this.adminService.getSampleUsers();
      this.totalUsers = this.users.length;
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      this.usersLoading = false;
    }
  }
  
  async loadCourses() {
    this.coursesLoading = true;
    try {
      // For development, use sample data
      this.courses = this.adminService.getSampleCourses();
      this.totalCourses = this.courses.length;
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      this.coursesLoading = false;
    }
  }
  
  async loadAdminStats() {
    try {
      // For development, use sample data
      this.adminStats = this.adminService.getSampleStats();
    } catch (error) {
      console.error('Error loading admin stats:', error);
    }
  }
  
  async loadAnalyticsData() {
    try {
      // For development, use sample analytics data
      this.analyticsData = {
        totalUsers: 1250,
        totalCourses: 85,
        activeUsers: 950,
        totalRevenue: 125000,
        newUsersThisMonth: 150,
        coursesPublishedThisMonth: 8,
        revenueThisMonth: 15000,
        userGrowthRate: 12.5,
        courseGrowthRate: 8.2,
        revenueGrowthRate: 15.3
      };
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  }
  
  async loadCategories() {
    try {
      const response = await this.courseService.getCategories().toPromise();
      this.categories = response?.data || [];
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }
  
  // Date range methods
  onDateRangeChange() {
    console.log('Date range changed:', this.startDate, this.endDate);
    // Add logic to filter data based on date range
  }
  
  applyDateRange() {
    console.log('Applying date range filter:', this.startDate, this.endDate);
    // Add logic to apply date range filter to analytics
    this.loadAnalyticsData();
  }
  
  // User Management
  openUserForm(user?: User) {
    this.editingUser = user || null;
    this.showUserForm = true;
    
    if (user) {
      this.userForm = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified
      };
    } else {
      this.resetUserForm();
    }
  }
  
  closeUserForm() {
    this.showUserForm = false;
    this.editingUser = null;
    this.resetUserForm();
  }
  
  resetUserForm() {
    this.userForm = {
      firstName: '',
      lastName: '',
      email: '',
      role: 'STUDENT',
      isActive: true,
      isVerified: false
    };
  }
  
  async submitUserForm() {
    try {
      if (this.editingUser) {
        // Update existing user
        const updatedUser: User = {
          ...this.editingUser,
          ...this.userForm
        };
        const index = this.users.findIndex(u => u.id === this.editingUser!.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      } else {
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          ...this.userForm,
          createdAt: new Date(),
          profilePicture: 'https://via.placeholder.com/150'
        };
        this.users.push(newUser);
      }
      
      this.closeUserForm();
      await this.loadUsers();
    } catch (error) {
      console.error('Error submitting user form:', error);
    }
  }
  
  async deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        this.users = this.users.filter(u => u.id !== userId);
        await this.loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }
  
  async toggleUserStatus(userId: string, isActive: boolean) {
    try {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        user.isActive = isActive;
      }
      await this.loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  }
  
  // Course Management
  openCourseForm(course?: Course) {
    this.editingCourse = course || null;
    this.showCourseForm = true;
    
    if (course) {
      this.courseForm = {
        title: course.title,
        description: course.description,
        price: course.price,
        level: course.level,
        categoryId: course.category.id,
        isPublished: course.isPublished
      };
    } else {
      this.resetCourseForm();
    }
  }
  
  closeCourseForm() {
    this.showCourseForm = false;
    this.editingCourse = null;
    this.resetCourseForm();
  }
  
  resetCourseForm() {
    this.courseForm = {
      title: '',
      description: '',
      price: 0,
      level: 'beginner',
      categoryId: '',
      isPublished: false
    };
  }
  
  async submitCourseForm() {
    try {
      if (this.editingCourse) {
        // Update existing course
        const index = this.courses.findIndex(c => c.id === this.editingCourse!.id);
        if (index !== -1) {
          this.courses[index] = { ...this.courses[index], ...this.courseForm };
        }
      } else {
        // Create new course
        const newCourse: Course = {
          id: Date.now().toString(),
          ...this.courseForm,
          instructor: {
            id: '1',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com'
          },
          category: {
            id: this.courseForm.categoryId,
            name: 'Default Category'
          },
          enrollments: 0,
          rating: 0,
          createdAt: new Date()
        };
        this.courses.push(newCourse);
      }
      
      this.closeCourseForm();
      await this.loadCourses();
    } catch (error) {
      console.error('Error submitting course form:', error);
    }
  }
  
  async deleteCourse(courseId: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        this.courses = this.courses.filter(c => c.id !== courseId);
        await this.loadCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  }
  
  async toggleCourseStatus(courseId: string, isPublished: boolean) {
    try {
      const course = this.courses.find(c => c.id === courseId);
      if (course) {
        course.isPublished = isPublished;
      }
      await this.loadCourses();
    } catch (error) {
      console.error('Error toggling course status:', error);
    }
  }
  
  // Search and Filter
  onUserSearch() {
    this.currentUserPage = 1;
    this.loadUsers();
  }
  
  onCourseSearch() {
    this.currentCoursePage = 1;
    this.loadCourses();
  }
  
  onUserRoleFilter() {
    this.currentUserPage = 1;
    this.loadUsers();
  }
  
  onCourseStatusFilter() {
    this.currentCoursePage = 1;
    this.loadCourses();
  }
  
  // Pagination
  get userPages(): number[] {
    const totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  get coursePages(): number[] {
    const totalPages = Math.ceil(this.totalCourses / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  goToUserPage(page: number) {
    this.currentUserPage = page;
    this.loadUsers();
  }
  
  goToCoursePage(page: number) {
    this.currentCoursePage = page;
    this.loadCourses();
  }
  
  // Navigation
  setCurrentView(view: 'overview' | 'users' | 'courses' | 'analytics') {
    this.currentView = view;
    this.isMobileMenuOpen = false;
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
  
  // Utility
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  getRoleColor(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  getStatusColor(isActive: boolean): string {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
}
