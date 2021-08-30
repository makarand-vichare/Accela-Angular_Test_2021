import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from '../auth/guards/authorize.guard';
import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './pages/add-edit/add-edit.component';
import { PostListComponent } from './pages/post-list/post.list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: PostListComponent,
        canActivateChild: [AuthorizeGuard],
      },
      {
        path: 'add',
        component: AddEditComponent,
        canActivateChild: [AuthorizeGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
