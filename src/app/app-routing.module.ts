import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from './auth/guards/authorize.guard';
import { LoginComponent } from './auth/pages/login/login.component';

const postsModule = () =>
  import('./posts/posts.module').then((x) => x.PostsModule);

const eventModule = () =>
  import('./errors/errors.module').then((x) => x.ErrorsModule);

export const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'error', loadChildren: eventModule },
  { path: 'posts', loadChildren: postsModule, canActivate: [AuthorizeGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
