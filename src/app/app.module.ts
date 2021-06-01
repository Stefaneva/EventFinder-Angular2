import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SignupComponent} from './auth/signup/signup.component';
import {SigninComponent} from './auth/signin/signin.component';
import {AuthService} from './auth/auth.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';

import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HeaderComponent } from './header/header.component';
import {HomeComponent} from './home/home.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {FilterPipe} from './home/FilterPipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker'
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserService } from './user.service';
import { AgmCoreModule } from '@agm/core';
import { EventComponent } from './event/event.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatMomentDateModule} from '@angular/material-moment-adapter'
import { EventDetailsComponent } from './event-details/event-details.component';
import {RatingModule} from 'ngx-rating';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { SlideshowModule } from 'ng-simple-slideshow';
import { NgImageSliderModule } from 'ng-image-slider';
import { CarouselModule } from 'ngx-owl-carousel-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FavoritesComponent } from './favorites/favorites.component';
import { UserListComponent } from './user-list/user-list.component';
import { GuardRoleService } from './guard-role.service';
import { NgxPayPalModule } from 'ngx-paypal';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { FlatpickrModule } from 'angularx-flatpickr';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home' , pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'signup' , component: SignupComponent},
  { path: 'signin' , component: SigninComponent},
  { path: 'EventDetails/:id', component: EventDetailsComponent},
  { path: 'favorites', component: FavoritesComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'userList',
    component: UserListComponent,
    canActivate: [GuardRoleService]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    HeaderComponent,
    HomeComponent,
    EventComponent,
    EditUserComponent,
    EventDetailsComponent,
    CalendarComponent,
    FavoritesComponent,
    UserListComponent,
    FilterPipe
  ],
  exports: [NgxPaginationModule, MatSidenavModule],
  imports: [
    NgxPayPalModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    NgxMatMomentModule,
    MatIconModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatExpansionModule,
    HttpClientModule,
    NgxPaginationModule,
    MatNativeDateModule,
    MatMomentDateModule,
    CarouselModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgImageSliderModule,
    FontAwesomeModule,
    MatCarouselModule.forRoot(),
    SlideshowModule,
    RouterModule.forRoot(appRoutes),
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production },
    AgmCoreModule.forRoot(  {
      apiKey: 'AIzaSyCP6Jh0CirrZAf-IDtdktCuhKPtIgh94_0',
      libraries: ['places', 'geometry']
    }),
    NgbModule
  ],
  providers: [UserService, AuthService, GuardRoleService,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: MAT_DATE_LOCALE, useValue: 'en-DE'},
    SnotifyService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
