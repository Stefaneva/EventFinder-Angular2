import {ElementRef, EventEmitter, Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from './models/user';
import {AuthService} from './auth/auth.service';
import { TokenDto } from './models/tokenDto';
import { UserDtoUpdate } from './models/userDtoUpdate';
import { EventDto } from './event/eventDto';
import { ReviewDtoRequest } from './models/reviewDtoRequest';
import { EventDetailsDto } from './models/eventDetails';
import * as moment from 'moment';
import { FavoriteDto } from './models/favoriteDto';
import { ReviewDtoResponse } from './models/reviewDtoResponse';
import { UserDataDto } from './models/userDataDto';
import { CalendarEventDto } from './models/calendarEvent';
import { ToastrService } from 'ngx-toastr';
import { EventsReportDto } from './models/eventsReportDto';

@Injectable()
export class UserService {
  closeDialog = new EventEmitter<boolean>();

  private _MAIN_URL_TOKEN_GENERATOR = 'https://localhost:8080';
  // private _MAIN_URL_TOKEN_GENERATOR = 'https://event-finder-token-manager.herokuapp.com';
  private _MAIN_URL_EVENT_MANGER = 'https://localhost:8085';
  // private _MAIN_URL_TOKEN_MANGER = 'https://event-finder-manager.herokuapp.com';
  // private _GET_USER_EMAILS = this._BASE_URL + '/api/getUserEmails';
  private _REFRESH_TOKEN = this._MAIN_URL_TOKEN_GENERATOR + '/api/refreshAuthentication';
  private _UPDATE_USER_DATA = this._MAIN_URL_TOKEN_GENERATOR + '/api/updateUserData';
  private _GET_USERS_URL = this._MAIN_URL_TOKEN_GENERATOR + '/getAllUsers';
  private _USER_UPDATE_ACCESS_URL = this._MAIN_URL_TOKEN_GENERATOR + '/updateUserAccess';
  private _GET_EVENTS_MAIN_PAGE = this._MAIN_URL_EVENT_MANGER + '/getEvents';
  private _NEW_EVENT_URL_IMAGES = this._MAIN_URL_EVENT_MANGER + '/newEvent';
  private _GET_EVENT_DETAILS = this._MAIN_URL_EVENT_MANGER + '/getEventInfo';
  private _GET_EVENT_IMAGES = this._MAIN_URL_EVENT_MANGER + '/getEventImages';
  private _REPLACE_EVENT_IMAGES = this._MAIN_URL_EVENT_MANGER + '/replaceEventImages';
  private _SAVE_FAVORITE_EVENT = this._MAIN_URL_EVENT_MANGER + '/saveFavorite';
  private _GET_FAVORITE_EVENTS = this._MAIN_URL_EVENT_MANGER + '/getFavoriteEvents';
  private _GET_MY_USER_EVENTS = this._MAIN_URL_EVENT_MANGER + '/getMyUserEvents';
  private _UPDATE_EVENT_INFO = this._MAIN_URL_EVENT_MANGER + '/updateEventInfo';
  private _SAVE_BOOKED_EVENT = this._MAIN_URL_EVENT_MANGER + '/saveBookedEvent';
  private _GET_BOOKED_EVENTS = this._MAIN_URL_EVENT_MANGER + '/getBookedEvents';
  private _SAVE_EVENT_REVIEW =  this._MAIN_URL_EVENT_MANGER + '/saveEventReview';
  private _GET_EVENT_REVIEWS = this._MAIN_URL_EVENT_MANGER + '/getEventReviews';
  private _DELETE_REVIEW = this._MAIN_URL_EVENT_MANGER + '/deleteEventReview';
  private _EDIT_REVIEW = this._MAIN_URL_EVENT_MANGER + '/updateEventReview';
  private _DELETE_EVENT = this._MAIN_URL_EVENT_MANGER + '/deleteEvent';
  private _GET_REPORTS = this._MAIN_URL_EVENT_MANGER + '/eventsReport';

  data: Object;
  page: number;
  itemsOnPage = 5;
  currentUser = new User;
  public events: EventDto[] = [];
  public eventDetails: EventDto;
  public eventDetailsCalendar: EventDto;
  eventDeletedOwner: EventDto;
  eventDeletedAdmin: EventDto;
  // public myEvents: EventDto[] = [];
  public favoriteEvents: EventDto[] = [];
  public myUserEvents: EventDto[] = [];
  public bookedEvents: CalendarEventDto[] = [];
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
  isBooked: boolean;
  // Reviews
  reviews: ReviewDtoRequest[] = [];
  userReviewedEvent: boolean;

  constructor(private http: HttpClient,
              private authService: AuthService,
              public toastr: ToastrService) {
                
              }

  refreshTokens(tokenDto: TokenDto): Observable<TokenDto> {
    return this.http.post<TokenDto>(this._REFRESH_TOKEN, tokenDto,
                                   {headers: new HttpHeaders({'Content-Type': 'application/json',
                                                              'Authorization': 'Bearer ' + this.currentUser.refreshToken})});
  }

  updateUserData(data: UserDtoUpdate): Observable<void> {
    return this.http.post<void>(this._UPDATE_USER_DATA, data);
  }

  getUsers(): Observable<UserDataDto[]> {
    return this.http.get<UserDataDto[]>(this._GET_USERS_URL);
  }

  updateUserAccess(user: UserDataDto): Observable<void> {
    return this.http.post<void>(this._USER_UPDATE_ACCESS_URL, user);
  }

  postNewEventImages(data: FormData): Observable<void> {
    const headerPost = new HttpHeaders({'Content-Type': 'multipart/form-data'});
    return this.http.post<void>(this._NEW_EVENT_URL_IMAGES, data);
  }

  getEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(this._GET_EVENTS_MAIN_PAGE);
  }

  getEventInfo(eventId: number): Observable<EventDetailsDto> {
    return this.http.post<EventDetailsDto>(this._GET_EVENT_DETAILS, eventId);
  }

  getEventImages(eventId: number): Observable<string[]> {
    return this.http.post<string[]>(this._GET_EVENT_IMAGES, eventId);
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.http.post<void>(this._DELETE_EVENT, eventId);
  }

  getMyUserEvents(): Observable<EventDto[]>{
    return this.http.post<EventDto[]>(this._GET_MY_USER_EVENTS, {email: this.currentUser.email});
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

  bookEvent(calendarEventDto: CalendarEventDto): Observable<void> {
    return this.http.post<void>(this._SAVE_BOOKED_EVENT, calendarEventDto);
  }

  getBookedEvents(): Observable<CalendarEventDto[]> {
    return this.http.post<CalendarEventDto[]>(this._GET_BOOKED_EVENTS , {email: this.currentUser.email});
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

  getEventsReport(): Observable<EventsReportDto> {
    return this.http.get<EventsReportDto>(this._GET_REPORTS);
  }
}
