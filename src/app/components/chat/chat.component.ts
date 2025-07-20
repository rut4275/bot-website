import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMessage, ChatSettings } from '../../models/chat.models';
import { SettingsService } from '../../services/settings.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container" [style.background-color]="settings.backgroundColor">
      <div class="chat-header" [style.background-color]="settings.primaryColor">
        <div class="chat-icon">{{ settings.chatIcon }}</div>
        <h3 [style.color]="settings.backgroundColor">{{ settings.chatTitle }}</h3>
        <button class="minimize-btn" (click)="minimizeChat()" [style.color]="settings.backgroundColor">
          ✕
        </button>
      </div>
      
      <div class="chat-messages" #messagesContainer>
        <div class="welcome-message" [style.color]="settings.secondaryColor">
          {{ settings.welcomeMessage }}
        </div>
        
        <div *ngFor="let message of messages" class="message-wrapper">
          <div class="message" 
               [class.user-message]="message.isUser"
               [class.bot-message]="!message.isUser"
               [style.background-color]="message.isUser ? settings.primaryColor : '#f3f4f6'"
               [style.color]="message.isUser ? settings.backgroundColor : settings.textColor">
            <div class="message-content">{{ message.text }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            <div *ngIf="message.status === 'sending'" class="sending-indicator">
              <div class="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chat-input">
        <input type="text" 
               [(ngModel)]="currentMessage" 
               (keyup.enter)="sendMessage()"
               [placeholder]="settings.userPlaceholder"
               [disabled]="isLoading"
               [style.font-family]="settings.fontFamily"
               [style.font-size]="settings.fontSize"
               class="message-input">
        <button (click)="sendMessage()" 
                [disabled]="isLoading || !currentMessage.trim() || conversationEnded"
                [style.background-color]="settings.primaryColor"
                class="send-button">
          <span *ngIf="!isLoading">➤</span>
          <div *ngIf="isLoading" class="loading-spinner"></div>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  currentMessage: string = '';
  settings: ChatSettings = {} as ChatSettings;
  isLoading = false;
  private threadId: string = '';
  conversationEnded = false;
  currentStep: string = '';
  private conversationId: string = '';
  leadData: any = {
    name: '',
    phone: '',
    product: '',
    questions: []
  };
  
  private settingsSubscription?: Subscription;
  private shouldScrollToBottom = false;

  constructor(
    private settingsService: SettingsService,
    private apiService: ApiService
  ) {
    // Generate unique conversation ID
    this.conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  ngOnInit(): void {
    this.settingsSubscription = this.settingsService.settings$.subscribe(
      settings => {
        this.settings = settings;
        this.updateCSSVariables();
      }
    );
  }

  ngOnDestroy(): void {
    this.settingsSubscription?.unsubscribe();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private updateCSSVariables(): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', this.settings.primaryColor);
    root.style.setProperty('--secondary-color', this.settings.secondaryColor);
    root.style.setProperty('--text-color', this.settings.textColor);
    root.style.setProperty('--background-color', this.settings.backgroundColor);
    root.style.setProperty('--font-family', this.settings.fontFamily);
    root.style.setProperty('--font-size', this.settings.fontSize);
  }

  isFormStep(): boolean {
    return ['collect-name', 'collect-phone', 'collect-product'].includes(this.currentStep);
  }

  handleNameSubmit(): void {
    if (!this.leadData.name.trim()) return;
    this.currentStep = 'collect-phone';
    this.shouldScrollToBottom = true;
  }

  handlePhoneSubmit(): void {
    if (!this.leadData.phone.trim()) return;
    this.currentStep = 'collect-product';
    this.shouldScrollToBottom = true;
  }

  handleProductSubmit(): void {
    if (!this.leadData.product) return;
    this.currentStep = 'ask-question';
    this.addBotMessage('מה תרצה לדעת?');
    this.shouldScrollToBottom = true;
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading || this.isFormStep()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date(),
      status: 'sent'
    };

    this.messages.push(userMessage);
    this.shouldScrollToBottom = true;

    if (this.currentStep === 'ask-continue') {
      this.handleContinueResponse(this.currentMessage);
      return;
    }

    const messageToSend = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    // Add temporary loading message
    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      status: 'sending'
    };
    this.messages.push(loadingMessage);
    this.shouldScrollToBottom = true;

    // Send to OpenAI
    this.apiService.sendMessage(messageToSend, this.conversationId).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Remove loading message
        this.messages = this.messages.filter(msg => msg.id !== loadingMessage.id);
        
        const answer = response.response || 'מצטער, לא הצלחתי לקבל תשובה';
        
        // Save question and answer
        this.leadData.questions.push({
          question: messageToSend,
          answer: answer,
          timestamp: new Date()
        });
        
        this.addBotMessage(answer);
        
        // Ask if user has more questions
        setTimeout(() => {
          this.addBotMessage('יש לך עוד שאלה או זה הכל?');
          this.currentStep = 'ask-continue';
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        // Remove loading message
        this.messages = this.messages.filter(msg => msg.id !== loadingMessage.id);
        this.addBotMessage(error.message);
      }
    });
  }

  handleContinueResponse(response: string): void {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('כן') || lowerResponse.includes('עוד') || lowerResponse.includes('שאלה')) {
      this.addBotMessage('איך עוד אני יכול לעזור לך?');
      this.currentStep = 'ask-question';
    } else {
      // User is done, send lead data
      this.sendLeadData();
    }
  }

  sendLeadData(): void {
    this.isLoading = true;
    
    const leadDataWithConversation = {
      ...this.leadData,
      conversationId: this.conversationId
    };
    
    this.apiService.submitLead(leadDataWithConversation).subscribe({
      next: () => {
        this.isLoading = false;
        this.addBotMessage('תודה שפנית אלינו! נחזור אליך בהקדם.');
        this.conversationEnded = true;
        this.currentStep = 'completed';
      },
      error: (error) => {
        this.isLoading = false;
        this.addBotMessage('תודה שפנית אלינו! נחזור אליך בהקדם.');
        this.conversationEnded = true;
        this.currentStep = 'completed';
      }
    });
  }

  addBotMessage(text: string): void {
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      isUser: false,
      timestamp: new Date(),
      status: 'sent'
    };
    this.messages.push(botMessage);
    this.shouldScrollToBottom = true;
  }

  resetChat(): void {
    this.messages = [];
    this.currentStep = 'collect-name';
    this.conversationEnded = false;
    this.conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    this.leadData = {
      name: '',
      phone: '',
      product: '',
      questions: []
    };
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  minimizeChat(): void {
    // This would be implemented to minimize the chat window
    console.log('Minimize chat');
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}