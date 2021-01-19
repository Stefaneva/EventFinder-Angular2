import {ElementRef, EventEmitter, Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {FormGroup} from '@angular/forms';
import {User} from './models/user';
import {AuthService} from './auth/auth.service';
import {SnotifyService} from 'ng-snotify';
import { TokenDto } from './models/tokenDto';
import { UserDtoUpdate } from './models/userDtoUpdate';
import { EventDto } from './event/eventDto';


@Injectable()
export class UserService {
  closeDialog = new EventEmitter<boolean>();

  private _BASE_URL_TOKEN_GENERATOR = 'https://localhost:8080';
  private _BASE_URL_TOKEN_MANAGER = 'https://localhost:8085';
  // private _GET_USER_EMAILS = this._BASE_URL + '/api/getUserEmails';
  private _REFRESH_TOKEN = this._BASE_URL_TOKEN_GENERATOR + '/api/refreshAuthentication';
  private _UPDATE_USER_DATA = this._BASE_URL_TOKEN_GENERATOR + '/api/updateUserData';
  private _GET_EVENTS_WITH_IMAGES = this._BASE_URL_TOKEN_MANAGER + '/getEventsWithImages';
  private _NEW_EVENT_URL_IMAGES = this._BASE_URL_TOKEN_MANAGER + '/newEvent';

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
  priceMin: number;
  priceMax: number;
  saleCheckbox = false;
  rentCheckbox = false;
  eventItemType: string;
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
  eventUserPhone: number;
  isFavourite: boolean;
  // Reviews
  // reviews: ReviewDtoRequest[] = [];
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

  getEventsWithImages(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(this._GET_EVENTS_WITH_IMAGES);
  }
}
