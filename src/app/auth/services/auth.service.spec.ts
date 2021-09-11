import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let httpTestingController: HttpTestingController;
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
  });

  describe('ioc dependency check', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getSessionInfo', () => {
    it('should return user info from session storage if session info exists', () => {
      //arrange
      const expectedUser: User = {
        id: 1,
        isAuthenticated: true,
        name:'name1'
      };
      spyOn(Storage.prototype, 'getItem').and.callFake((key) => {
        return JSON.stringify(expectedUser);
      });

      //act
      const userInfo = service.getSessionInfo();

      //assert
      expect(userInfo).toEqual(expectedUser);
    });

    it('should return null from session storage if there is no session info', () => {
      //arrange
      spyOn(Storage.prototype, 'getItem').and.callFake((key) => {
        return null;
      });

      //act
      const userInfo = service.getSessionInfo();

      //assert
      expect(userInfo).toBeNull();
    });
  });

  describe('authenticate', () => {
    it('should return false if email not found', () => {
      //arrange
      const expected = null;
      const email = 'email@test.com';

      //act
      service.authenticate(email).subscribe((success) => {
        expect(success).toBeFalsy();
      });

      //assert
      const request = httpTestingController.expectOne(
        `${environment.UsersUrl}?email=${email}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(expected);

      httpTestingController.verify();
    });

    it('should return true if email found', () => {
      //arrange
      const email = 'email@test.com';
      const expected = [{ id: 1, email: email }] as any;

      const spyOnSession = spyOn(Storage.prototype, 'setItem').and.callFake(
        (key, value) => {}
      );

      //act
      service.authenticate(email).subscribe((success) => {
        expect(success).toBeTruthy();
      });

      //assert
      const request = httpTestingController.expectOne(
        `${environment.UsersUrl}?email=${email}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(expected);

      httpTestingController.verify();
    });

    it('should store sessioninfo if email found', () => {
      //arrange
      const email = 'email@test.com';
      const expected = [{ id: 1, email: email }] as any;

      const spyOnSession = spyOn(Storage.prototype, 'setItem').and.callFake(
        (key, value) => {}
      );

      //act
      service.authenticate(email).subscribe((success) => {
        expect(success).toBeTruthy();
      });

      //assert
      const request = httpTestingController.expectOne(
        `${environment.UsersUrl}?email=${email}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(expected);

      httpTestingController.verify();

      expect(spyOnSession).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear sessioninfo on logout', () => {
      //arrange

      const spyOnSession = spyOn(Storage.prototype, 'removeItem');

      //act
      service.logout();

      //assert
      expect(spyOnSession).toHaveBeenCalled();
    });
  });
});
