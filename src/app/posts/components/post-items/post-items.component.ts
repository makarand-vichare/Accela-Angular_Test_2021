import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-items',
  templateUrl: './post-items.component.html',
  styleUrls: ['./post-items.component.scss'],
})
export class PostItemsComponent implements OnInit {
  constructor() {}

  @Input() posts$: Observable<Post[]> | undefined;

  ngOnInit(): void {}
}
