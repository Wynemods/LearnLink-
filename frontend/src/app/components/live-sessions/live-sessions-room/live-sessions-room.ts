import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LiveSessionService } from '../services/live-session.service';
import { LiveSession, Participant, SessionMessage, CourseContent } from '../interfaces/live-session.interface';

@Component({
  selector: 'app-live-sessions-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-sessions-room.html',
  styleUrl: './live-sessions-room.css'
})
export class LiveSessionsRoom implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  activeSession: LiveSession | null = null;
  participants: Participant[] = [];
  messages: SessionMessage[] = [];
  newMessage = '';
  
  // Video controls
  isVideoOn = true;
  isMuted = false;
  isScreenSharing = false;
  
  // UI states
  showChat = false;
  showParticipants = false;
  isFullscreen = false;
  
  // Course content
  courseContent: CourseContent[] = [
    {
      id: '1',
      title: 'Get Started',
      type: 'lesson',
      duration: '1 Hour',
      progress: 100,
      isCompleted: true,
      isLocked: false
    },
    {
      id: '2',
      title: 'Illustrator Structures',
      type: 'lesson',
      duration: '2 Hour',
      progress: 60,
      isCompleted: false,
      isLocked: false
    },
    {
      id: '3',
      title: 'Using Illustrator',
      type: 'lesson',
      duration: '1 Hour',
      progress: 0,
      isCompleted: false,
      isLocked: true
    },
    {
      id: '4',
      title: 'What is Pandas?',
      type: 'lesson',
      duration: '12:54',
      progress: 0,
      isCompleted: false,
      isLocked: true
    },
    {
      id: '5',
      title: 'Work with Numpy',
      type: 'lesson',
      duration: '59:00',
      progress: 0,
      isCompleted: false,
      isLocked: true
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private liveSessionService: LiveSessionService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const sessionId = params['sessionId'];
      if (sessionId) {
        this.joinSession(sessionId);
      }
    });

    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.liveSessionService.leaveSession();
  }

  private initializeSubscriptions(): void {
    this.liveSessionService.activeSession$
      .pipe(takeUntil(this.destroy$))
      .subscribe(session => {
        this.activeSession = session;
      });

    this.liveSessionService.participants$
      .pipe(takeUntil(this.destroy$))
      .subscribe(participants => {
        this.participants = participants;
      });

    this.liveSessionService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;
      });
  }

  private joinSession(sessionId: string): void {
    this.liveSessionService.joinSession(sessionId).subscribe();
  }

  // Video controls
  toggleVideo(): void {
    this.isVideoOn = !this.isVideoOn;
    console.log('Video toggled:', this.isVideoOn);
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    console.log('Mute toggled:', this.isMuted);
  }

  toggleScreenShare(): void {
    this.isScreenSharing = !this.isScreenSharing;
    console.log('Screen share toggled:', this.isScreenSharing);
  }

  endCall(): void {
    if (confirm('Are you sure you want to leave the session?')) {
      this.liveSessionService.leaveSession();
      this.router.navigate(['/dashboard/instructor']);
    }
  }

  exitSession(): void {
    this.endCall();
  }

  // Chat functionality
  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  toggleParticipants(): void {
    this.showParticipants = !this.showParticipants;
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.liveSessionService.sendMessage(this.newMessage.trim());
      this.newMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/dashboard/instructor']);
  }

  openSettings(): void {
    console.log('Opening session settings...');
  }

  // Course content
  getContentIcon(type: string): string {
    switch (type) {
      case 'lesson':
        return 'play_circle_filled';
      case 'quiz':
        return 'quiz';
      case 'assignment':
        return 'assignment';
      default:
        return 'book';
    }
  }

  getContentColor(isCompleted: boolean, isLocked: boolean): string {
    if (isCompleted) return 'text-green-500';
    if (isLocked) return 'text-gray-400';
    return 'text-blue-500';
  }

  // Utility methods
  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  get mainParticipant(): Participant | null {
    return this.participants.find(p => p.role === 'instructor') || this.participants[0] || null;
  }

  get otherParticipants(): Participant[] {
    const main = this.mainParticipant;
    return this.participants.filter(p => p.id !== main?.id).slice(0, 3);
  }

  get totalProgress(): number {
    const completed = this.courseContent.filter(c => c.isCompleted).length;
    return Math.round((completed / this.courseContent.length) * 100);
  }

  get completedCount(): number {
    return this.courseContent.filter(c => c.isCompleted).length;
  }
}
