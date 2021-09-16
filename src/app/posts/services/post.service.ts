import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable, of, Subject, throwError } from 'rxjs';

import { catchError, scan, share, shareReplay, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  private postInsertedSubject = new Subject<Post>();
  public get postInsertedAction$() {
    return this.postInsertedSubject.asObservable();
  }

  public get posts$() {
    return this.httpClient
      .get<Post[]>(`${environment.PostsUrl}`)
      .pipe(
        shareReplay(),
        catchError((err) => this.handleError(err))
      )
      .pipe(shareReplay());
  }

  public get postsWithAddedPost$() {
    return merge(this.posts$, this.postInsertedAction$).pipe(
      scan((acc: any, value) => [value, ...acc])
    );
  }

  public addPost(post: Post): Observable<boolean> {
    this.postInsertedSubject.next(post);
    return of(true);
  }
}
