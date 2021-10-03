import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private snackBar: MatSnackBar, private zone: NgZone) {
    this.notification$.subscribe((message) => {
      if (message != null) this.openSnackBar(message!);
    });
  }
  notify(message: string) {
    this._notification.next(message);
  }
  openSnackBar(errorText: string): void {
    this.zone.run(() => {
      const snackBar = this.snackBar.open(errorText, 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        panelClass: ['red-snackbar'],
      });
      snackBar.onAction().subscribe(() => {
        snackBar.dismiss();
      });
    });
  }
}
