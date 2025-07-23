import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ChatSettings } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'chatbot-settings';
  private readonly DEFAULT_SETTINGS: ChatSettings = {
    webhookUrl: "https://api.example.com/webhook",
    chatWebhookUrl: "https://api.example.com/chat",
    settingsWebhookUrl: "https://api.example.com/settings",
    summaryWebhookUrl: "https://api.example.com/summary",
    openaiApiKey: "",
    products: ["Product 1", "Product 2", "Product 3"],
    primaryColor: "#2563eb",
    secondaryColor: "#6b7280",
    textColor: "#1f2937",
    backgroundColor: "#ffffff",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: "14px",
    welcomeMessage: "היי! נעים להכיר 😊 איך קוראים לך?",
    chatTitle: "Chatbot",
    chatIcon: "💬",
    botName: "Assistant",
    userPlaceholder: "Type a message...",
    collectName: true,
    collectPhone: true,
    collectProduct: true,
    nameLabel: "היי! נעים להכיר 😊 איך קוראים לך?",
    phoneLabel: "אשמח גם למספר הטלפון שלך, כדי שנוכל לחזור אליך אם נצטרך 📞",
    productLabel: "באיזה מוצר או שירות שלנו אתה הכי מתעניין? 📦"
  };

  private settingsSubject = new BehaviorSubject<ChatSettings>(this.DEFAULT_SETTINGS);
  public settings$ = this.settingsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSettings();
  }

  private loadSettings(): void {
    // Try to load from localStorage first
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);
        const mergedSettings = { ...this.DEFAULT_SETTINGS, ...parsedSettings };
        this.settingsSubject.next(mergedSettings);
      } catch (error) {
        console.error('Error parsing stored settings:', error);
        this.settingsSubject.next(this.DEFAULT_SETTINGS);
      }
    }

    // Try to load from webhook if configured
    const currentSettings = this.settingsSubject.value;
    if (currentSettings.settingsWebhookUrl && 
        currentSettings.settingsWebhookUrl !== 'https://api.example.com/settings') {
      this.loadFromWebhook(currentSettings.settingsWebhookUrl).subscribe({
        next: (data: ChatSettings) => {
          const mergedSettings = { ...this.DEFAULT_SETTINGS, ...data };
          this.settingsSubject.next(mergedSettings);
          this.saveToLocalStorage();
        },
        error: (error) => {
          console.warn('Failed to load settings from webhook:', error);
        }
      });
    }
  }

  private loadFromWebhook(webhookUrl: string): Observable<ChatSettings> {
    return this.http.get<ChatSettings>(webhookUrl).pipe(
      timeout(10000),
      catchError(() => of({} as ChatSettings))
    );
  }

  updateSettings(newSettings: Partial<ChatSettings>): void {
    const currentSettings = this.settingsSubject.value;
    const updatedSettings = { ...currentSettings, ...newSettings };
    this.settingsSubject.next(updatedSettings);
    this.saveToLocalStorage();

    // Try to save to webhook if configured
    if (updatedSettings.settingsWebhookUrl && 
        updatedSettings.settingsWebhookUrl !== 'https://api.example.com/settings') {
      this.saveToWebhook(updatedSettings, updatedSettings.settingsWebhookUrl).subscribe({
        next: () => {
          console.log('Settings saved to webhook successfully');
        },
        error: (error) => {
          console.warn('Failed to save settings to webhook:', error);
        }
      });
    }
  }

  private saveToWebhook(settings: ChatSettings, webhookUrl: string): Observable<any> {
    return this.http.post(webhookUrl, settings).pipe(
      timeout(10000),
      catchError(() => of({ message: 'Settings saved locally (webhook failed)' }))
    );
  }

  resetSettings(): void {
    this.settingsSubject.next({ ...this.DEFAULT_SETTINGS });
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    try {
      const settings = this.settingsSubject.value;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }

  getCurrentSettings(): ChatSettings {
    return this.settingsSubject.value;
  }
}