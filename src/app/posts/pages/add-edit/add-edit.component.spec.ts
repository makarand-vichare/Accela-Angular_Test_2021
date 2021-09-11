import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PostService } from '../../services/post.service';

import { AddEditComponent } from './add-edit.component';

describe('AddEditComponent', () => {
  let component: AddEditComponent;
  let fixture: ComponentFixture<AddEditComponent>;
  let submitEl: DebugElement;
  let titleEl: DebugElement;
  let bodyEl: DebugElement;
  let authService: AuthService;
  let postService: PostService;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
      providers: [
        AuthService,
        PostService,
        {
          provide: Router,
          useValue: {
            navigate: (url: string) => {
              return {
                then: () => {},
              };
            },
          },
        },
      ],
      declarations: [AddEditComponent],
    })
      .overrideComponent(AddEditComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditComponent);
    component = fixture.componentInstance;
    submitEl = fixture.debugElement.query(By.css('button'));
    titleEl = fixture.debugElement.query(By.css('#title'));
    bodyEl = fixture.debugElement.query(By.css('#body'));
    authService = TestBed.inject(AuthService);
    postService = TestBed.inject(PostService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  function updateForm(title: string, body: string) {
    component.newPostForm.controls['title'].setValue(title);
    component.newPostForm.controls['body'].setValue(body);
  }

  describe('component instantiation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('on load the submit button should be disabled', () => {
      expect(submitEl.nativeElement.disabled).toBeTruthy();
    });

    it('on load the title input should be empty', () => {
      expect(titleEl.nativeElement.value.length).toBe(0);
    });

    it('on load the body input should be empty', () => {
      expect(titleEl.nativeElement.value.length).toBe(0);
    });
  });

  describe('Invalid  form check', () => {
    it('the submit button should be disabled if title is empty', () => {
      titleEl.nativeElement.value = '';
      fixture.detectChanges();
      expect(submitEl.nativeElement.disabled).toBeTruthy();
    });

    it('the submit button should be disabled if email is with only spaces', () => {
      titleEl.nativeElement.value = '  ';
      fixture.detectChanges();
      expect(submitEl.nativeElement.disabled).toBeTruthy();
    });

    it('the submit button should be disabled if body is empty', () => {
      bodyEl.nativeElement.value = '';
      fixture.detectChanges();
      expect(submitEl.nativeElement.disabled).toBeTruthy();
    });

    it('the submit button should be disabled if body is with only spaces', () => {
      bodyEl.nativeElement.value = '  ';
      fixture.detectChanges();
      expect(submitEl.nativeElement.disabled).toBeTruthy();
    });
  });

  describe('submit valid add form', () => {
    it('postService addPost() should called ', fakeAsync(() => {
      //arrange
      let user = { id: 1 } as User;
      spyOn(authService, 'getSessionInfo').and.callFake(() => user);
      component.ngOnInit();

      spyOn(postService, 'addPost').and.returnValue(of(true));

      updateForm('Title 11', 'Body 11');

      fixture.detectChanges();

      // act
      submitEl.nativeElement.click();

      tick();
      fixture.detectChanges();
      //assert
      expect(postService.addPost).toHaveBeenCalled();
    }));

    it('should redirect to home page', fakeAsync(() => {
      //arrange
      spyOn(authService, 'getSessionInfo').and.returnValue({
        id: 1,
        isAuthenticated: true,
        name: 'name1',
      });
      spyOn(router, 'navigate').and.callThrough();

      updateForm('Title 11', 'Body 11');
      fixture.detectChanges();

      //act
      submitEl.nativeElement.click();
      fixture.detectChanges();
      tick();

      //assert
      expect(router.navigate).toHaveBeenCalled();
    }));
  });
});
