import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { NotificationService } from './shared/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Angular-UI';
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.authService.loggedInUser.subscribe((user) => {
      this.isLoggedIn = user != null;
    });
  }

  ngOnInit() {
    this.notificationService.notification$.subscribe((message) => {
      if (message != null) this.notificationService.openSnackBar(message!);
    });
  }
  logout() {
    if (this.authService.logout()) {
      this.router.navigateByUrl('login');
    }
  }
}
