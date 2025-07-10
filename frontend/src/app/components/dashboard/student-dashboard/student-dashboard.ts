import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';
import { CertificateService } from '../../../services/certificate.service';
import { PaymentService } from '../../../services/payment.service';

export interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  progress: number;
  thumbnail: string;
  rating: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: Date;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  score: number;
  issuedAt: Date;
  url: string;
}

export interface PaymentHistory {
  id: string;
  courseTitle: string;
  amount: number;
  paymentDate: Date;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  method: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  type: 'course_completion' | 'streak' | 'quiz_master' | 'fast_learner';
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Make Math available in template
  Math = Math;

  // UI State
  isSidebarMinimized = false;
  isMobileMenuOpen = false;
  activeSection = 'overview';

  // Carousel states
  coursesCurrentIndex = 0;
  coursesPerView = 3;

  // Data
  enrolledCourses: EnrolledCourse[] = [];
  certificates: Certificate[] = [];
  paymentHistory: PaymentHistory[] = [];
  achievements: Achievement[] = [];

  // Stats
  totalCourses = 0;
  completedCourses = 0;
  totalCertificates = 0;
  totalHoursLearned = 0;
  currentStreak = 0;

  // Loading states
  loading = true;
  coursesLoading = false;
  certificatesLoading = false;
  paymentsLoading = false;

  // Quiz-related properties
  quizAttempts: any[] = [];
  availableQuizzes: any[] = [];
  showQuizModal = false;
  currentQuiz: any = null;
  currentQuizAnswers: any[] = [];

  constructor(
    private router: Router,
    public authService: AuthService,  // Make public for template access
    private courseService: CourseService,
    private certificateService: CertificateService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.loadDashboardData();
    this.loadQuizAttempts();
    this.generateSampleData(); // Remove this in production
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.isSidebarMinimized = !this.isSidebarMinimized;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.isMobileMenuOpen = false;

    if (section === 'quizzes') {
      this.loadAvailableQuizzes();
    }
  }

