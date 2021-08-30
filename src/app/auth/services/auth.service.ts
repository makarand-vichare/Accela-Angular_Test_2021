import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private userSubject: BehaviorSubject<User>;
  public loggedInUser: Observable<User>;

  SESSIONUSER_KEY = 'sessionUser';

  constructor(private httpClient: HttpClient) {
    super();
    this.userSubject = new BehaviorSubject<User>(this.getSessionInfo());
    this.loggedInUser = this.userSubject.asObservable();
  }

  getSessionInfo(): User {
    const localInfo = sessionStorage.getItem(this.SESSIONUSER_KEY);
    if (localInfo) {
      return JSON.parse(localInfo);
    }

    return null as any;
  }

  public get isAuthenticated(): boolean {
    return this.userSubject.value?.isAuthenticated;
  }

  authenticate(email: string): Observable<boolean> {
    return this.httpClient.get(`${environment.UsersUrl}?email=${email}`).pipe(
      map((users: any) => {
        const user = users?.find((u: any) => u.email == email);
        let userInfo = null as any;
        if (user) {
          userInfo = {
            isAuthenticated: true,
            id: user.id,
          } as User;

          sessionStorage.setItem(
            this.SESSIONUSER_KEY,
            JSON.stringify(userInfo)
          );
        }
        this.userSubject.next(userInfo);
        return userInfo.isAuthenticated;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  logout(): boolean {
    this.clearSessionInfo();
    this.userSubject.next(null as any);
    return true;
  }

  private clearSessionInfo(): void {
    sessionStorage.removeItem(this.SESSIONUSER_KEY);
  }
}
