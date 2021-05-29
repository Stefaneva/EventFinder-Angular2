import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UserService} from '../../user.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
// import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {SnotifyService} from 'ng-snotify';
import { Observable, timer, Subscription, Subject, interval } from 'rxjs';
import { switchMap, tap, share, retry, takeUntil, take, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  private readonly imageType: string = 'data:image/PNG;base64,';
  isLoginError = false;
  isLoginError2 = false;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private snotifyService: SnotifyService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    // this.userService.userEvent = true;
    const email = form.value.email;
    const password = form.value.password;
    this.spinner.show();
    
    // timer(1000,10000).pipe(switchMap(x => this.authService.login(email, password)), take(2)).subscribe(
      this.authService.login(email, password).subscribe(
      (data: any) => {
        this.userService.currentUser = new User;
        this.userService.currentUser.email = email;
        this.userService.currentUser.accessToken = data.accessToken;
        this.userService.currentUser.refreshToken = data.refreshToken;
        this.userService.currentUser.phone = data.phone;
        this.userService.currentUser.enabled = data.enabled;
        this.userService.currentUser.type = data.type;
        console.log(this.userService.currentUser.accessToken);
        console.log(this.userService.currentUser.refreshToken);
        console.log('timer value: ' + this.userService.currentUser.timer);
        timer(7200000).subscribe(val => {
          this.logout();
          this.userService.currentUser.timer = false;
          console.log('timer value: ' + this.userService.currentUser.timer);
        });
    //     this.userService.postUserData().subscribe(
    //       result => {
    //         this.userService.currentUser.name = result.name;
    //         this.userService.currentUser.phone = result.phone;
    //         this.userService.currentUser.lastLoginDate = result.lastLoginDate;
    //         this.userService.currentUser.type = result.userType;
    //         this.userService.currentUser.enabled = result.enabled;
    //         this.userService.currentUser.notification = result.notification;
    //         if (this.userService.currentUser.enabled) {
                setTimeout(() => {
                  this.spinner.hide();
                  form.resetForm();
                  this.userService.closeDialog.emit(true);
                }, 2000);          
    //           console.log(this.userService.currentUser.notification);
    //           if (!this.userService.currentUser.notification) {
    //             this.userService.snotifyService.success('Bine ai venit, ' + this.userService.currentUser.name + '!', { position: 'rightTop'});
    //           } else if (this.userService.currentUser.notification === 1) {
    //             this.userService.snotifyService.info('O programare a fost acceptata', { position: 'rightTop'});
    //           } else if (this.userService.currentUser.notification === 2) {
    //             this.userService.snotifyService.error('O programare a fost anulata', { position: 'rightTop'});
    //           } else {
    //             this.userService.snotifyService.info('O programare este in asteptare', { position: 'rightTop'});
    //           }
              this.userService.getFavoriteEvents().subscribe(
                response => {
                  this.userService.favoriteEvents = response;
                  this.userService.favoriteEvents.forEach( ad => ad.image = this.imageType + ad.image);
                  console.log(response);
                  // Favourite Button Check
                  if (this.userService.favoriteEvents.length > 0 && this.userService.eventDetails) {
                    this.userService.favoriteEvents.forEach(
                      ad => {
                        console.log(ad.id);
                        console.log(this.userService.eventDetails.id);
                        if (ad.id === this.userService.eventDetails.id) {
                          this.userService.isFavourite = true;
                        }
                      }
                    );
                  }
                  if (this.userService.reviews.length > 0) {
                    for (const review1 of this.userService.reviews) {
                      if (review1.mail === this.userService.currentUser.email) {
                        this.userService.userReviewedEvent = true;
                        console.log("this.userService.userReviewedEvent is: " + this.userService.userReviewedEvent)
                        return;
                      }
                    }
                  }
                }
              );
    //           this.spinnerService.hide();
    //         } else {
    //           this.isLoginError2 = true;
    //           this.userService.currentUser = null;
    //         }
    //       },
    //       (error: HttpErrorResponse) => {
    //         this.isLoginError = true;
    //       }
    //     );
    //   },
    //   (error1: HttpErrorResponse) => {
    //     this.spinnerService.hide();
    //     if (error1.error === 'Bad credentials!') {
    //       this.isLoginError = true;
    //     } else {
    //       this.isLoginError2 = true;
    //     }
      },
      (error) => {
        if (error.status == 401) {
          this.isLoginError = true;
        }
        this.spinner.hide();
        form.resetForm();
      }
    );
  }


  logout() {
    this.userService.currentUser.name = null;
    this.userService.currentUser.email = null;
    this.userService.currentUser.accessToken = null;
    this.userService.currentUser.lastLoginDate = null;
    this.userService.currentUser.enabled = null;
    this.userService.currentUser.phone = null;
    this.userService.currentUser.type = null;
    if (this.router.url === '/calendar' || this.router.url === '/statistics'
        || this.router.url === '/myEvents' || this.router.url === '/favorites'
        || this.router.url === '/userList' || this.router.url === '/statistics') {
      this.router.navigateByUrl('/home');
    }
    this.userService.isFavourite = false;
    this.userService.userReviewedEvent = false;
  }
}
