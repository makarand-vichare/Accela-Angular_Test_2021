import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-post.list',
  templateUrl: './post.list.component.html',
  styleUrls: ['./post.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit {
  errorMessage = '';
  loggedInUser: User | undefined;
  cachedPost: Post | undefined;
  private selectedTabSubject = new BehaviorSubject<number>(0);
  public get selectedTabAction$() {
    return this.selectedTabSubject.asObservable();
  }

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getSessionInfo();

    this.activatedRoute.queryParamMap.subscribe((param) => {
      if (param.get('userId')) {
        this.cachedPost = {
          userId: Number(param.get('userId')),
          body: param.get('body'),
          title: param.get('title'),
          id: Number(param.get('id')),
        } as Post;
      }
    });
  }

  public get posts$() {
    return this.postsData$;
  }

  private postsData$ = combineLatest([
    this.postService.postsWithAddedPost$,
    this.selectedTabAction$,
  ]).pipe(
    map(([posts, selectedTabId]) => {
      posts = posts.filter((post: Post) =>
        selectedTabId == 0
          ? this.filterPostsByMe(post)
          : this.filterPostsByOther(post)
      );
      if (selectedTabId == 0 && this.cachedPost != null) {
        posts.unshift(this.cachedPost);
      }
      return posts;
    }),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  private filterPostsByMe(post: Post) {
    return post.userId == this.loggedInUser?.id;
  }

  private filterPostsByOther(post: Post) {
    return post.userId !== this.loggedInUser?.id;
  }

  onSelectedTabChange(changeEvent: MatTabChangeEvent): void {
    this.selectedTabSubject.next(changeEvent.index);
  }

  createPost(): void {
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  createPostWithoutCache(): void {
    let post: Post = {
      id: 0,
      userId: 1,
      title: 'title 1',
      body: 'body1',
    };
    this.postService.addPost(post);
  }
}
