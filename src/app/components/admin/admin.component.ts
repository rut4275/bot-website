import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatSettings } from '../../models/chat.models';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-overlay" *ngIf="isVisible" (click)="closeAdmin()">
      <div class="admin-panel" (click)="$event.stopPropagation()">
        <div class="admin-header">
          <h2>פאנל ניהול</h2>
          <button class="close-btn" (click)="closeAdmin()">✕</button>
        </div>
        
        <div *ngIf="!isAuthenticated" class="auth-section">
          <h3>הזן סיסמה</h3>
          <input type="password" 
                 [(ngModel)]="password" 
                 (keyup.enter)="authenticate()"
                 placeholder="סיסמה"
                 class="auth-input">
          <button (click)="authenticate()" class="auth-btn">כניסה</button>
        </div>
        
        <div *ngIf="isAuthenticated" class="admin-content">
          <div class="webhook-section">
            <h3>הגדרות Webhooks</h3>
            
            <div class="setting-group">
              <label>Webhook עבור הודעות צ'אט:</label>
              <input type="url" [(ngModel)]="settings.chatWebhookUrl" class="setting-input"
                     placeholder="https://api.example.com/chat">
              <small>כתובת ה-webhook שיקבל הודעות מהמשתמש ויחזיר תשובות</small>
            </div>
            
            <div class="setting-group">
              <label>Webhook עבור הגדרות:</label>
              <input type="url" [(ngModel)]="settings.settingsWebhookUrl" class="setting-input"
                     placeholder="https://api.example.com/settings">
              <small>כתובת ה-webhook לשמירה וטעינה של הגדרות</small>
            </div>
            
            <div class="setting-group">
              <label>Webhook עבור סיכום שיחה:</label>
              <input type="url" [(ngModel)]="settings.summaryWebhookUrl" class="setting-input"
                     placeholder="https://api.example.com/summary">
              <small>כתובת ה-webhook שיקבל את סיכום השיחה והליד</small>
            </div>
            
            <div class="setting-group">
              <label>Webhook כללי (לתאימות לאחור):</label>
              <input type="url" [(ngModel)]="settings.webhookUrl" class="setting-input"
                     placeholder="https://api.example.com/webhook">
              <small>כתובת webhook כללית</small>
            </div>
          </div>
          
          <div class="settings-section">
            <h3>הגדרות כלליות</h3>
            
            <div class="setting-group">
              <label>מפתח OpenAI API:</label>
              <input type="password" [(ngModel)]="settings.openaiApiKey" class="setting-input"
                     placeholder="sk-...">
              <small>מפתח API של OpenAI (אופציונלי - תלוי ב-webhook)</small>
            </div>
            
            <div class="setting-group">
              <label>כותרת הצ'אט:</label>
              <input type="text" [(ngModel)]="settings.chatTitle" class="setting-input">
            </div>
            
            <div class="setting-group">
              <label>שם הבוט:</label>
              <input type="text" [(ngModel)]="settings.botName" class="setting-input">
            </div>
            
            <div class="setting-group">
              <label>הודעת ברוכים הבאים:</label>
              <textarea [(ngModel)]="settings.welcomeMessage" class="setting-textarea"></textarea>
            </div>
            
            <div class="setting-group">
              <label>טקסט מקום לחיצה:</label>
              <input type="text" [(ngModel)]="settings.userPlaceholder" class="setting-input">
            </div>
            
            <div class="setting-group">
              <label>אייקון הצ'אט:</label>
              <input type="text" [(ngModel)]="settings.chatIcon" class="setting-input">
            </div>
          </div>
          
          <div class="collection-section">
            <h3>הגדרות איסוף נתונים</h3>
            
            <div class="setting-group">
              <label>
                <input type="checkbox" [(ngModel)]="settings.collectName" class="setting-checkbox">
                איסוף שם
              </label>
              <input type="text" [(ngModel)]="settings.nameLabel" class="setting-input"
                     [disabled]="!settings.collectName"
                     placeholder="מה השם שלך?">
            </div>
            
            <div class="setting-group">
              <label>
                <input type="checkbox" [(ngModel)]="settings.collectPhone" class="setting-checkbox">
                איסוף טלפון
              </label>
              <input type="text" [(ngModel)]="settings.phoneLabel" class="setting-input"
                     [disabled]="!settings.collectPhone"
                     placeholder="מה מספר הטלפון שלך?">
            </div>
            
            <div class="setting-group">
              <label>
                <input type="checkbox" [(ngModel)]="settings.collectProduct" class="setting-checkbox">
                איסוף מוצר
              </label>
              <input type="text" [(ngModel)]="settings.productLabel" class="setting-input"
                     [disabled]="!settings.collectProduct"
                     placeholder="איזה מוצר מעניין אותך?">
            </div>
            
            <div class="setting-group">
              <label>רשימת מוצרים (מוצר בכל שורה):</label>
              <textarea [(ngModel)]="productsText" 
                        (ngModelChange)="updateProducts()"
                        class="setting-textarea"
                        placeholder="מוצר 1&#10;מוצר 2&#10;מוצר 3"></textarea>
            </div>
          </div>
          
          <div class="design-section">
            <h3>הגדרות עיצוב</h3>
            
            <div class="color-grid">
              <div class="setting-group">
                <label>צבע ראשי:</label>
                <input type="color" [(ngModel)]="settings.primaryColor" class="color-input">
              </div>
              
              <div class="setting-group">
                <label>צבע משני:</label>
                <input type="color" [(ngModel)]="settings.secondaryColor" class="color-input">
              </div>
              
              <div class="setting-group">
                <label>צבע טקסט:</label>
                <input type="color" [(ngModel)]="settings.textColor" class="color-input">
              </div>
              
              <div class="setting-group">
                <label>צבע רקע:</label>
                <input type="color" [(ngModel)]="settings.backgroundColor" class="color-input">
              </div>
            </div>
            
            <div class="setting-group">
              <label>פונט:</label>
              <select [(ngModel)]="settings.fontFamily" class="setting-select">
                <option value="system-ui, -apple-system, sans-serif">System UI</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
              </select>
            </div>
            
            <div class="setting-group">
              <label>גודל פונט:</label>
              <select [(ngModel)]="settings.fontSize" class="setting-select">
                <option value="12px">קטן</option>
                <option value="14px">רגיל</option>
                <option value="16px">גדול</option>
                <option value="18px">גדול מאוד</option>
              </select>
            </div>
          </div>
          
          <div class="embed-section">
            <h3>קוד הטמעה</h3>
            <textarea readonly [value]="generateEmbedCode()" class="embed-code" #embedTextarea></textarea>
            <button (click)="copyEmbedCode(embedTextarea)" class="copy-btn">העתק קוד</button>
          </div>
          
          <div class="actions">
            <button (click)="saveSettings()" class="save-btn">שמור הגדרות</button>
            <button (click)="resetSettings()" class="reset-btn">אפס הגדרות</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isVisible = false;
  isAuthenticated = false;
  password = '';
  settings: ChatSettings = {} as ChatSettings;
  productsText: string = '';
  
  private readonly ADMIN_PASSWORD = 'admin123';

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.settings$.subscribe(settings => {
      if (settings && Object.keys(settings).length > 0) {
        this.settings = { ...settings };
        this.productsText = this.settings.products ? this.settings.products.join('\n') : '';
      }
    });
  }

  updateProducts(): void {
    this.settings.products = this.productsText.split('\n').filter(p => p.trim().length > 0);
  }

  openAdmin(): void {
    this.isVisible = true;
  }

  closeAdmin(): void {
    this.isVisible = false;
    this.isAuthenticated = false;
    this.password = '';
  }

  authenticate(): void {
    if (this.password === this.ADMIN_PASSWORD) {
      this.isAuthenticated = true;
      this.password = '';
    } else {
      alert('סיסמה שגויה');
    }
  }

  saveSettings(): void {
    this.settingsService.updateSettings(this.settings);
    alert('הגדרות נשמרו בהצלחה');
  }

  resetSettings(): void {
    if (confirm('האם אתה בטוח שברצונך לאפס את ההגדרות?')) {
      this.settingsService.resetSettings();
      this.settingsService.settings$.subscribe(settings => {
        if (settings && Object.keys(settings).length > 0) {
          this.settings = { ...settings };
          this.productsText = this.settings.products ? this.settings.products.join('\n') : '';
        }
      });
      alert('הגדרות אופסו');
    }
  }

  generateEmbedCode(): string {
    const baseUrl = window.location.origin;
    return `<div id="chatbot-container"></div>
<script>
(function() {
  // Create chat icon
  const chatIcon = document.createElement('div');
  chatIcon.innerHTML = '${this.settings.chatIcon}';
  chatIcon.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background-color: ${this.settings.primaryColor};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000;
    transition: transform 0.2s;
  \`;
  
  chatIcon.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });
  
  chatIcon.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
  
  // Create chat overlay
  const chatOverlay = document.createElement('div');
  chatOverlay.style.cssText = \`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 10000;
    display: none;
  \`;
  
  const chatFrame = document.createElement('iframe');
  chatFrame.src = '${baseUrl}';
  chatFrame.style.cssText = \`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 600px;
    border: none;
    border-radius: 8px;
    background: white;
  \`;
  
  // Mobile responsive
  if (window.innerWidth <= 768) {
    chatFrame.style.width = '100%';
    chatFrame.style.height = '100%';
    chatFrame.style.borderRadius = '0';
  }
  
  chatOverlay.appendChild(chatFrame);
  
  chatIcon.addEventListener('click', function() {
    chatOverlay.style.display = 'block';
  });
  
  chatOverlay.addEventListener('click', function(e) {
    if (e.target === chatOverlay) {
      chatOverlay.style.display = 'none';
    }
  });
  
  // Listen for close messages from the chat iframe
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'closeChat') {
      chatOverlay.style.display = 'none';
    }
  });
  
  document.body.appendChild(chatIcon);
  document.body.appendChild(chatOverlay);
})();
</script>`;
  }

  copyEmbedCode(textarea: HTMLTextAreaElement): void {
    textarea.select();
    document.execCommand('copy');
    alert('קוד הטמעה הועתק');
  }
}