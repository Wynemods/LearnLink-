import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LiveSession, Participant, SessionMessage, SessionSettings } from '../interfaces/live-session.interface';

@Injectable({
  providedIn: 'root'
})
export class LiveSessionService {
  private activeSessionSubject = new BehaviorSubject<LiveSession | null>(null);
  private participantsSubject = new BehaviorSubject<Participant[]>([]);
  private messagesSubject = new BehaviorSubject<SessionMessage[]>([]);
  private settingsSubject = new BehaviorSubject<SessionSettings>({
    allowChat: true,
    allowParticipantVideo: true,
    allowParticipantAudio: true,
    allowScreenShare: false,
    recordSession: false,
    muteOnEntry: false,
    waitingRoom: false
  });

  // Mock data
  private mockSessions: LiveSession[] = [
    {
      id: '1',
      title: 'UX/UI Design Conference Meeting',
      description: 'Interactive design workshop covering modern UI/UX principles',
      instructorId: 'instructor1',
      instructorName: 'Sarah Johnson',
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      status: 'active',
      maxParticipants: 50,
      currentParticipants: 12,
      courseId: 'course1',
      courseName: 'Advanced UX/UI Design',
      isRecorded: true,
      meetingLink: 'https://meet.learnlink.com/session/1'
    }
  ];

  private mockParticipants: Participant[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU4dw48bDvhTdU2fXoUB-nrfWdfuz0HI1iXuNr_BnsQih2lSnAl4pAqmHicBSdc-VAmGJIibWlRr5d-_XBYvKTU5xmOYTFIGbkh-g2DoZx568RKPHKMRJhnUfXVztwKNuBdLL4-7SuK7Jlz_VyWo_ORgS1ViWCNco_FZmBdTEwVS9TWBAvcy0TAXewxhXJYt0Ca_tJOz7zb49Wzcb99ldubiUINii8LP4gTlMq-5I2aRFI4xq82qqHdsUSw1aYbeXNs0yQG9bQTSNk',
      role: 'instructor',
      isOnline: true,
      joinedAt: new Date(),
      isMuted: false,
      isVideoOn: true,
      isHandRaised: false,
      isScreenSharing: false
    },
    {
      id: '2',
      name: 'Emily Chen',
      email: 'emily@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3A6j40U2H9aWuRP2gXk5uznULy2VfDU8vRIYq3NXfp6U89pyWj6N8qxqk01B8acqopk5LCgLqn7lXhBWAsmyAiHq3nDaVX-4eIZ9L3F4FJwY6No-JE2vGyqPYJAxU2GQDeY8rRR9RhUZcY7CMkbX4ObasIreWNlv140MupNajgt0Ll2-RsU4rgl830c2HhFEap4Kav_YvJ3Cq9AOSg3N1n6x156J9RD_nNJWicgCZrbRm4uMEahLRoliKDwGU1pUrwOIiuY8jX84l',
      role: 'student',
      isOnline: true,
      joinedAt: new Date(),
      isMuted: true,
      isVideoOn: true,
      isHandRaised: false,
      isScreenSharing: false
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      email: 'michael@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKubzXoN4kXPf_ylFMZ3TUSb1gXsyWDOmuTKGLhkKH_8v35sxkNRPU2pl4OMEKW7S5xyYD_1l2V0NwmVJw1aqj9XrOCeu9orstLQ37hU5NJK2qMHI67xiKD7y7Oid7HPT73QDrhwDIxHjzXlTaeFFLVqrnGOdZIBZuOmHAGBWK-4gL5kHiJKelsZDaI-6_cHzyXF9NMugblSAKEu8RAvQK5cRk6EXPASB_As7fejaM9ZVNnBeS0is3r7MtmhCnposOWPwocQEGuqH6',
      role: 'student',
      isOnline: true,
      joinedAt: new Date(),
      isMuted: true,
      isVideoOn: true,
      isHandRaised: false,
      isScreenSharing: false
    }
  ];

  constructor() {
    this.activeSessionSubject.next(this.mockSessions[0]);
    this.participantsSubject.next(this.mockParticipants);
  }

  // Observables
  get activeSession$(): Observable<LiveSession | null> {
    return this.activeSessionSubject.asObservable();
  }

  get participants$(): Observable<Participant[]> {
    return this.participantsSubject.asObservable();
  }

  get messages$(): Observable<SessionMessage[]> {
    return this.messagesSubject.asObservable();
  }

  get settings$(): Observable<SessionSettings> {
    return this.settingsSubject.asObservable();
  }

  // Methods
  joinSession(sessionId: string): Observable<LiveSession | null> {
    const session = this.mockSessions.find(s => s.id === sessionId);
    if (session) {
      this.activeSessionSubject.next(session);
    }
    return this.activeSession$;
  }

  leaveSession(): void {
    this.activeSessionSubject.next(null);
  }

  sendMessage(content: string): void {
    const message: SessionMessage = {
      id: Date.now().toString(),
      sessionId: this.activeSessionSubject.value?.id || '',
      senderId: 'currentUser',
      senderName: 'You',
      senderAvatar: '',
      content,
      timestamp: new Date(),
      type: 'text'
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  toggleMute(participantId: string): void {
    const participants = this.participantsSubject.value.map(p => 
      p.id === participantId ? { ...p, isMuted: !p.isMuted } : p
    );
    this.participantsSubject.next(participants);
  }

  toggleVideo(participantId: string): void {
    const participants = this.participantsSubject.value.map(p => 
      p.id === participantId ? { ...p, isVideoOn: !p.isVideoOn } : p
    );
    this.participantsSubject.next(participants);
  }

  toggleHandRaise(participantId: string): void {
    const participants = this.participantsSubject.value.map(p => 
      p.id === participantId ? { ...p, isHandRaised: !p.isHandRaised } : p
    );
    this.participantsSubject.next(participants);
  }

  updateSettings(settings: Partial<SessionSettings>): void {
    const currentSettings = this.settingsSubject.value;
    this.settingsSubject.next({ ...currentSettings, ...settings });
  }
}