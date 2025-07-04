export interface LiveSession {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'active' | 'ended';
  maxParticipants: number;
  currentParticipants: number;
  courseId?: string;
  courseName?: string;
  isRecorded: boolean;
  recordingUrl?: string;
  meetingLink?: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'instructor' | 'student';
  isOnline: boolean;
  joinedAt: Date;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isScreenSharing: boolean;
}

export interface SessionMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file';
}

export interface CourseContent {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  duration: string;
  progress: number;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface SessionSettings {
  allowChat: boolean;
  allowParticipantVideo: boolean;
  allowParticipantAudio: boolean;
  allowScreenShare: boolean;
  recordSession: boolean;
  muteOnEntry: boolean;
  waitingRoom: boolean;
}