import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'info' | 'warn' | 'error';

export interface NotificationData {
  notificationText: string;
  notificationType: NotificationType;
  duration: number | 0;
  closable: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notification$: BehaviorSubject<NotificationData | null> =
    new BehaviorSubject<NotificationData | null>(null);

  constructor() {}

  showError(errorText: string, closable = false, duration = 0): void {
    const notification: NotificationData = {
      notificationText: errorText,
      notificationType: 'error',
      duration,
      closable,
    };
    this.notification$.next(notification);
  }

  showWarning(text: string): void {
    const notification: NotificationData = {
      notificationText: text,
      notificationType: 'warn',
      duration: 10,
      closable: false,
    };
    this.notification$.next(notification);
  }

  showInfo(text: string): void {
    const notification: NotificationData = {
      notificationText: text,
      notificationType: 'info',
      duration: 10,
      closable: true,
    };
    this.notification$.next(notification);
  }

  getNotifications$(): Observable<NotificationData | null> {
    return this.notification$;
  }

  clear(): void {
    this.notification$.next(null);
  }
}
