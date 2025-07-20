import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ChatSettings } from '../models/chat.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<ChatSettings>({} as ChatSettings);
  public settings$ = this.settingsSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.apiService.getSettings().pipe(
      catchError(error => {
        console.error('Error loading settings from server:', error);
        // Return default settings if server is not available
        return of({
          webhookUrl: 'https://api.example.com/webhook',
          openaiApiKey: '',
          products: ['מוצר 1', 'מוצר 2', 'מוצר 3'],
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
        } as ChatSettings);
      })
    ).subscribe(settings => {
      this.settingsSubject.next(settings);
    });
  }

  updateSettings(newSettings: Partial<ChatSettings>): void {
    this.apiService.updateSettings(newSettings).pipe(
      tap(response => {
        if (response.settings) {
          this.settingsSubject.next(response.settings);
        }
      }),
      catchError(error => {
        console.error('Error updating settings:', error);
        return of(null);
      })
    ).subscribe();
  }

  getSettings(): ChatSettings {
    return this.settingsSubject.value;
  }

  resetSettings(): void {
    this.apiService.resetSettings().pipe(
      tap(response => {
        if (response.settings) {
          this.settingsSubject.next(response.settings);
        }
      }),
      catchError(error => {
        console.error('Error resetting settings:', error);
        return of(null);
      })
    ).subscribe();
  }
}