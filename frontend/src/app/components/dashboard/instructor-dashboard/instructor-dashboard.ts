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

  constructor(
    private router: Router,
    private messagingService: MessagingService,
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeMessaging();
    this.loadInstructorData();
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
      this.myCourses = coursesResponse || [];

      // Load instructor students
      const studentsResponse = await this.courseService.getInstructorStudents().toPromise();
      this.myStudents = studentsResponse || [];

      // Load analytics
      const analyticsResponse = await this.courseService.getInstructorAnalytics().toPromise();
      this.analytics = analyticsResponse || {};

      // Update overview stats with real data
      this.overviewStats = {
        totalCourses: this.analytics.totalCourses || 0,
        totalStudents: this.analytics.totalStudents || 0,
        completedCourses: this.myCourses.filter(c => c.isPublished).length,
        averageRating: this.analytics.averageRating || 0
      };

      this.courseProgress = this.analytics.courseProgress || [];
    } catch (error) {
      console.error('Error loading instructor data:', error);
    }
  }

  createNewCourse() {
    this.router.navigate(['/courses/create']);
  }

  editCourse(courseId: string) {
    this.router.navigate(['/courses', courseId, 'edit']);
  }

  deleteCourse(courseId: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.loadInstructorData();
        },
        error: (error) => {
          console.error('Error deleting course:', error);
        }
      });
    }
  }

  viewCourseDetails(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  viewStudentProfile(studentId: string) {
    console.log('View student profile:', studentId);
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
}
