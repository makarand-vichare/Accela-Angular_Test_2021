import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  template: '',
})
export class NotificationComponent implements OnInit {
  constructor(
    private notificationService: NotificationService,
    public snackBar: MatSnackBar
  ) {}

  notification!: string | null;

  ngOnInit() {
    this.notificationService.notification$.subscribe((message) => {
      this.notification = message;
      if (message != null) this.showError(message!);
    });
  }

  showSuccess(message: string, action = '', config?: MatSnackBarConfig) {
    config!.horizontalPosition = 'end';
    config!.verticalPosition = 'top';
    this.snackBar.open(message, 'close', config);
  }

  showError(message: string): void {
    this.snackBar.open(message, 'close', {
      verticalPosition: 'top', // 'top' | 'bottom'
      horizontalPosition: 'end', //'start' | 'center' | 'end' | 'left' | 'right'
      panelClass: ['red-snackbar'],
    });
  }
}
