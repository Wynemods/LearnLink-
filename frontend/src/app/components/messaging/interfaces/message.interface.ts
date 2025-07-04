export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: Date;
  isRead: boolean;
  type: 'sent' | 'received';
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

export interface MessageInput {
  conversationId: string;
  content: string;
  type: 'text' | 'file' | 'image';
  file?: File;
}