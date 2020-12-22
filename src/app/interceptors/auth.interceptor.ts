import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {UserService} from '../user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
              private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const copiedReq = req.clone({headers: req.headers.append('Authorization', 'Bearer ' + this.userService.currentUser.accessToken)});
    return next.handle(copiedReq);
  }
}
