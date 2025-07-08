import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessagingService } from '../../messaging/services/messaging.service';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Conversation, Message, MessageInput } from '../../messaging/interfaces/message.interface';

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoFile?: File;
  documentFile?: File;
  status: 'draft' | 'published';
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledDate: Date;
  progress: number;
  rating: number;
  coursesEnrolled: string[];
  lastActive: Date;
  courseTitle?: string; // Add this property
  courseId?: string;    // Add this property
}

export interface OverviewStats {
  totalCourses: number;
  totalStudents: number;
  completedCourses: number;
  averageRating: number;
}

export interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  color: string;
}

export interface TopStudent {
  id: string;
  name: string;
  avatar: string;
  coursesCount: number;
  progressChange: number;
}

export interface CourseFormData {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  categoryId: string;
  thumbnail?: string;
  heroImage?: string;
  features: string[];
  learningOutcomes: string[];
  requirements: string[];
  whatYouLearn: string[];
  courseContent: string[];
  courseRequirements: string[];
  targetAudience: string[];
  instructorBio?: string;
  instructorExperience?: string;
  isPublished: boolean;
  modules?: number;
  curriculum?: {
    sections: any[];
  };
  totalSections?: number;
  totalLectures?: number;
  totalDuration?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.css'
})
export class InstructorDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isMobileMenuOpen = false;
  currentView: 'overview' | 'students' | 'courses' | 'messages' | 'live-sessions' = 'overview';
  
  // Data from backend
  myCourses: any[] = [];
  myStudents: Student[] = [];
  analytics: any = {};
  
  // Form data
  lessonTitle = '';
  lessonContent = '';
  
  // File upload
  selectedVideoFile: File | null = null;
  selectedDocumentFile: File | null = null;
  
  // Messaging
  conversations: Conversation[] = [];
  activeConversation: Conversation | null = null;
  searchTerm = '';
  newMessage = '';
  
  // Overview data
  overviewStats: OverviewStats = {
    totalCourses: 0,
    totalStudents: 0,
    completedCourses: 0,
    averageRating: 0
  };

  courseProgress: CourseProgress[] = [];

  topStudents: TopStudent[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1de?w=150&h=150&fit=crop&crop=face',
      coursesCount: 3,
      progressChange: 12
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      coursesCount: 2,
      progressChange: 8
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      coursesCount: 4,
      progressChange: -5
    }
  ];

  // Course creation form
  showCourseForm = false;
  categories: Category[] = [];
  courseForm: CourseFormData = {
    title: '',
    description: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    duration: '',
    level: 'beginner',
    categoryId: '',
    thumbnail: '',
    heroImage: '',
    features: [],
    learningOutcomes: [],
    requirements: [],
    whatYouLearn: [],
    courseContent: [],
    courseRequirements: [],
    targetAudience: [],
    instructorBio: '',
    instructorExperience: '',
    isPublished: false
  };
  
  // Form helpers
  newFeature = '';
  newLearningOutcome = '';
  newRequirement = '';
  newTargetAudience = '';
  
  constructor(
    private router: Router,
    private messagingService: MessagingService,
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeMessaging();
    this.loadInstructorData();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeMessaging(): void {
    this.messagingService.getConversations().subscribe(
      (conversations: Conversation[]) => {
        this.conversations = conversations;
      }
    );
  }

  async loadInstructorData() {
    try {
      // Load instructor courses
      const coursesResponse = await this.courseService.getInstructorCourses().toPromise();
      this.myCourses = coursesResponse?.data || [];

      // Load instructor students
      const studentsResponse = await this.courseService.getInstructorStudents().toPromise();
      this.myStudents = studentsResponse?.data || [];

      // Load analytics
      const analyticsResponse = await this.courseService.getInstructorAnalytics().toPromise();
      this.analytics = analyticsResponse?.data || {};

      // Update overview stats with real data
      this.overviewStats = {
        totalCourses: this.analytics.totalCourses || this.myCourses.length,
        totalStudents: this.analytics.totalStudents || 0,
        completedCourses: this.myCourses.filter(c => c.isPublished).length,
        averageRating: this.analytics.averageRating || 0
      };

      this.courseProgress = this.analytics.courseProgress || [];
    } catch (error) {
      console.error('Error loading instructor data:', error);
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

  createNewCourse() {
    this.showCourseForm = true;
    this.resetCourseForm();
  }

  resetCourseForm() {
    this.courseForm = {
      title: '',
      description: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      duration: '',
      level: 'beginner',
      categoryId: '',
      thumbnail: '',
      heroImage: '',
      features: [],
      learningOutcomes: [],
      requirements: [],
      whatYouLearn: [],
      courseContent: [],
      courseRequirements: [],
      targetAudience: [],
      instructorBio: '',
      instructorExperience: '',
      isPublished: false
    };
    this.newFeature = '';
    this.newLearningOutcome = '';
    this.newRequirement = '';
    this.newTargetAudience = '';
  }

  closeCourseForm() {
    this.showCourseForm = false;
    this.resetCourseForm();
  }

  // Array management helpers
  addFeature() {
    if (this.newFeature.trim()) {
      this.courseForm.features.push(this.newFeature.trim());
      this.newFeature = '';
    }
  }

  removeFeature(index: number) {
    this.courseForm.features.splice(index, 1);
  }

  addLearningOutcome() {
    if (this.newLearningOutcome.trim()) {
      this.courseForm.learningOutcomes.push(this.newLearningOutcome.trim());
      this.courseForm.whatYouLearn.push(this.newLearningOutcome.trim());
      this.newLearningOutcome = '';
    }
  }

  removeLearningOutcome(index: number) {
    this.courseForm.learningOutcomes.splice(index, 1);
    this.courseForm.whatYouLearn.splice(index, 1);
  }

  addRequirement() {
    if (this.newRequirement.trim()) {
      this.courseForm.requirements.push(this.newRequirement.trim());
      this.courseForm.courseRequirements.push(this.newRequirement.trim());
      this.newRequirement = '';
    }
  }

  removeRequirement(index: number) {
    this.courseForm.requirements.splice(index, 1);
    this.courseForm.courseRequirements.splice(index, 1);
  }

  addTargetAudience() {
    if (this.newTargetAudience.trim()) {
      this.courseForm.targetAudience.push(this.newTargetAudience.trim());
      this.newTargetAudience = '';
    }
  }

  removeTargetAudience(index: number) {
    this.courseForm.targetAudience.splice(index, 1);
  }

  async submitCourse() {
    if (!this.validateCourseForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      const courseData = {
        title: this.courseForm.title.trim(),
        description: this.courseForm.description.trim(),
        categoryId: this.courseForm.categoryId,
        price: Number(this.courseForm.price),
        originalPrice: Number(this.courseForm.originalPrice) || undefined,
        discount: Number(this.courseForm.discount) || undefined,
        duration: this.courseForm.duration.trim(),
        level: this.courseForm.level,
        modules: Number(this.courseForm.modules) || 1,
        thumbnail: this.courseForm.thumbnail || '',
        heroImage: this.courseForm.heroImage || '',
        features: this.courseForm.features.filter((f: string) => f.trim() !== ''),
        learningOutcomes: this.courseForm.learningOutcomes.filter((l: string) => l.trim() !== ''),
        requirements: this.courseForm.requirements.filter((r: string) => r.trim() !== ''),
        isPublished: this.courseForm.isPublished
      };

      console.log('Submitting course data:', courseData);

      const response = await this.courseService.createCourse(courseData).toPromise();
      console.log('Course created successfully:', response);

      // Reset form and close modal
      this.resetCourseForm();
      this.closeCourseForm();
      
      // Reload instructor data
      await this.loadInstructorData();
      
    } catch (error) {
      console.error('Error creating course:', error);
      // Handle error appropriately - show user message
    }
  }

  validateCourseForm(): boolean {
    const form = this.courseForm;
    
    if (!form.title || form.title.trim() === '') {
      console.log('Title is required');
      return false;
    }
    
    if (!form.description || form.description.trim() === '') {
      console.log('Description is required');
      return false;
    }
    
    if (!form.categoryId) {
      console.log('Category is required');
      return false;
    }
    
    if (!form.price || form.price < 0) {
      console.log('Valid price is required');
      return false;
    }
    
    if (!form.duration || form.duration.trim() === '') {
      console.log('Duration is required');
      return false;
    }
    
    if (!form.level) {
      console.log('Level is required');
      return false;
    }
    
    return true;
  }

  // Additional methods for messaging and file handling
  selectVideoFile(event: any) {
    this.selectedVideoFile = event.target.files[0];
  }

  selectDocumentFile(event: any) {
    this.selectedDocumentFile = event.target.files[0];
  }

  sendMessage() {
    if (this.newMessage.trim() && this.activeConversation) {
      const messageInput: MessageInput = {
        conversationId: this.activeConversation.id,
        content: this.newMessage.trim()
      };

      this.messagingService.sendMessage(messageInput).subscribe({
        next: (message: Message) => {
          // Handle successful message send
          this.newMessage = '';
        },
        error: (error: any) => {
          console.error('Error sending message:', error);
        }
      });
    }
  }

  selectConversation(conversation: Conversation) {
    this.activeConversation = conversation;
  }

  get filteredConversations(): Conversation[] {
    if (!this.searchTerm) {
      return this.conversations;
    }
    
    return this.conversations.filter((conv: Conversation) =>
      conv.participants.some((p: any) =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  setCurrentView(view: 'overview' | 'students' | 'courses' | 'messages' | 'live-sessions') {
    this.currentView = view;
    this.isMobileMenuOpen = false;
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }

  editCourse(courseId: string) {
    this.router.navigate(['/courses/edit', courseId]);
  }

  viewCourseDetails(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  async deleteCourse(courseId: string) {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await this.courseService.deleteCourse(courseId).toPromise();
        alert('Course deleted successfully!');
        this.loadInstructorData(); // Refresh the course list
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course. Please try again.');
      }
    }
  }

  async publishCourse(courseId: string) {
    try {
      await this.courseService.publishCourse(courseId).toPromise();
      alert('Course published successfully!');
      this.loadInstructorData(); // Refresh the course list
    } catch (error) {
      console.error('Error publishing course:', error);
      alert('Error publishing course. Please try again.');
    }
  }

  async unpublishCourse(courseId: string) {
    try {
      await this.courseService.unpublishCourse(courseId).toPromise();
      alert('Course unpublished successfully!');
      this.loadInstructorData(); // Refresh the course list
    } catch (error) {
      console.error('Error unpublishing course:', error);
      alert('Error unpublishing course. Please try again.');
    }
  }
}
