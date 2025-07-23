import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMessage, ChatSettings, ChatStep } from '../../models/chat.models';
import { SettingsService } from '../../services/settings.service';
import { ApiService } from '../../services/api.service';
import { AdminComponent } from '../admin/admin.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminComponent],
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
        <div *ngFor="let message of messages" class="message-wrapper">
          <div class="message" 
               [class.user-message]="message.isUser"
               [class.bot-message]="!message.isUser"
               [style.background-color]="message.isUser ? settings.primaryColor : '#f3f4f6'"
               [style.color]="message.isUser ? settings.backgroundColor : settings.textColor">
            <div class="message-content">{{ message.text }}</div>
            <div *ngIf="message.buttons && message.buttons.length > 0" class="product-buttons">
              <button *ngFor="let button1 of message.buttons" 
                      (click)="selectProduct(button1)"
                      [style.background-color]="settings.secondaryColor"
                      [style.color]="settings.textColor"
                      class="product-button">
                {{ button1 }}
              </button>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            <div *ngIf="message.status === 'sending'" class="sending-indicator">
              <div class="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          
          <!-- Product selection buttons -->
          <!-- <div *ngIf="showProductButtons && message === messages[messages.length - 1] && !message.isUser" 
               class="product-buttons">
            <button *ngFor="let product of settings.products" 
                    (click)="selectProduct(product)"
                    class="product-button">
              {{ product }}
            </button>
          </div> -->
        </div>
      </div>
      
      <div class="chat-input">
        <input type="text" 
               [(ngModel)]="currentMessage" 
               (keyup.enter)="sendMessage()"
               [placeholder]="settings.userPlaceholder"
               [disabled]="isLoading || showProductButtons || conversationEnded || waitingForResponse"
               [style.font-family]="settings.fontFamily"
               [style.font-size]="settings.fontSize"
               class="message-input">
        <button (click)="sendMessage()" 
                [disabled]="isLoading || !currentMessage.trim() || conversationEnded || showProductButtons"
                [style.background-color]="settings.primaryColor"
                class="send-button">
          <span *ngIf="!isLoading">➤</span>
          <div *ngIf="isLoading" class="loading-spinner"></div>
        </button>
      </div>
      
      <app-admin></app-admin>
    </div>
  `,
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild(AdminComponent) adminPanel!: AdminComponent;
  
  messages: ChatMessage[] = [];
  currentMessage: string = '';
  settings: ChatSettings = {} as ChatSettings;
  isLoading = false;
  conversationEnded = false;
  waitingForResponse = false;
  showProductButtons = false;
  currentStep: ChatStep = 'collect-name';
  private conversationId: string = '';
  leadData: any = {
    name: '',
    phone: '',
    product: '',
    questions: []
  };
  threadId: string = '';
  
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
  // נרשמים ל-settings כדי לעדכן עיצוב וכולי
  this.settingsSubscription = this.settingsService.settings$.subscribe(
    settings => {
      if (settings && Object.keys(settings).length > 0) {
        this.settings = settings;
        this.updateCSSVariables();
      }
    }
  );

  // מריצים את הטעינה וברגע שהיא מסתיימת – מפעילים את ה-chat flow
  this.settingsService.loadSettingsAndNotify().subscribe(() => {
    this.startChatFlow();
  });
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

  initializeChat(): void {
    // Determine first step based on settings
    if (this.settings.collectName) {
      this.currentStep = 'collect-name';
      this.addBotMessage(this.settings.nameLabel || 'הי! נשמח להכיר אותך!\n מה השם שלך?');
    } else if (this.settings.collectPhone) {
      this.currentStep = 'collect-phone';
      this.addBotMessage(this.settings.phoneLabel || 'הי! נשמח להכיר אותך!\nמה מספר הטלפון שלך?');
    } else if (this.settings.collectProduct) {
      this.currentStep = 'collect-product';
      this.addBotMessage(this.settings.productLabel || 'הי! נשמח להכיר אותך!\nאיזה מוצר מעניין אותך?');
      this.showProductButtons = true;
      this.addBotMessage('בחר מוצר כדי להמשיך:');
    } else {
      this.currentStep = 'ask-question';
      this.addBotMessage('הי! איך אפשר לעזור לך היום?');
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
    
    if (this.settings.collectPhone) {
      this.currentStep = 'collect-phone';
      this.addBotMessage(this.settings.phoneLabel || 'מעולה! מה מספר הטלפון שלך?');
    }else if (this.settings.collectProduct) {
      this.currentStep = 'collect-product';
      this.addBotMessage(this.settings.productLabel || 'מעולה! איזה מוצר מעניין אותך?');
      this.showProductButtons = true;
      this.addBotMessage('בחר מוצר כדי להמשיך:');
    } else {
      this.currentStep = 'ask-question';
      this.addBotMessage('מעולה! מה היית רוצה לדעת או לשאול בהתחלה? 💬');
    }
    this.currentMessage = '';
    this.shouldScrollToBottom = true;
  }

  handlePhoneSubmit(): void {
    if (!this.leadData.phone.trim()) return;
    
    if (this.settings.collectProduct) {
      this.currentStep = 'collect-product';
      this.addBotMessage(this.settings.productLabel || 'מעולה! איזה מוצר מעניין אותך?',this.settings.products);
      this.showProductButtons = true;
      this.addBotMessage('בחר מוצר כדי להמשיך:');
    } else {
      this.currentStep = 'ask-question';
      this.addBotMessage('מה תרצה לדעת?');
    }
    this.shouldScrollToBottom = true;
  }

  handleProductSubmit(): void {
    if (!this.leadData.product) return;
    
    this.currentStep = 'ask-question';
    this.addBotMessage('מעולה! מה היית רוצה לדעת או לשאול בהתחלה? 💬');
    this.shouldScrollToBottom = true;
  }

  selectProduct(product: string): void {
    this.currentMessage = product;
    this.sendMessage();
    this.showProductButtons = false;
  }

  startChatFlow(): void {
    this.initializeChat();
    // this.handleNameSubmit();
    // this.handlePhoneSubmit();
    // this.handleProductSubmit();
    
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading ) return;

    if(this.isFormStep()){
       
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: this.currentMessage,
        isUser: true,
        timestamp: new Date(),
        status: 'sent'
      };

      this.messages.push(userMessage);
      this.shouldScrollToBottom = true;
      if (this.currentStep === 'collect-name') {
        this.leadData.name = this.currentMessage.trim();
        this.handleNameSubmit();
      } else if (this.currentStep === 'collect-phone') {
        this.leadData.phone = this.currentMessage.trim();
        if(this.leadData.phone === this.settings.adminPhone && this.leadData.name === this.settings.adminaName) {
          this.openAdminPanel();
          return;
        }
        this.handlePhoneSubmit();
      } else if (this.currentStep === 'collect-product') {
        this.leadData.product = this.currentMessage.trim();
        this.handleProductSubmit();
      }
      this.currentMessage = '';
      return;
    }

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

    // Send to webhook
    this.apiService.sendMessageToWebhook(messageToSend, this.conversationId, this.settings.chatWebhookUrl).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Remove loading message
        this.messages = this.messages.filter(msg => msg.id !== loadingMessage.id);

        this.threadId = response.threadId || this.threadId;
        const answer = response.result || response.answer || response.message || 'מצטער, נראה שיש בעיה, אנא נסה שוב בעוד מספר דקות';
        
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
      conversationId: this.conversationId,
      timestamp: new Date().toISOString(),
      settings: this.settings
    };
    
    this.apiService.submitLeadToWebhook(leadDataWithConversation, this.settings.summaryWebhookUrl).subscribe({
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

  addBotMessage(text: string, products?: string[] ): void {
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      isUser: false,
      timestamp: new Date(),
      status: 'sent',
      buttons: products ? products.map(product => product) : undefined
    };
    this.messages.push(botMessage);
    this.shouldScrollToBottom = true;
  }

  resetChat(): void {
    this.messages = [];
    this.conversationEnded = false;
    this.showProductButtons = false;
    this.waitingForResponse = true;
    this.conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    this.leadData = {
      name: '',
      phone: '',
      product: '',
      questions: []
    };
    
    this.startChatFlow();
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  minimizeChat(): void {
    window.parent.postMessage({ type: 'closeChat' }, '*');
  }
  
  openAdminPanel(): void {
    const password = prompt('הזן סיסמת מנהל:');
    if (password === 'admin123') {
      this.adminPanel.openAdmin();
      this.adminPanel.isAuthenticated = true;
    } else if (password !== null) {
      alert('סיסמה שגויה');
    }
  }
}