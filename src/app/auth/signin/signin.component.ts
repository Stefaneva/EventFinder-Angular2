import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UserService} from '../../user.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
// import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
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
  secondsCounter = interval(800000);
  refresher: any;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private spinner: NgxSpinnerService) { }

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
        this.userService.toastr.success('Welcome ' + this.userService.currentUser.email, 'Event Finder',{
          timeOut :  10000,
          progressBar: true
        })
        timer(3600000).subscribe(val => {
          this.logout();
          this.userService.currentUser.timer = false;
          console.log('timer value: ' + this.userService.currentUser.timer);
        });


                setTimeout(() => {
                  this.spinner.hide();
                  form.resetForm();
                  this.userService.closeDialog.emit(true);

                          
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
                      }
                    }
                  }
                }
              );
              this.userService.getBookedEvents().subscribe(
                responseUserBookedEvents => {
                  console.log(responseUserBookedEvents);
                  this.userService.bookedEvents = responseUserBookedEvents;
                  // Book Button Check
                  if (this.userService.bookedEvents.length > 0 && this.userService.eventDetails) {
                    this.userService.bookedEvents.forEach(
                      bookedEvent => {
                        console.log("this.userService.isBooked is: " + this.userService.isBooked)
                        console.log(bookedEvent.userEmail);
                        if (bookedEvent.eventId === this.userService.eventDetails.id) {
                          this.userService.isBooked = true;
                        }
                      }
                    )
                  }
                }
              )
                }, 2000);

        
        this.refresher = this.secondsCounter.subscribe(i => {
            this.userService.accessTokenExpire = false;
            this.refresh();
            console.log("New AT");
          });

        // this.userService.pollingRefresh = setInterval(() => {
        //   this.userService.accessTokenExpire = false;
        //   this.refresh();
        //   console.log("New AT");
        // }, 900000);

    //           console.log(this.userService.currentUser.notification);
    //           if (!this.userService.currentUser.notification) {
                // this.userService.snotifyService.success('Bine ai venit, ' + this.userService.currentUser.name + '!', { position: 'rightTop'});
    //           } else if (this.userService.currentUser.notification === 1) {
    //             this.userService.snotifyService.info('O programare a fost acceptata', { position: 'rightTop'});
    //           } else if (this.userService.currentUser.notification === 2) {
    //             this.userService.snotifyService.error('O programare a fost anulata', { position: 'rightTop'});
    //           } else {
    //             this.userService.snotifyService.info('O programare este in asteptare', { position: 'rightTop'});
    //           }
        },
          (error) => {
            if (error.status == 401) {
              this.isLoginError = true;
            }
            this.spinner.hide();
            form.resetForm();
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
  }

  refresh() {
    // this.userService.accessTokenExpire = true;
    this.userService.refreshTokens(null).subscribe(
      (data: any) => {
        this.userService.currentUser.accessToken = data.accessToken;
        this.userService.currentUser.refreshToken = data.refreshToken;
        console.log(this.userService.currentUser.accessToken);
        console.log(this.userService.currentUser.refreshToken);
        this.userService.accessTokenExpire = true;
      }
    )
  }

  logout() {
    // clearInterval(this.userService.pollingRefresh);
    this.refresher.unsubscribe();
    this.userService.currentUser.name = null;
    this.userService.currentUser.email = null;
    this.userService.currentUser.accessToken = null;
    this.userService.currentUser.lastLoginDate = null;
    this.userService.currentUser.enabled = null;
    this.userService.currentUser.phone = null;
    this.userService.currentUser.type = null;
    if (this.router.url === '/calendar' || this.router.url === '/eventFinderData'
        || this.router.url === '/myEvents' || this.router.url === '/favorites'
        || this.router.url === '/userList') {
      this.router.navigateByUrl('/home');
    }
    this.userService.isFavourite = false;
    this.userService.userReviewedEvent = false;
  }
}
