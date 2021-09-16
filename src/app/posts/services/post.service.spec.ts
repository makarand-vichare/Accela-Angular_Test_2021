import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { PostService } from './post.service';
import { Post } from '../models/post.model';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('PostService', () => {
  let httpMock: HttpTestingController;
  let service: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [PostService],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PostService);
  });

  describe('ioc dependency check', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('post$', () => {
    it('should return post array successful if api call succeed', () => {
      //arrange
      const expectedPosts: Post[] = [
        { id: 1, body: 'body1', title: 'title1' } as Post,
        { id: 2, body: 'body2', title: 'title2' } as Post,
      ];

      //act
      service.posts$.subscribe((posts) => {
        expect(expectedPosts).toEqual(posts);
      });

      //assert
      const request = httpMock.expectOne(`${environment.PostsUrl}`);

      request.flush(expectedPosts);
      httpMock.verify();
      expect(request.request.method).toBe('GET');
    });

    it('should thrown error if api call fails', () => {
      //arrange
      spyOn(service, 'handleError').and.callThrough();
      const status = 500;
      const statusText = 'Server error';
      const errorEvent = new ErrorEvent('API error');
      let actualError: HttpErrorResponse | undefined;

      //act
      service.posts$.subscribe(
        () => {
          fail('next handler must not be called');
        },
        (error: HttpErrorResponse) => {
          actualError = error;
        },
        () => {
          fail('complete handler must not be called');
        }
      );

      const request = httpMock.expectOne(`${environment.PostsUrl}`);
      request.error(errorEvent, {
        status: status,
        statusText: statusText,
      });

      httpMock.verify();
      if (!actualError) {
        throw new Error('Error needs to be defined');
      }

      //assert
      expect(request.request.method).toBe('GET');
      expect(actualError.error).toBe(errorEvent);
      expect(actualError.status).toBe(status);
      expect(actualError.statusText).toBe(statusText);
      expect(service.handleError).toHaveBeenCalledTimes(1);
    });
  });

  describe('postsWithAddedPost$', () => {
    fit('should merge post and new post', () => {
      //arrange
      const oldPosts: Post[] = [
        { id: 1, body: 'body1', title: 'title1' } as Post,
        { id: 2, body: 'body2', title: 'title2' } as Post,
      ];
      const newPost: Post = {
        id: 3,
        body: 'body3',
        title: 'title3',
        userId: 1,
        userName: 'userName1',
      };

      const expectedPosts = [newPost, ...oldPosts];
      let result: Post[] = [];

      spyOnProperty(service, 'postInsertedAction$').and.returnValue(
        of(newPost)
      );

      spyOnProperty(service, 'posts$').and.returnValue(of(oldPosts));

      //act
      service.postsWithAddedPost$.subscribe((t) => {
        result = t;
      });

      //assert
      expect(expectedPosts).toEqual(result);
    });

    /*     it('creates a spy object with properties', function () {
      let obj = jasmine.createSpyObj('myObject', {}, { x: 3, y: 4 });
      expect(obj.x).toEqual(3);
      spyPropertyGetter(obj, 'x').and.returnValue(1);
      expect(obj.x).toEqual(1);
    }); */
  });
});
