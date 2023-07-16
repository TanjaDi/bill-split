import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { concatMap, Subscription, timer } from 'rxjs';
import {
  NotificationService,
  NotificationType,
} from 'src/app/notification.service';

@Component({
  selector: 'bsplit-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBarComponent implements OnInit, OnDestroy {
  notificationText: string | null = null;
  notificationType: NotificationType = 'warn';
  closable: boolean = true;

  private subscriptions: Subscription[] = [];
  private resetSubscription$: Subscription | null = null;

  constructor(
    private notificationService: NotificationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.notificationService
        .getNotifications$()
        .subscribe((notificationData) => {
          if (notificationData !== null) {
            if (this.resetSubscription$ !== null) {
              // abort previous timer
              this.resetSubscription$.unsubscribe();
            }
            this.notificationText = notificationData.notificationText;
            this.closable = notificationData.closable;
            this.notificationType = notificationData.notificationType;
            if (notificationData.duration > 0) {
              this.startResetTimer(
                notificationData.notificationText,
                notificationData.duration
              );
            }
          } else {
            this.notificationText = null;
          }
          this.changeDetectorRef.markForCheck();
        })
    );
  }

  private startResetTimer(text: string, durationInSeconds: number): void {
    this.resetSubscription$ = timer(durationInSeconds * 1000)
      .pipe(concatMap(() => text))
      .subscribe((text) => {
        if (this.notificationText === text) {
          this.notificationText = null;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
