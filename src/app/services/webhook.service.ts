import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { WebhookResponse } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class WebhookService {
  constructor(private http: HttpClient) {}

  sendMessage(webhookUrl: string, message: string, threadId: string = ''): Observable<WebhookResponse> {
    const payload = {
      user_message: message,
      thread_id: threadId
    };

    return this.http.post<WebhookResponse>(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      timeout(60000), // 60 seconds timeout
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'נראה שיש בעיה, אנא נסה שוב בעוד מספר דקות';
    
    if (error.name === 'TimeoutError') {
      errorMessage = 'נראה שיש בעיה, אנא נסה שוב בעוד מספר דקות';
    } else if (error.status === 0) {
      errorMessage = 'בעיית חיבור לשרת, אנא נסה שוב';
    }

    return throwError(() => new Error(errorMessage));
  }
}