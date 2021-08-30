import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './auth/models/user.model';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Angular-UI';
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.loggedInUser.subscribe((user) => {
      this.isLoggedIn = user != null;
    });
  }

  logout() {
    if (this.authService.logout()) {
      this.router.navigateByUrl('login');
    }
  }
}
