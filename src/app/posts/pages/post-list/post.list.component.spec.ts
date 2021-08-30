import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { MockActivatedRoute, MockRouter } from './mocks';

import { PostListComponent } from './post.list.component';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let authService: AuthService;
  let postService: PostService;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let tabEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        AuthService,
        PostService,
        {
          provide: Router,
          useValue: new MockRouter(),
        },
        {
          provide: ActivatedRoute,
          useValue: new MockActivatedRoute(),
        },
      ],
      declarations: [PostListComponent],
    })
      .overrideComponent(PostListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListComponent);

    component = fixture.componentInstance;
    tabEl = fixture.debugElement.query(By.css('#tabGroup'));
    activatedRoute = TestBed.inject(ActivatedRoute);
    authService = TestBed.inject(AuthService);
    postService = TestBed.inject(PostService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('component instantiation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('on load the tab component exist', () => {
      expect(tabEl.nativeElement).toBeDefined();
      const tab1 = tabEl.queryAll(By.css('.mat-tab-label-content'))[0];

      const tab2 = tabEl.queryAll(By.css('.mat-tab-label-content'))[1];

      expect('My Posts').toBe(tab1.nativeElement.innerText);
      expect('Other Posts').toBe(tab2.nativeElement.innerText);
    });

    it('should call ngOnInit', () => {
      spyOn(authService, 'getSessionInfo').and.returnValue({ id: 1 } as User);
      component.ngOnInit();
      expect(authService.getSessionInfo).toHaveBeenCalled();
    });
  });

  describe('Tab selection and related posts', () => {
    it('on selecting tab 1 (index 0)', fakeAsync(() => {
      //arrange
      const tabIndex = 0;
      const allPosts: Post[] = [
        { userId: 1, id: 1, body: 'body1', title: 'title1' } as Post,
        { userId: 1, id: 2, body: 'body2', title: 'title2' } as Post,
        { userId: 2, id: 2, body: 'body2', title: 'title2' } as Post,
      ];

      spyOnProperty(component, 'selectedTabAction$').and.returnValue(() =>
        of(tabIndex)
      );

      spyOnProperty(postService, 'postsWithAddedPost$').and.returnValue(() =>
        of(allPosts)
      );

      spyOn(authService, 'getSessionInfo').and.returnValue({ id: 1 } as User);

      //act
      const tabs = tabEl.queryAll(By.css('.mat-tab-label'));
      tabs[1].nativeElement.click();
      flush();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        //assert
        expect(postService.postsWithAddedPost$).toHaveBeenCalled();
      });
    }));
  });
});
