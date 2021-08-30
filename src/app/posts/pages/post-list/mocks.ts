import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';

export class MockActivatedRoute extends ActivatedRoute {
  public params = of({ id: 123 });
  public queryParams = of({ id: 123 });
}

export class MockRouter {
  navigateByUrl(url: string): any {
    return {
      then: () => {},
    };
  }
}
