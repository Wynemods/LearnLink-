import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Conversation, Message, MessageInput } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private readonly API_URL = 'http://localhost:3000/api';
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  private activeConversationSubject = new BehaviorSubject<Conversation | null>(null);
  private searchTermSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  // Observables
  get conversations$(): Observable<Conversation[]> {
    return this.conversationsSubject.asObservable();
  }

  get activeConversation$(): Observable<Conversation | null> {
    return this.activeConversationSubject.asObservable();
  }

  get searchTerm$(): Observable<string> {
    return this.searchTermSubject.asObservable();
  }

  // Methods
  getConversations(): Observable<Conversation[]> {
    return this.http.get<any>(`${this.API_URL}/messages/conversations`)
      .pipe(
        map(response => {
          const conversations = response.data || [];
          // Transform the data to match the interface
          const transformedConversations = conversations.map((conv: any) => ({
            ...conv,
            lastMessage: conv.lastMessage ? {
              id: conv.lastMessage.id || 'temp-id',
              content: typeof conv.lastMessage === 'string' ? conv.lastMessage : conv.lastMessage.content,
              senderId: conv.lastMessage.senderId || '',
              conversationId: conv.id,
              timestamp: conv.lastMessage.timestamp || new Date(),
              isRead: conv.lastMessage.isRead || false,
              type: conv.lastMessage.type || 'received'
            } : null
          }));
          this.conversationsSubject.next(transformedConversations);
          return transformedConversations;
        })
      );
  }

  getConversationMessages(conversationId: string): Observable<Message[]> {
    return this.http.get<any>(`${this.API_URL}/messages/conversations/${conversationId}/messages`)
      .pipe(map(response => response.data || []));
  }

  sendMessage(messageInput: MessageInput): Observable<Message> {
    return this.http.post<any>(`${this.API_URL}/messages`, messageInput)
      .pipe(map(response => response.data));
  }

  markAsRead(conversationId: string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/messages/conversations/${conversationId}/read`, {})
      .pipe(map(response => response.data));
  }

  setActiveConversation(conversation: Conversation | null): void {
    this.activeConversationSubject.next(conversation);
    if (conversation) {
      this.markConversationAsRead(conversation.id);
    }
  }

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  markConversationAsRead(conversationId: string): void {
    const conversations = this.conversationsSubject.value;
    const conversationIndex = conversations.findIndex(c => c.id === conversationId);
    
    if (conversationIndex !== -1) {
      conversations[conversationIndex].unreadCount = 0;
      if (conversations[conversationIndex].messages) {
        conversations[conversationIndex].messages.forEach((message: Message) => {
          if (message.type === 'received') {
            message.isRead = true;
          }
        });
      }
      
      this.conversationsSubject.next([...conversations]);
    }
  }

  getFilteredConversations(searchTerm: string): Conversation[] {
    const conversations = this.conversationsSubject.value;
    if (!searchTerm.trim()) {
      return conversations;
    }
    
    return conversations.filter(conversation =>
      conversation.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conversation.lastMessage?.content && conversation.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  getTotalUnreadCount(): number {
    return this.conversationsSubject.value.reduce((total, conversation) => total + conversation.unreadCount, 0);
  }
}