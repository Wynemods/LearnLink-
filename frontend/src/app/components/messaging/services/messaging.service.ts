import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Conversation, Message, MessageInput } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  private activeConversationSubject = new BehaviorSubject<Conversation | null>(null);
  private searchTermSubject = new BehaviorSubject<string>('');

  // Mock data - replace with actual API calls
  private mockConversations: Conversation[] = [
    {
      id: '1',
      participantId: 'student1',
      participantName: 'Jane Doe',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA30g-oYVSSqOaIPlFXGKGUT7MFe8zjt4JAtjCNpCVUmID4eCMVFcqZmj6UxuQHHo54AmA_RPjVEFBxSCpad7lGwxP47pFj5GmPlCJ0IY9eanmifTG2THnW-EjjMEwJRrqVU5snU-iSSSjf_0MlFT7tMSRbhvkVTzCA_uC9N02uOTg3SbqC6i3dqoeGZQVstoSEa7u3QzCYje-KNVP87vqL2sIzpJBDvCUb_tF2b2BkGsTB-4RSpU9PVoThkAs2pDRD4Or3Nl9kzCk',
      lastMessage: 'Oh, I haven\'t! I\'ll give that a try. Thanks for the quick response!',
      lastMessageTime: new Date('2024-01-10T10:43:00'),
      unreadCount: 0,
      isOnline: true,
      messages: [
        {
          id: '1',
          content: 'Hey! Just wanted to check in on my progress. I\'m feeling a bit stuck on the last module.',
          senderId: 'student1',
          senderName: 'Jane Doe',
          senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA30g-oYVSSqOaIPlFXGKGUT7MFe8zjt4JAtjCNpCVUmID4eCMVFcqZmj6UxuQHHo54AmA_RPjVEFBxSCpad7lGwxP47pFj5GmPlCJ0IY9eanmifTG2THnW-EjjMEwJRrqVU5snU-iSSSjf_0MlFT7tMSRbhvkVTzCA_uC9N02uOTg3SbqC6i3dqoeGZQVstoSEa7u3QzCYje-KNVP87vqL2sIzpJBDvCUb_tF2b2BkGsTB-4RSpU9PVoThkAs2pDRD4Or3Nl9kzCk',
          timestamp: new Date('2024-01-10T10:40:00'),
          isRead: true,
          type: 'received'
        },
        {
          id: '2',
          content: 'Hi Jane! Of course. I\'ve just checked your progress, and you\'re doing great. The last module can be tricky. Have you tried watching the supplementary video? It might help.',
          senderId: 'instructor1',
          senderName: 'John Instructor',
          senderAvatar: '/assets/instructor-avatar.jpg',
          timestamp: new Date('2024-01-10T10:42:00'),
          isRead: true,
          type: 'sent'
        },
        {
          id: '3',
          content: 'Oh, I haven\'t! I\'ll give that a try. Thanks for the quick response!',
          senderId: 'student1',
          senderName: 'Jane Doe',
          senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA30g-oYVSSqOaIPlFXGKGUT7MFe8zjt4JAtjCNpCVUmID4eCMVFcqZmj6UxuQHHo54AmA_RPjVEFBxSCpad7lGwxP47pFj5GmPlCJ0IY9eanmifTG2THnW-EjjMEwJRrqVU5snU-iSSSjf_0MlFT7tMSRbhvkVTzCA_uC9N02uOTg3SbqC6i3dqoeGZQVstoSEa7u3QzCYje-KNVP87vqL2sIzpJBDvCUb_tF2b2BkGsTB-4RSpU9PVoThkAs2pDRD4Or3Nl9kzCk',
          timestamp: new Date('2024-01-10T10:43:00'),
          isRead: true,
          type: 'received'
        }
      ]
    },
    {
      id: '2',
      participantId: 'student2',
      participantName: 'John Smith',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHuX9waW8QcjUzfu5vpdCq8Z0rKS7oE46xixz6igEw4AyN98SbFu9UPWM8sPYGjAQcAHri2Wptmt1Fqtb_LUrYMOWSwjlWOhQ1jb1PdabWQGK4LZjVGZcaHQUOJKAUTFA0VhCP66k9-iPKTkqfgrIfTgnEwIonxfHVVZUSWuSe0DwTInyNDIR2IGnq07JUF2Y4NeTwQM5gYGtzM0j1ttXrM-6ao4XYcLrihsjdcMSt7qJJMl9yD_6XJloxWDvIk2sTwukvwF4Ni0U',
      lastMessage: 'I have a question about the assignment.',
      lastMessageTime: new Date('2024-01-09T14:30:00'),
      unreadCount: 1,
      isOnline: false,
      messages: [
        {
          id: '4',
          content: 'I have a question about the assignment.',
          senderId: 'student2',
          senderName: 'John Smith',
          senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHuX9waW8QcjUzfu5vpdCq8Z0rKS7oE46xixz6igEw4AyN98SbFu9UPWM8sPYGjAQcAHri2Wptmt1Fqtb_LUrYMOWSwjlWOhQ1jb1PdabWQGK4LZjVGZcaHQUOJKAUTFA0VhCP66k9-iPKTkqfgrIfTgnEwIonxfHVVZUSWuSe0DwTInyNDIR2IGnq07JUF2Y4NeTwQM5gYGtzM0j1ttXrM-6ao4XYcLrihsjdcMSt7qJJMl9yD_6XJloxWDvIk2sTwukvwF4Ni0U',
          timestamp: new Date('2024-01-09T14:30:00'),
          isRead: false,
          type: 'received'
        }
      ]
    },
    {
      id: '3',
      participantId: 'student3',
      participantName: 'Emily White',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChTL90x2aJ7MP1UDIeUI7XRcJ2-Mx1UX-wKkapdA1qSoZ3-Kqi6TNQhA-rFbZbkg30YPVG0IiSvN12AdyVFsuQ6rSwGBuNK2lrtMARP1jWY-s9eU00bf8EuzH6N4mR6i4RZtmSDrtf9zs-nPOROnQ0hwGipTsXac0zTn3wl4iJbQ0niO0F1gPiF1ggfOmBPfKpkV2yURHfzfqFv207Tjgql2BmocymHnCxttmyneCgxnnYgZVoUP-Kz1cQIRvX4T2wNkqfHobFkDY',
      lastMessage: 'Thanks for the feedback!',
      lastMessageTime: new Date('2024-01-08T16:20:00'),
      unreadCount: 0,
      isOnline: true,
      messages: [
        {
          id: '5',
          content: 'Thanks for the feedback!',
          senderId: 'student3',
          senderName: 'Emily White',
          senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChTL90x2aJ7MP1UDIeUI7XRcJ2-Mx1UX-wKkapdA1qSoZ3-Kqi6TNQhA-rFbZbkg30YPVG0IiSvN12AdyVFsuQ6rSwGBuNK2lrtMARP1jWY-s9eU00bf8EuzH6N4mR6i4RZtmSDrtf9zs-nPOROnQ0hwGipTsXac0zTn3wl4iJbQ0niO0F1gPiF1ggfOmBPfKpkV2yURHfzfqFv207Tjgql2BmocymHnCxttmyneCgxnnYgZVoUP-Kz1cQIRvX4T2wNkqfHobFkDY',
          timestamp: new Date('2024-01-08T16:20:00'),
          isRead: true,
          type: 'received'
        }
      ]
    },
    {
      id: '4',
      participantId: 'student4',
      participantName: 'Michael Brown',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0zWGdrxN6_o2R_nsffbSFVC5RXiA4_oo4w6sEmWGDS2IU3xjEz85B0LVURSv3YSmxMX3sc6FbRKrwicxnVgQ4cZkFlsaSsgBer-SdEESdhwMoI_tDHcq4x_RJBvPQnhoyO17oi0SBIBX95387sThSIQYEhyyVox65tzkIS8a-gbhUxOHMa_OQMEiD5Bi5qlWt5pQppIlg3beBXdk8yJuS2EOX8t-rKFUk-oYCoZz2BBjSvUQQpupYDHJkuTWdhEsaojY5WQ23xik',
      lastMessage: 'Can we reschedule our meeting?',
      lastMessageTime: new Date('2024-01-07T11:45:00'),
      unreadCount: 1,
      isOnline: false,
      messages: [
        {
          id: '6',
          content: 'Can we reschedule our meeting?',
          senderId: 'student4',
          senderName: 'Michael Brown',
          senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0zWGdrxN6_o2R_nsffbSFVC5RXiA4_oo4w6sEmWGDS2IU3xjEz85B0LVURSv3YSmxMX3sc6FbRKrwicxnVgQ4cZkFlsaSsgBer-SdEESdhwMoI_tDHcq4x_RJBvPQnhoyO17oi0SBIBX95387sThSIQYEhyyVox65tzkIS8a-gbhUxOHMa_OQMEiD5Bi5qlWt5pQppIlg3beBXdk8yJuS2EOX8t-rKFUk-oYCoZz2BBjSvUQQpupYDHJkuTWdhEsaojY5WQ23xik',
          timestamp: new Date('2024-01-07T11:45:00'),
          isRead: false,
          type: 'received'
        }
      ]
    }
  ];

  constructor() {
    this.conversationsSubject.next(this.mockConversations);
  }

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
  getConversations(): Conversation[] {
    return this.conversationsSubject.value;
  }

  getActiveConversation(): Conversation | null {
    return this.activeConversationSubject.value;
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

  sendMessage(messageInput: MessageInput): void {
    const conversations = this.getConversations();
    const conversationIndex = conversations.findIndex(c => c.id === messageInput.conversationId);
    
    if (conversationIndex !== -1) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageInput.content,
        senderId: 'instructor1',
        senderName: 'John Instructor',
        senderAvatar: '/assets/instructor-avatar.jpg',
        timestamp: new Date(),
        isRead: true,
        type: 'sent'
      };

      conversations[conversationIndex].messages.push(newMessage);
      conversations[conversationIndex].lastMessage = messageInput.content;
      conversations[conversationIndex].lastMessageTime = new Date();

      this.conversationsSubject.next([...conversations]);
      this.setActiveConversation(conversations[conversationIndex]);
    }
  }

  markConversationAsRead(conversationId: string): void {
    const conversations = this.getConversations();
    const conversationIndex = conversations.findIndex(c => c.id === conversationId);
    
    if (conversationIndex !== -1) {
      conversations[conversationIndex].unreadCount = 0;
      conversations[conversationIndex].messages.forEach(message => {
        if (message.type === 'received') {
          message.isRead = true;
        }
      });
      
      this.conversationsSubject.next([...conversations]);
    }
  }

  getFilteredConversations(searchTerm: string): Conversation[] {
    const conversations = this.getConversations();
    if (!searchTerm.trim()) {
      return conversations;
    }
    
    return conversations.filter(conversation =>
      conversation.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  getTotalUnreadCount(): number {
    return this.getConversations().reduce((total, conversation) => total + conversation.unreadCount, 0);
  }
}