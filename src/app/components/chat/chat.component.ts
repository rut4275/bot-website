import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMessage, ChatSettings } from '../../models/chat.models';
import { SettingsService } from '../../services/settings.service';
import { WebhookService } from '../../services/webhook.service';

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
  
  private settingsSubscription?: Subscription;
  private shouldScrollToBottom = false;

  constructor(
    private settingsService: SettingsService,
    private webhookService: WebhookService
  ) {}

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

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date(),
      status: 'sent'
    };

    this.messages.push(userMessage);
    this.shouldScrollToBottom = true;

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

    this.webhookService.sendMessage(this.settings.webhookUrl, messageToSend, this.threadId).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Remove loading message
        this.messages = this.messages.filter(msg => msg.id !== loadingMessage.id);
        
        // Update thread ID if provided
        if (response.thread_Id_cmd_gen) {
          this.threadId = response.thread_Id_cmd_gen;
        }
        
        // Add bot response
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text: response.answer || 'תשובה התקבלה',
          isUser: false,
          timestamp: new Date(),
          status: 'sent'
        };
        this.messages.push(botMessage);
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        this.isLoading = false;
        // Remove loading message
        this.messages = this.messages.filter(msg => msg.id !== loadingMessage.id);
        
        // Add error message
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          text: error.message,
          isUser: false,
          timestamp: new Date(),
          status: 'error'
        };
        this.messages.push(errorMessage);
        this.shouldScrollToBottom = true;
      }
    });
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