import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, EMPTY } from 'rxjs';
import { catchError, concatMap, filter, map } from 'rxjs/operators';
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

  public get postsMine$() {
    return this.postsMineData$;
  }

  public get postsOther$() {
    return this.postsOtherData$;
  }

  private postsMineData$ = combineLatest([
    this.postService.postsWithAddedPost$,
    this.selectedTabAction$,
    this.authService.loggedInUser,
  ]).pipe(
    filter<[Post[], number, User]>(([posts, selectedTab, user]) => {
      return selectedTab == 0;
    }),
    map(([posts, selectedTab, user]) => {
      posts = posts.filter((post: Post) => this.filterPostsByMe(post));
      if (this.cachedPost != null) {
        posts.unshift(this.cachedPost);
      }
      posts.map(p => (p.userName = user.name));
      return posts;
    }),
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  private postsOtherData$ = combineLatest([
    this.postService.posts$,
    this.selectedTabAction$,
    this.authService.users$,
  ]).pipe(
    filter<[Post[], number, User[]]>(([posts, selectedTab]) => {
      return selectedTab == 1;
    }),
    map(([posts, selectedTab, users]) => {
      posts = posts.filter((post: Post) => this.filterPostsByOther(post));
      posts.map((p) => (p.userName = users.find((u) => u.id == p.userId)?.name));
      return posts;
    }),
    catchError((err) => {
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
    const post = {
      id: 0,
      userId: 1,
      title: 'title 1',
      body: 'body1',
    } as Post;
    this.postService.addPost(post);
  }
}
