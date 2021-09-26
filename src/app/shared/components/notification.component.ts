import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  template: '',
})
export class NotificationComponent implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  notification!: string | null;
  ngOnInit() {
    this.notificationService.notification$.subscribe((message) => {
      this.notification = message;
      this.showSuccess(message!);
    });
  }

  showSuccess(message: string, action = '', config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config);
  }

  showError(message: string): void {
    // The second parameter is the text in the button.
    // In the third, we send in the css class for the snack bar.
    this.snackBar.open(message, 'X', { panelClass: ['error'] });
  }
}
