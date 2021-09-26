import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostService } from './posts/services/post.service';

describe('Router:App', () => {
  let location: Location;
  let router: Router;
  let fixture;

  // beforeEach(() => {
  //   TestBed.configureTestingModule({
  //     imports: [
  //       RouterTestingModule.withRoutes(routes),
  //       HttpClientTestingModule,
  //       BrowserModule,
  //       BrowserAnimationsModule,
  //       ReactiveFormsModule,
  //       MatButtonModule,
  //       MatFormFieldModule,
  //       MatInputModule,
  //     ],
  //     declarations: [AppComponent],
  //     providers: [PostService, AuthService],
  //   });

  //   router = TestBed.inject(Router);
  //   location = TestBed.inject(Location);

  //   fixture = TestBed.createComponent(AppComponent);
  //   router.initialNavigation();
  // });

  // it('navigate to "" redirects you to /', fakeAsync(() => {
  //   router.navigate(['']).then(() => {
  //     expect(location.path()).toBe('/');
  //     flush();
  //   });
  // }));

  // it('navigate to "posts" takes you to /posts', fakeAsync(() => {
  //   router.navigate(['/posts']).then(() => {
  //     expect(location.path()).toBe('/posts');
  //     flush();
  //   });
  // }));

  // it('navigate to "add" takes you to /posts/add', fakeAsync(() => {
  //   router.navigate(['/posts/add']).then(() => {
  //     expect(location.path()).toBe('/posts');
  //     flush();
  //   });
  // }));
});
