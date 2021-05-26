import {ElementRef, EventEmitter, Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from './models/user';
import {AuthService} from './auth/auth.service';
import {SnotifyService} from 'ng-snotify';
import { TokenDto } from './models/tokenDto';
import { UserDtoUpdate } from './models/userDtoUpdate';
import { EventDto } from './event/eventDto';
import { ReviewDtoRequest } from './models/reviewDtoRequest';
import { EventDetailsDto } from './models/eventDetails';
import * as moment from 'moment';
import { FavoriteDto } from './models/favoriteDto';
import { ReviewDtoResponse } from './models/reviewDtoResponse';

@Injectable()
export class UserService {
  closeDialog = new EventEmitter<boolean>();

  private _BASE_URL_TOKEN_GENERATOR = 'https://localhost:8080';
  private _BASE_URL_TOKEN_MANAGER = 'https://localhost:8085';
  // private _GET_USER_EMAILS = this._BASE_URL + '/api/getUserEmails';
  private _REFRESH_TOKEN = this._BASE_URL_TOKEN_GENERATOR + '/api/refreshAuthentication';
  private _UPDATE_USER_DATA = this._BASE_URL_TOKEN_GENERATOR + '/api/updateUserData';
  private _GET_EVENTS_WITH_IMAGES = this._BASE_URL_TOKEN_MANAGER + '/getEvents';
  private _NEW_EVENT_URL_IMAGES = this._BASE_URL_TOKEN_MANAGER + '/newEvent';
  private _GET_EVENT_DETAILS = this._BASE_URL_TOKEN_MANAGER + '/getEventInfo';
  private _GET_EVENT_IMAGES = this._BASE_URL_TOKEN_MANAGER + '/getEventImages';
  private _REPLACE_EVENT_IMAGES = this._BASE_URL_TOKEN_MANAGER + '/replaceAdImages';
  private _SAVE_FAVORITE_EVENT = this._BASE_URL_TOKEN_MANAGER + '/saveFavorite';
  private _GET_FAVORITE_EVENTS = this._BASE_URL_TOKEN_MANAGER + '/getFavoriteEvents';
  private _UPDATE_EVENT_INFO = this._BASE_URL_TOKEN_MANAGER + '/updateEventInfo';
  private _SAVE_EVENT_REVIEW =  this._BASE_URL_TOKEN_MANAGER + '/saveEventReview';
  private _GET_EVENT_REVIEWS = this._BASE_URL_TOKEN_MANAGER + '/getEventReviews';
  private _DELETE_REVIEW = this._BASE_URL_TOKEN_MANAGER + '/deleteEventReview';
  private _EDIT_REVIEW = this._BASE_URL_TOKEN_MANAGER + '/updateEventReview';

  data: Object;
  page: number;
  itemsOnPage = 5;
  currentUser = new User;
  public events: EventDto[] = [];
  public eventDetails: EventDto;
  public eventDetailsCalendar: EventDto;
  eventDeletedOwner: EventDto;
  eventDeletedAdmin: EventDto;
  public myEvents: EventDto[] = [];
  public favoriteEvents: EventDto[] = [];
  // vars for sidenav
  term: any;
  eventType: string;
  priceMin: number;
  priceMax: number;
  freeCheckbox = false;
  paidCheckbox = false;
  feeType: string;
  availableSeats: number;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  itemsPerPageOptions = [5, 7, 10];
  category: string;
  sidenav: MatSidenav;
  searchLocation: FormGroup;
  searchElementRef: ElementRef;
  searchLat: number;
  searchLng: number;
  // vars for callendar
  userCalendar: boolean;
  // eventsCalendar: EventDto[] = [];
  userEvent: boolean;
  eventUserPhone: number;
  isFavourite: boolean;
  // Reviews
  reviews: ReviewDtoRequest[] = [];
  userReviewedEvent: boolean;

  constructor(private http: HttpClient,
    private authService: AuthService,
    public snotifyService: SnotifyService) {

    }

  refreshTokens(tokenDto: TokenDto): Observable<TokenDto> {
    return this.http.post<TokenDto>(this._REFRESH_TOKEN, tokenDto,
                                   {headers: new HttpHeaders({'Content-Type': 'application/json',
                                                              'Authorization': 'Bearer ' + this.currentUser.refreshToken})});
  }

  updateUserData(data: UserDtoUpdate): Observable<void> {
    return this.http.post<void>(this._UPDATE_USER_DATA, data);
  }

  postNewEventImages(data: FormData): Observable<void> {
    const headerPost = new HttpHeaders({'Content-Type': 'multipart/form-data'});
    return this.http.post<void>(this._NEW_EVENT_URL_IMAGES, data);
  }

  getEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(this._GET_EVENTS_WITH_IMAGES);
  }

  getEventInfo(adId: number): Observable<EventDetailsDto> {
    return this.http.post<EventDetailsDto>(this._GET_EVENT_DETAILS, adId);
  }

  getEventImages(adId: number): Observable<string[]> {
    return this.http.post<string[]>(this._GET_EVENT_IMAGES, adId);
  }

  replaceEventImages(data: FormData): Observable<void> {
    return this.http.post<void>(this._REPLACE_EVENT_IMAGES, data);
  }

  saveFavorite(favoriteDto: FavoriteDto): Observable<void> {
    return this.http.post<void>(this._SAVE_FAVORITE_EVENT, favoriteDto);
  }

  getFavoriteEvents(): Observable<EventDto[]> {
    return this.http.post<EventDto[]>(this._GET_FAVORITE_EVENTS, {email: this.currentUser.email});
  }

  updateEventInfo(data: EventDto): Observable<void> {
    return this.http.post<void>(this._UPDATE_EVENT_INFO, data);
  }

  getReviews(eventId: number): Observable<ReviewDtoRequest[]> {
    return this.http.post<ReviewDtoRequest[]>(this._GET_EVENT_REVIEWS, eventId);
  }

  saveReview(review: ReviewDtoResponse): Observable<number> {
    return this.http.post<number>(this._SAVE_EVENT_REVIEW, review);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.post<void>(this._DELETE_REVIEW, reviewId);
  }

  editReview(review: ReviewDtoResponse): Observable<void> {
    return this.http.post<void>(this._EDIT_REVIEW, review);
  }
}
