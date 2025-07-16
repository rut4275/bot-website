import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { AdminComponent } from './components/admin/admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatComponent, AdminComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>מערכת צ'אטבוט</h1>
        <button (click)="openAdmin()" class="admin-btn">פאנל ניהול</button>
      </header>
      
      <main class="app-main">
        <app-chat></app-chat>
      </main>
      
      <app-admin #adminPanel></app-admin>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('adminPanel') adminPanel!: AdminComponent;

  openAdmin(): void {
    this.adminPanel.openAdmin();
  }
}