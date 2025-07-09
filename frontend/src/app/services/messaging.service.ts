import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  lastMessage: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface MessageInput {
  conversationId: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getConversations(): Observable<Conversation[]> {
    // Return sample data for now
    const sampleConversations: Conversation[] = [
      {
        id: '1',
        participants: [
          {
            id: '1',
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1de?w=150&h=150&fit=crop&crop=face'
          }
        ],
        lastMessage: {
          content: 'Thank you for the course!',
          timestamp: new Date(),
          senderId: '1'
        },
        unreadCount: 2,
        messages: []
      }
    ];
    
    this.conversationsSubject.next(sampleConversations);
    return this.conversationsSubject.asObservable();
  }

  sendMessage(messageInput: MessageInput): Observable<Message> {
    const message: Message = {
      id: Date.now().toString(),
      conversationId: messageInput.conversationId,
      senderId: 'current-user-id',
      content: messageInput.content,
      timestamp: new Date(),
      isRead: false
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(message);
        observer.complete();
      }, 500);
    });
  }

  getMessages(conversationId: string): Observable<Message[]> {
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }
}