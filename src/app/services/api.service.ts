import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ChatSettings, LeadData } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Settings endpoints
  getSettings(): Observable<ChatSettings> {
    return this.http.get<ChatSettings>(`${this.baseUrl}/settings`).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }

  updateSettings(settings: Partial<ChatSettings>): Observable<any> {
    return this.http.post(`${this.baseUrl}/settings`, settings).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }

  resetSettings(): Observable<any> {
    return this.http.post(`${this.baseUrl}/settings/reset`, {}).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }

  // Chat endpoints
  sendMessage(message: string, conversationId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat/send`, {
      message,
      conversationId
    }).pipe(
      timeout(60000), // 60 seconds for OpenAI calls
      catchError(this.handleError)
    );
  }

  // Lead submission
  submitLead(leadData: LeadData & { conversationId: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/lead/submit`, leadData).pipe(
      timeout(30000),
      catchError(this.handleError)
    );
  }

  // Health check
  healthCheck(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`).pipe(
      timeout(5000),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'נראה שיש בעיה, אנא נסה שוב בעוד מספר דקות';
    
    if (error.status === 0) {
      errorMessage = 'לא ניתן להתחבר לשרת, אנא ודא שהשרת פועל';
    } else if (error.status === 401) {
      errorMessage = 'מפתח OpenAI לא תקין';
    } else if (error.status === 429) {
      errorMessage = 'חרגת ממגבלת הקריאות, אנא נסה שוב מאוחר יותר';
    } else if (error.error?.error) {
      errorMessage = error.error.error;
    }

    return throwError(() => new Error(errorMessage));
  }
}