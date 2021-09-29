import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notification: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  readonly notification$: Observable<string | null> =
    this._notification.asObservable();

    notify(message: string) {
    this._notification.next(message);
  }
}
