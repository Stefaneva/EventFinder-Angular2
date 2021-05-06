import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {MatDialog} from '@angular/material/dialog';
import {SigninComponent} from '../auth/signin/signin.component';
import {SignupComponent} from '../auth/signup/signup.component';
import {EventComponent} from '../event/event.component';
import {Router} from '@angular/router';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public userService: UserService,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
  }

  openLogin(): void {
    this.userService.closeDialog.subscribe(result => this.dialog.closeAll());
    const dialogRef = this.dialog.open(SigninComponent, {});
  }

  openRegister(): void {
    this.userService.closeDialog.subscribe(result => this.dialog.closeAll());
    const dialogRef = this.dialog.open(SignupComponent, {});
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
        || this.router.url === '/myAds' || this.router.url === '/favorites'
        || this.router.url === '/userList' || this.router.url === 'statistics') {
      this.router.navigateByUrl('/home');
    }
    this.userService.isFavourite = false;
    this.userService.userReviewedEvent = false;
  }

  addNewEvent(): void {
    this.userService.closeDialog.subscribe(result => this.dialog.closeAll());
    const dialogRef = this.dialog.open(EventComponent, {
      height: '75vh',
      width: '55vw',
    });
  }

  openEdit() {
    this.userService.closeDialog.subscribe(result => this.dialog.closeAll());
    const dialogRef = this.dialog.open(EditUserComponent, {});
  }

  redirectHome() {
    this.router.navigateByUrl('/home');
  }
}
