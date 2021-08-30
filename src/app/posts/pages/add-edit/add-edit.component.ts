import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private postService: PostService,
    private authService: AuthService
  ) {}

  newPostForm!: FormGroup;
  loggedInUser!: User;
  isProcessing = false;
  errorMessage = '';

  ngOnInit(): void {
    this.newPostForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });

    this.loggedInUser = this.authService.getSessionInfo();
  }

  get f() {
    return this.newPostForm.controls;
  }

  onAdd(): void {
    if (this.newPostForm.invalid) {
      return;
    }

    this.isProcessing = true;

    let post: Post = {
      id: 0,
      userId: this.loggedInUser?.id,
      title: this.f.title.value,
      body: this.f.body.value,
    };

    this.postService
      .addPost(post)
      .pipe(
        first(),
        finalize(() => {
          this.isProcessing = false;
        })
      )
      .subscribe(
        (data) => {
          this.router.navigate(['posts'], {
            queryParams: post,
          });
        },
        (error) => {
          console.log(error);
          this.errorMessage = 'unknown exception occured.';
        }
      );
  }

  onCancel(): void {
    this.router.navigate(['posts']);
  }
}
