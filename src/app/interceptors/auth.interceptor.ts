import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {UserService} from '../user.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
              private userService: UserService,
              public router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("My AT is: "+ this.userService.currentUser.accessToken);
    const copiedReq = req.clone({headers: req.headers.append('Authorization', 'Bearer ' + this.userService.currentUser.accessToken)});
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
              console.error("Error Event");
          } else {
              console.log(`error status : ${error.status} ${error.statusText}`);
              switch (error.status) {
                  case 401:      //login
                      this.router.navigateByUrl("/login");
                      break;
                  case 403:     //forbidden
                      // this.router.navigateByUrl("/unauthorized");
                      this.userService.refreshTokens(null).subscribe(
                        (data: any) => {
                          this.userService.currentUser.accessToken = data.accessToken;
                          this.userService.currentUser.refreshToken = data.refreshToken;
                          console.log(this.userService.currentUser.accessToken);
                          console.log(this.userService.currentUser.refreshToken);
                        }
                      )
                      break;
              }
          } 
      } else {
          console.error("Something unexpected happened");
      }
      return throwError(error);
      }))
    }
}
