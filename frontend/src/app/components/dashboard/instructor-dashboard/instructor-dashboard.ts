import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessagingService } from '../../messaging/services/messaging.service';
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
  
  // Lessons data
  lessons: Lesson[] = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      content: 'Basic concepts and getting started guide...',
      status: 'published',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'HTML Fundamentals',
      content: 'Understanding HTML structure and elements...',
      status: 'draft',
      createdAt: new Date('2024-01-20')
    }
  ];

  // Students data
  students: Student[] = [
    {
      id: '1',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA30g-oYVSSqOaIPlFXGKGUT7MFe8zjt4JAtjCNpCVUmID4eCMVFcqZmj6UxuQHHo54AmA_RPjVEFBxSCpad7lGwxP47pFj5GmPlCJ0IY9eanmifTG2THnW-EjjMEwJRrqVU5snU-iSSSjf_0MlFT7tMSRbhvkVTzCA_uC9N02uOTg3SbqC6i3dqoeGZQVstoSEa7u3QzCYje-KNVP87vqL2sIzpJBDvCUb_tF2b2BkGsTB-4RSpU9PVoThkAs2pDRD4Or3Nl9kzCk',
      enrolledDate: new Date('2023-01-15'),
      progress: 75,
      rating: 4.0,
      coursesEnrolled: ['Web Development', 'JavaScript Basics'],
      lastActive: new Date('2024-01-10')
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHuX9waW8QcjUzfu5vpdCq8Z0rKS7oE46xixz6igEw4AyN98SbFu9UPWM8sPYGjAQcAHri2Wptmt1Fqtb_LUrYMOWSwjlWOhQ1jb1PdabWQGK4LZjVGZcaHQUOJKAUTFA0VhCP66k9-iPKTkqfgrIfTgnEwIonxfHVVZUSWuSe0DwTInyNDIR2IGnq07JUF2Y4NeTwQM5gYGtzM0j1ttXrM-6ao4XYcLrihsjdcMSt7qJJMl9yD_6XJloxWDvIk2sTwukvwF4Ni0U',
      enrolledDate: new Date('2023-02-02'),
      progress: 45,
      rating: 3.0,
      coursesEnrolled: ['Web Development'],
      lastActive: new Date('2024-01-08')
    },
    {
      id: '3',
      name: 'Emily White',
      email: 'emily.white@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChTL90x2aJ7MP1UDIeUI7XRcJ2-Mx1UX-wKkapdA1qSoZ3-Kqi6TNQhA-rFbZbkg30YPVG0IiSvN12AdyVFsuQ6rSwGBuNK2lrtMARP1jWY-s9eU00bf8EuzH6N4mR6i4RZtmSDrtf9zs-nPOROnQ0hwGipTsXac0zTn3wl4iJbQ0niO0F1gPiF1ggfOmBPfKpkV2yURHfzfqFv207Tjgql2BmocymHnCxttmyneCgxnnYgZVoUP-Kz1cQIRvX4T2wNkqfHobFkDY',
      enrolledDate: new Date('2023-03-20'),
      progress: 90,
      rating: 4.5,
      coursesEnrolled: ['Web Development', 'JavaScript Basics', 'React Fundamentals'],
      lastActive: new Date('2024-01-12')
    },
    {
      id: '4',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0zWGdrxN6_o2R_nsffbSFVC5RXiA4_oo4w6sEmWGDS2IU3xjEz85B0LVURSv3YSmxMX3sc6FbRKrwicxnVgQ4cZkFlsaSsgBer-SdEESdhwMoI_tDHcq4x_RJBvPQnhoyO17oi0SBIBX95387sThSIQYEhyyVox65tzkIS8a-gbhUxOHMa_OQMEiD5Bi5qlWt5pQppIlg3beBXdk8yJuS2EOX8t-rKFUk-oYCoZz2BBjSvUQQpupYDHJkuTWdhEsaojY5WQ23xik',
      enrolledDate: new Date('2023-04-10'),
      progress: 35,
      rating: 3.8,
      coursesEnrolled: ['Web Development', 'CSS Fundamentals'],
      lastActive: new Date('2024-01-05')
    }
  ];

  // Overview data
  overviewStats: OverviewStats = {
    totalCourses: 12,
    totalStudents: 245,
    completedCourses: 8,
    averageRating: 4.5
  };

  courseProgress: CourseProgress[] = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      progress: 85,
      color: 'bg-green-500'
    },
    {
      id: '2',
      title: 'Advanced CSS and Sass',
      progress: 60,
      color: 'bg-blue-500'
    },
    {
      id: '3',
      title: 'JavaScript for Beginners',
      progress: 100,
      color: 'bg-teal-500'
    },
    {
      id: '4',
      title: 'React - The Complete Guide',
      progress: 30,
      color: 'bg-yellow-500'
    }
  ];

  topStudents: TopStudent[] = [
    {
      id: '1',
      name: 'John Smith',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHuX9waW8QcjUzfu5vpdCq8Z0rKS7oE46xixz6igEw4AyN98SbFu9UPWM8sPYGjAQcAHri2Wptmt1Fqtb_LUrYMOWSwjlWOhQ1jb1PdabWQGK4LZjVGZcaHQUOJKAUTFA0VhCP66k9-iPKTkqfgrIfTgnEwIonxfHVVZUSWuSe0DwTInyNDIR2IGnq07JUF2Y4NeTwQM5gYGtzM0j1ttXrM-6ao4XYcLrihsjdcMSt7qJJMl9yD_6XJloxWDvIk2sTwukvwF4Ni0U',
      coursesCount: 10,
      progressChange: 12
    },
    {
      id: '2',
      name: 'Jane Doe',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA30g-oYVSSqOaIPlFXGKGUT7MFe8zjt4JAtjCNpCVUmID4eCMVFcqZmj6UxuQHHo54AmA_RPjVEFBxSCpad7lGwxP47pFj5GmPlCJ0IY9eanmifTG2THnW-EjjMEwJRrqVU5snU-iSSSjf_0MlFT7tMSRbhvkVTzCA_uC9N02uOTg3SbqC6i3dqoeGZQVstoSEa7u3QzCYje-KNVP87vqL2sIzpJBDvCUb_tF2b2BkGsTB-4RSpU9PVoThkAs2pDRD4Or3Nl9kzCk',
      coursesCount: 8,
      progressChange: 8
    },
    {
      id: '3',
      name: 'Emily White',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChTL90x2aJ7MP1UDIeUI7XRcJ2-Mx1UX-wKkapdA1qSoZ3-Kqi6TNQhA-rFbZbkg30YPVG0IiSvN12AdyVFsuQ6rSwGBuNK2lrtMARP1jWY-s9eU00bf8EuzH6N4mR6i4RZtmSDrtf9zs-nPOROnQ0hwGipTsXac0zTn3wl4iJbQ0niO0F1gPiF1ggfOmBPfKpkV2yURHfzfqFv207Tjgql2BmocymHnCxttmyneCgxnnYgZVoUP-Kz1cQIRvX4T2wNkqfHobFkDY',
      coursesCount: 7,
      progressChange: -2
    },
    {
      id: '4',
      name: 'Michael Brown',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0zWGdrxN6_o2R_nsffbSFVC5RXiA4_oo4w6sEmWGDS2IU3xjEz85B0LVURSv3YSmxMX3sc6FbRKrwicxnVgQ4cZkFlsaSsgBer-SdEESdhwMoI_tDHcq4x_RJBvPQnhoyO17oi0SBIBX95387sThSIQYEhyyVox65tzkIS8a-gbhUxOHMa_OQMEiD5Bi5qlWt5pQppIlg3beBXdk8yJuS2EOX8t-rKFUk-oYCoZz2BBjSvUQQpupYDHJkuTWdhEsaojY5WQ23xik',
      coursesCount: 7,
      progressChange: 5
    }
  ];

  constructor(
    private router: Router,
    private messagingService: MessagingService
  ) {}

  ngOnInit(): void {
    this.initializeMessaging();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeMessaging(): void {
    this.messagingService.conversations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(conversations => {
        this.conversations = conversations;
      });

    this.messagingService.activeConversation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(conversation => {
        this.activeConversation = conversation;
      });

    this.messagingService.searchTerm$
      .pipe(takeUntil(this.destroy$))
      .subscribe(term => {
        this.searchTerm = term;
      });
  }

  get filteredConversations(): Conversation[] {
    return this.messagingService.getFilteredConversations(this.searchTerm);
  }

  get totalUnreadMessages(): number {
    return this.messagingService.getTotalUnreadCount();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigateToSection(section: 'overview' | 'students' | 'courses' | 'messages' | 'live-sessions'): void {
    this.currentView = section;
    this.isMobileMenuOpen = false;
    console.log(`Navigating to ${section}`);
  }

  // Messaging methods
  selectConversation(conversation: Conversation): void {
    this.messagingService.setActiveConversation(conversation);
  }

  onSearchMessages(event: any): void {
    this.messagingService.setSearchTerm(event.target.value);
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.activeConversation) {
      const messageInput: MessageInput = {
        conversationId: this.activeConversation.id,
        content: this.newMessage.trim(),
        type: 'text'
      };

      this.messagingService.sendMessage(messageInput);
      this.newMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatMessageTime(timestamp: Date): string {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  formatLastMessageTime(timestamp: Date): string {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  // File upload methods
  onVideoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedVideoFile = input.files[0];
    }
  }

  onDocumentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedDocumentFile = input.files[0];
    }
  }

  triggerVideoUpload(): void {
    const fileInput = document.getElementById('video-upload') as HTMLInputElement;
    fileInput.click();
  }

  triggerDocumentUpload(): void {
    const fileInput = document.getElementById('document-upload') as HTMLInputElement;
    fileInput.click();
  }

  // Text editor methods
  formatText(action: string): void {
    document.execCommand(action, false);
  }

  insertLink(): void {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  }

  // Lesson management methods
  saveDraft(): void {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: this.lessonTitle,
      content: this.lessonContent,
      status: 'draft',
      createdAt: new Date()
    };
    
    this.lessons.unshift(newLesson);
    this.clearForm();
    console.log('Lesson saved as draft');
  }

  publishLesson(): void {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: this.lessonTitle,
      content: this.lessonContent,
      status: 'published',
      createdAt: new Date()
    };
    
    this.lessons.unshift(newLesson);
    this.clearForm();
    console.log('Lesson published');
  }

  previewLesson(): void {
    console.log('Preview lesson:', {
      title: this.lessonTitle,
      content: this.lessonContent,
      videoFile: this.selectedVideoFile,
      documentFile: this.selectedDocumentFile
    });
  }

  private clearForm(): void {
    this.lessonTitle = '';
    this.lessonContent = '';
    this.selectedVideoFile = null;
    this.selectedDocumentFile = null;
  }

  // Student management methods
  addStudent(): void {
    console.log('Adding new student...');
  }

  // Live sessions methods
  createLiveSession(): void {
    this.router.navigate(['/live-sessions/create']);
  }

  joinLiveSession(sessionId: string): void {
    this.router.navigate(['/live-sessions/room', sessionId]);
  }

  // Format date for display
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  // Get star array for rating display
  getStarArray(rating: number): { filled: boolean; half: boolean }[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push({ filled: true, half: false });
      } else if (i === fullStars && hasHalf) {
        stars.push({ filled: false, half: true });
      } else {
        stars.push({ filled: false, half: false });
      }
    }
    
    return stars;
  }

  // Get progress color class
  getProgressColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  // Get change indicator class
  getChangeClass(change: number): string {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  }

  // Get change indicator text
  getChangeText(change: number): string {
    return change >= 0 ? `+${change}%` : `${change}%`;
  }
}
