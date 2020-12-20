import {ElementRef, EventEmitter, Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {FormGroup} from '@angular/forms';


@Injectable()
export class UserService {
  closeDialog = new EventEmitter<boolean>();

  // private _BASE_URL = 'https://home--finder.herokuapp.com';
  private _BASE_URL = 'http://localhost:8080';


  // constructor( private http: HttpClient
              // private authService: AuthService,
              // public snotifyService: SnotifyService) {

}
