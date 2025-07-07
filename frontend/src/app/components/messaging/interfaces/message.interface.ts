export interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  timestamp: Date;
  isRead: boolean;
  type: 'sent' | 'received';
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participants: Participant[];
  participantName: string;
  lastMessage: Message | null; // Change from string to Message | null
  messages: Message[];
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageInput {
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
}