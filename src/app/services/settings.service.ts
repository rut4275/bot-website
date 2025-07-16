import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatSettings } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private defaultSettings: ChatSettings = {
    webhookUrl: 'https://api.example.com/webhook',
    primaryColor: '#2563eb',
    secondaryColor: '#6b7280',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    welcomeMessage: 'שלום! איך אני יכול לעזור לך היום?',
    chatTitle: 'צ\'אטבוט',
    chatIcon: '💬',
    botName: 'עוזר',
    userPlaceholder: 'הקלד הודעה...'
  };

  private settingsSubject = new BehaviorSubject<ChatSettings>(this.defaultSettings);
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    const savedSettings = localStorage.getItem('chatbot-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        this.settingsSubject.next({ ...this.defaultSettings, ...settings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }

  updateSettings(newSettings: Partial<ChatSettings>): void {
    const currentSettings = this.settingsSubject.value;
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    localStorage.setItem('chatbot-settings', JSON.stringify(updatedSettings));
    this.settingsSubject.next(updatedSettings);
  }

  getSettings(): ChatSettings {
    return this.settingsSubject.value;
  }

  resetSettings(): void {
    localStorage.removeItem('chatbot-settings');
    this.settingsSubject.next(this.defaultSettings);
  }
}