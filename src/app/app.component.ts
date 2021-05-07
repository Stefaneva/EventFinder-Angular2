import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {UserService} from './user.service';
import {MatSidenav} from '@angular/material/sidenav';
import {FormControl, FormGroup} from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Change';

  @ViewChild('sidenav') mySidenav: MatSidenav;
  @ViewChild('search')
  searchElementRef: ElementRef;

  constructor(public userService: UserService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone
              ) {
  }

  ngAfterViewInit() {
    this.userService.sidenav = this.mySidenav;
  }

  ngOnInit(): void {
    this.userService.sidenav = this.mySidenav;
    this.userService.searchElementRef = this.searchElementRef;
    this.userService.searchLocation = new FormGroup({
      'searchControl' : new FormControl(null)
    });
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        // types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {

          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.userService.searchLat = place.geometry.location.lat();
          this.userService.searchLng = place.geometry.location.lng();
          console.log(place + ' ' + this.userService.searchLat + ' ' + this.userService.searchLng);
        });
      });
    });
  }

  resetFilters() {
    this.userService.eventType = null;
    this.userService.freeCheckbox = false;
    this.userService.paidCheckbox = false;
    this.userService.feeType = null;
    this.userService.priceMin = null;
    this.userService.priceMax = null;
    this.userService.itemsPerPageOptions = [5, 7, 10];
    // console.log(this.userService.range.value);
    // console.log(this.userService.range.value.start._i);
    // console.log(this.userService.range.get('start').value._i);
    this.userService.range.get('start').setValue(new FormControl());
    this.userService.range.get('end').setValue(new FormControl());
    this.userService.availableSeats = null;
    this.userService.category = null;
    this.userService.searchLat = null;
    this.userService.searchLng = null;
    this.userService.searchLocation.get('searchControl').setValue(null);
  }
}
