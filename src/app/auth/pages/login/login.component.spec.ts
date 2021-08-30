import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let submitEl: DebugElement;
  let emailEl: DebugElement;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
      ],
      providers: [
        AuthService,
        FormBuilder,
        {
          provide: Router,
          useValue: {
            navigateByUrl: (url: string) => {
              return {
                then: () => {},
              };
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    submitEl = fixture.debugElement.query(By.css('button'));
    emailEl = fixture.debugElement.query(By.css('#email'));
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('component instantiation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('on load the submit button should be disabled', () => {
      expect(submitEl.nativeElement.disabled).toBeTruthy();
    });

    it('on load the email input should be empty', () => {
      expect(emailEl.nativeElement.value.length).toBe(0);
    });
  });

  describe('Invalid  form check', () => {
    it('the submit button should be disabled if email is invalid', () => {
      emailEl.nativeElement.value = 'invalid.Email';
      fixture.detectChanges();
      expect(submitEl.nativeElement.disabled).toBeTruthy();
    });

    it('the submit button should be disabled if email is empty', () => {
      emailEl.nativeElement.value = '';
      fixture.detectChanges();
      expect(submitEl.nativeElement.disabled).toBeTruthy();
    });

    it('the submit button should be disabled if email is with only spaces', () => {
      emailEl.nativeElement.value = '  ';
      fixture.detectChanges();
      expect(submitEl.nativeElement.disabled).toBeTruthy();
    });
  });

  describe('submit valid login form', () => {
    it('authService authenticate() should called ', fakeAsync(() => {
      //arrange
      spyOn(authService, 'authenticate').and.returnValue(of(true));

      emailEl.nativeElement.value = 'valid@Email.com';
      emailEl.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // act
      submitEl.nativeElement.click();
      fixture.detectChanges();
      tick();
      //assert
      expect(authService.authenticate).toHaveBeenCalled();
    }));

    it('should redirect to home page', fakeAsync(() => {
      //arrange
      spyOn(authService, 'authenticate').and.returnValue(of(true));
      spyOn(router, 'navigateByUrl').and.callThrough();
      const email = 'valid@Email.com';
      emailEl.nativeElement.value = email;
      emailEl.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      //act
      submitEl.nativeElement.click();
      fixture.detectChanges();
      tick();

      //assert
      expect(router.navigateByUrl).toHaveBeenCalled();
    }));
  });
});
