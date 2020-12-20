import {ElementRef, EventEmitter, Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {FormGroup} from '@angular/forms';
import {User} from './models/user';
import {AuthService} from './auth/auth.service';
import {SnotifyService} from 'ng-snotify';


@Injectable()
export class UserService {
  closeDialog = new EventEmitter<boolean>();

  // private _BASE_URL = 'https://home--finder.herokuapp.com';
  private _BASE_URL = 'http://localhost:8080';

  data: Object;
  page: number;
  itemsOnPage = 5;
  currentUser = new User;
  // public ads: AdDto[] = [];
  // public adDetails: AdDto;
  // public adDetailsCalendar: AdDto;
  // adDeletedOwner: AdDto;
  // adDeletedAdmin: AdDto;
  // public myAds: AdDto[] = [];
  // public favoriteAds: AdDto[] = [];
  // vars for sidenav
  term: any;
  priceMin: number;
  priceMax: number;
  saleCheckbox = false;
  rentCheckbox = false;
  adItemType: string;
  surfaceMin: number;
  surfaceMax: number;
  roomsMin: number;
  roomsMax: number;
  itemsPerPageOptions = [5, 7, 10];
  furnished: string;
  yearBuiltMin: number;
  yearBuiltMax: number;
  partitioning: string;
  comfort: number;
  floorLevelMin: number;
  floorLevelMax: number;
  areaSurfaceMin: number;
  areaSurfaceMax: number;
  sidenav: MatSidenav;
  searchLocation: FormGroup;
  searchElementRef: ElementRef;
  searchLat: number;
  searchLng: number;
  // vars for callendar
  userCalendar: boolean;
  // eventsCalendar: EventDto[] = [];
  userEvent: boolean;
  adUserPhone: number;
  isFavourite: boolean;
  // Reviews
  // reviews: ReviewDtoRequest[] = [];
  userReviewedAd: boolean;

  constructor(private http: HttpClient,
    private authService: AuthService,
    public snotifyService: SnotifyService) {

    }



}
