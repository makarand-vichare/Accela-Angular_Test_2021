import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ErrorsHandler } from './errors-handler/errors-handler';
import { ErrorRoutingModule } from './errors-routing/errors-routing.module';
import { ErrorsComponent } from './errors-component/errors.component';
import { ServerErrorsInterceptor } from './interceptors/serverErrors.interceptor';

@NgModule({
  imports: [CommonModule, RouterModule, ErrorRoutingModule],
  declarations: [ErrorsComponent],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true,
    },
  ],
})
export class ErrorsModule {}
