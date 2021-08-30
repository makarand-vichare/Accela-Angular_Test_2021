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
  let httpTestingController: HttpTestingController;
  let service: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [PostService],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
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
      const request = httpTestingController.expectOne(
        `${environment.PostsUrl}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(expectedPosts);

      httpTestingController.verify();
    });

    it('should thrown error if api call fails', () => {
      //arrange
      spyOn(service, 'handleError').and.callThrough();

      //act
      service.posts$.subscribe(
        (data) => fail('Should have failed with 500 error'),
        (error: HttpErrorResponse) => {
          // expect(error.status).toEqual(500);
          // expect(error.error).toContain('500 error');
          expect(service.handleError).toHaveBeenCalledTimes(1);
        }
      );

      //assert
      const request = httpTestingController.expectOne(
        `${environment.PostsUrl}`
      );
      expect(request.request.method).toBe('GET');
      request.flush('500 error', { status: 500, statusText: 'Error occured' });
      //request.error(new ErrorEvent('Error'));
    });
  });

  describe('postsWithAddedPost$', () => {
    it('should merge post and new post', () => {
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
  });
});
