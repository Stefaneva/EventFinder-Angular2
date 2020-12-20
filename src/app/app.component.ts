import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {UserService} from './user.service';
import {MatSidenav} from '@angular/material/sidenav';
import {FormControl, FormGroup} from '@angular/forms';
// import {MapsAPILoader} from '@agm/core';

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
              // private mapsAPILoader: MapsAPILoader
              private ngZone: NgZone
              ) {
  }

  ngAfterViewInit() {
    this.userService.sidenav = this.mySidenav;
    console.log(this.userService.sidenav + " and " + this.mySidenav );
  }

  ngOnInit(): void {
    this.userService.sidenav = this.mySidenav;
    console.log(this.userService.sidenav + " and " + this.mySidenav );
    this.userService.searchElementRef = this.searchElementRef;
    this.userService.searchLocation = new FormGroup({
      'searchControl' : new FormControl(null)
    });
  //   this.mapsAPILoader.load().then(() => {
  //     const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
  //       // types: ['address']
  //     });
  //     autocomplete.addListener('place_changed', () => {
  //       this.ngZone.run(() => {

  //         // get the place result
  //         const place: google.maps.places.PlaceResult = autocomplete.getPlace();
  //         // verify result
  //         if (place.geometry === undefined || place.geometry === null) {
  //           return;
  //         }
  //         // set latitude, longitude and zoom
  //         this.userService.searchLat = place.geometry.location.lat();
  //         this.userService.searchLng = place.geometry.location.lng();
  //         console.log(place + ' ' + this.userService.searchLat + ' ' + this.userService.searchLng);
  //       });
  //     });
  //   });
  }

  resetFilters() {
  //   this.userService.adItemType = null;
  //   this.userService.rentCheckbox = false;
  //   this.userService.saleCheckbox = false;
  //   this.userService.priceMin = null;
  //   this.userService.priceMax = null;
  //   this.userService.surfaceMin = null;
  //   this.userService.surfaceMax = null;
  //   this.userService.roomsMin = null;
  //   this.userService.roomsMax = null;
  //   this.userService.furnished = null;
  //   this.userService.yearBuiltMin = null;
  //   this.userService.yearBuiltMax = null;
  //   this.userService.partitioning = null;
  //   this.userService.comfort = null;
  //   this.userService.floorLevelMin = null;
  //   this.userService.floorLevelMax = null;
  //   this.userService.areaSurfaceMin = null;
  //   this.userService.areaSurfaceMax = null;
  //   this.userService.searchLat = null;
  //   this.userService.searchLng = null;
  //   this.userService.searchLocation.get('searchControl').setValue(null);
  }
}
