import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostsRoutingModule } from './posts-routing-modules';
import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './pages/add-edit/add-edit.component';
import { PostListComponent } from './pages/post-list/post.list.component';
import { PostComponent } from './components/post/post.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { PostItemsComponent } from './components/post-items/post-items.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostsRoutingModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
  ],
  declarations: [
    LayoutComponent,
    PostListComponent,
    AddEditComponent,
    PostComponent,
    PostItemsComponent,
  ],
})
export class PostsModule {}