  async loadDashboardData() {
    this.loading = true;
    try {
      await Promise.all([
        this.loadEnrolledCourses(),
        this.loadCertificates(),
        this.loadPaymentHistory(),
        this.loadAchievements()
      ]);
      this.calculateStats();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadEnrolledCourses() {
    try {
      this.coursesLoading = true;
      const response = await this.courseService.getMyCourses().toPromise();
      const courses = response?.data || [];

      // Transform Course[] to EnrolledCourse[] - Fix the 'course' parameter type
      this.enrolledCourses = courses.map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        progress: course.progress || 0,
        thumbnail: course.thumbnail || course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
        rating: course.rating || 0,
        totalLessons: course.totalLessons || 0,
        completedLessons: Math.floor((course.progress || 0) / 100 * (course.totalLessons || 0)),
        lastAccessed: new Date() // Use current date since lastAccessed doesn't exist on Course interface
      }));
    } catch (error) {
      console.error('Error loading courses:', error);
      this.enrolledCourses = [];
    } finally {
      this.coursesLoading = false;
    }
  }

  async loadCertificates() {
    try {
      this.certificatesLoading = true;
      const response = await this.certificateService.getUserCertificates().toPromise();
      this.certificates = response?.data || [];
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      this.certificatesLoading = false;
    }
  }

  async loadPaymentHistory() {
    try {
      this.paymentsLoading = true;
      // Implement payment history endpoint
      this.paymentHistory = [];
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      this.paymentsLoading = false;
    }
  }

  async loadAchievements() {
    try {
      // Implement achievements endpoint
      this.achievements = [];
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }

  async loadQuizAttempts() {
    try {
      const response = await this.courseService.getMyQuizAttempts().toPromise();
      this.quizAttempts = response?.data || [];
    } catch (error) {
      console.error('Error loading quiz attempts:', error);
    }
  }

  async loadAvailableQuizzes() {
    try {
      // Load quizzes from enrolled courses
      const quizPromises = this.enrolledCourses.map(course =>
        this.courseService.getCourseQuizzes(course.id).toPromise()
      );

      const quizResults = await Promise.all(quizPromises);
      this.availableQuizzes = quizResults.flatMap(result => result?.data || []);
    } catch (error) {
      console.error('Error loading available quizzes:', error);
    }
  }

  async takeQuiz(quiz: any) {
    this.currentQuiz = quiz;
    this.currentQuizAnswers = quiz.questions.map((q: any) => ({ questionId: q.id, answer: null }));
    this.showQuizModal = true;
  }

  async submitQuiz() {
    if (!this.currentQuiz) return;

    try {
      const response = await this.courseService.submitQuiz(
        this.currentQuiz.id,
        this.currentQuizAnswers
      ).toPromise();

      if (response?.success) {
        alert(`Quiz submitted! Score: ${response.data.score}/${response.data.maxScore}`);
        this.closeQuizModal();
        await this.loadQuizAttempts();

        // Check if certificate was earned
        if (response.data.certificateEarned) {
          alert('Congratulations! You earned a certificate for this course!');
          await this.loadCertificates();
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  }

  closeQuizModal() {
    this.showQuizModal = false;
    this.currentQuiz = null;
    this.currentQuizAnswers = [];
  }

  calculateStats() {
    this.totalCourses = this.enrolledCourses.length;
    this.completedCourses = this.enrolledCourses.filter(course => course.progress >= 100).length;
    this.totalCertificates = this.certificates.length;
    this.totalHoursLearned = this.enrolledCourses.reduce((total, course) => total + (course.progress / 100) * 20, 0);
    this.currentStreak = 7; // Calculate actual streak
  }

  // Carousel navigation
  previousCourses() {
    if (this.coursesCurrentIndex > 0) {
      this.coursesCurrentIndex--;
    }
  }

  nextCourses() {
    const maxIndex = Math.max(0, this.enrolledCourses.length - this.coursesPerView);
    if (this.coursesCurrentIndex < maxIndex) {
      this.coursesCurrentIndex++;
    }
  }

  canGoToPrevious(): boolean {
    return this.coursesCurrentIndex > 0;
  }

  canGoToNext(): boolean {
    return this.coursesCurrentIndex < this.enrolledCourses.length - this.coursesPerView;
  }

  getVisibleCourses(): EnrolledCourse[] {
    return this.enrolledCourses.slice(this.coursesCurrentIndex, this.coursesCurrentIndex + this.coursesPerView);
  }

  // Course actions
  async continueCourse(course: EnrolledCourse) {
    try {
      // Fetch lessons for the course
      const response = await this.courseService.getCourseLessons(course.id).toPromise();
      const lessons = response?.data || [];
      if (!lessons.length) {
        alert('No lessons found for this course.');
        return;
      }
      // Find the lesson to continue: if progress is 0, use first lesson; else, use first incomplete or last accessed
      let lessonId = lessons[0].id;
      if (course.progress > 0) {
        // Try to find first incomplete lesson
        const incomplete = lessons.find((l: any) => !l.completed);
        lessonId = incomplete ? incomplete.id : lessons[0].id;
      }
      this.router.navigate(['/learn/course', course.id, 'lesson', lessonId]);
    } catch (error) {
      console.error('Error loading lessons for course:', error);
      alert('Could not load lessons for this course.');
    }
  }

  viewCourse(course: EnrolledCourse) {
    this.router.navigate(['/courses', course.id]);
  }

  // Certificate actions
  viewCertificate(certificate: Certificate) {
    window.open(certificate.url, '_blank');
  }

  downloadCertificate(certificate: Certificate) {
    const link = document.createElement('a');
    link.href = certificate.url;
    link.download = `${certificate.courseTitle}-Certificate.pdf`;
    link.click();
  }

  // Navigation
  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }

  async viewQuizResults(quizId: string) {
    try {
      const response = await this.courseService.getQuizResults(quizId).toPromise();
      if (response?.success) {
        // Display quiz results in a modal or navigate to results page
        console.log('Quiz results:', response.data);
      }
    } catch (error) {
      console.error('Error loading quiz results:', error);
    }
  }

  async retakeQuiz(quizId: string) {
    if (confirm('Are you sure you want to retake this quiz? Your previous score will be replaced.')) {
      try {
        const response = await this.courseService.retakeQuiz(quizId).toPromise();
        if (response?.success) {
          alert('Quiz reset successfully. You can now retake it.');
          await this.loadQuizAttempts();
        }
      } catch (error) {
        console.error('Error retaking quiz:', error);
        alert('Error retaking quiz. Please try again.');
      }
    }
  }

  // Utility methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getAchievementIcon(type: string): string {
    switch (type) {
      case 'course_completion': return 'emoji_events';
      case 'streak': return 'local_fire_department';
      case 'quiz_master': return 'quiz';
      case 'fast_learner': return 'speed';
      default: return 'star';
    }
  }

  getQuizStatusColor(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getQuizStatusText(percentage: number): string {
    if (percentage >= 80) return 'Passed';
    if (percentage >= 60) return 'Needs Improvement';
    return 'Failed';
  }

  // Sample data for demonstration
  generateSampleData() {
    this.enrolledCourses = [
      {
        id: '1',
        title: 'Complete React Development Course',
        description: 'Master React from basics to advanced concepts',
        instructor: 'Jimmy Kimunyi',
        progress: 75,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
        rating: 4.8,
        totalLessons: 45,
        completedLessons: 34,
        lastAccessed: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'Python for Data Science',
        description: 'Learn data analysis and machine learning',
        instructor: 'Sarah Johnson',
        progress: 45,
        thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=300&fit=crop',
        rating: 4.9,
        totalLessons: 38,
        completedLessons: 17,
        lastAccessed: new Date('2024-01-14')
      },
      {
        id: '3',
        title: 'UI/UX Design Fundamentals',
        description: 'Create beautiful and functional designs',
        instructor: 'Michael Chen',
        progress: 100,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
        rating: 4.7,
        totalLessons: 32,
        completedLessons: 32,
        lastAccessed: new Date('2024-01-10')
      },
      {
        id: '4',
        title: 'JavaScript Advanced Concepts',
        description: 'Deep dive into modern JavaScript',
        instructor: 'Emma Davis',
        progress: 20,
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
        rating: 4.6,
        totalLessons: 28,
        completedLessons: 6,
        lastAccessed: new Date('2024-01-12')
      }
    ];

    this.certificates = [
      {
        id: '1',
        courseId: '3',
        courseTitle: 'UI/UX Design Fundamentals',
        instructorName: 'Michael Chen',
        score: 95,
        issuedAt: new Date('2024-01-10'),
        url: '/certificates/uiux-cert.pdf'
      }
    ];

    this.paymentHistory = [
      {
        id: '1',
        courseTitle: 'Complete React Development Course',
        amount: 199.99,
        paymentDate: new Date('2024-01-01'),
        status: 'COMPLETED',
        method: 'M-Pesa'
      },
      {
        id: '2',
        courseTitle: 'Python for Data Science',
        amount: 179.99,
        paymentDate: new Date('2024-01-05'),
        status: 'COMPLETED',
        method: 'M-Pesa'
      }
    ];

    this.achievements = [
      {
        id: '1',
        title: 'First Course Completed',
        description: 'Completed your first course with 95% score',
        icon: 'emoji_events',
        color: 'text-yellow-500',
        earnedAt: new Date('2024-01-10'),
        type: 'course_completion'
      },
      {
        id: '2',
        title: '7-Day Streak',
        description: 'Learned for 7 consecutive days',
        icon: 'local_fire_department',
        color: 'text-orange-500',
        earnedAt: new Date('2024-01-15'),
        type: 'streak'
      }
    ];
  }
}