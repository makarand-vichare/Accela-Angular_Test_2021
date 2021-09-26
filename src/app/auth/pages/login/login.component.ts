import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isProcessing = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isProcessing = true;
    this.authService
      .authenticate(this.f.email.value)
      .pipe(
        first(),
        finalize(() => {
          this.isProcessing = false;
        })
      )
      .subscribe(
        (isAuthenticated) => {
          if (isAuthenticated) {
            this.router.navigateByUrl('posts');
          } else {
            this.errorMessage = 'the user does not exist.';
          }
        },
        (error) => {
          console.log(error);
          this.errorMessage = 'unknown exception occured.';
        }
      );
  }

  fireClientError() {
    // it is not defined, ups Error
    return throwError('Error thrown');
  }

  fireServerError() {
    this.httpClient
      .get('https://jsonplaceholder.typicode.com/1')
      .subscribe((data) => console.log('Data: ', data));
  }
}
