import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {AuthService} from '../auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import {EventDto} from './eventDto';
// import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  eventNewForm: FormGroup;
  imageType = 'data:image/PNG;base64,';
  lat = 51.678418;
  lng = 7.809007;
  zoom: number;
  locationChosen = false;
  myFiles: File [] = [];
  sMsg = '';
  base64String: string;
  map: google.maps.Map;
  mapClickListener: google.maps.MapsEventListener;
  suggestedPrice: number;
  eventDto: EventDto = new EventDto();
  address: string;

  @ViewChild('search')
  searchElementRef: ElementRef;

  constructor(private userService: UserService,
              private authService: AuthService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) { }

  ngOnInit() {
    this.eventNewForm = new FormGroup({
      'title' : new FormControl(null, Validators.required),
      'eventType' : new FormControl('Free', Validators.required),
      'eventItemType' : new FormControl(null, Validators.required),
      'price' : new FormControl(null, Validators.required),
      'seats_total' : new FormControl(null, Validators.required),
      'description' : new FormControl(null, Validators.required),
      'category' : new FormControl(null, Validators.required),
      'eventDate' : new FormControl(null, Validators.required),
      'searchControl' : new FormControl(null)
    });

    this.zoom = 4;
    this.lat = 39.8282;
    this.lng = -98.5795;

    this.setCurrentPosition();


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
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 16;
          this.locationChosen = true;
          // Location
          const geocoder = new google.maps.Geocoder();
          const latlng = new google.maps.LatLng(this.lat, this.lng);
          const request = {
            location: latlng
          };
          geocoder.geocode(request, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0] != null) {
                this.eventDto.location = results[0].formatted_address;
                console.log(this.eventDto.location);
              }
            }
          });
        });
      });
    });

    this.onChanges();
  }

  onChanges(): void {
    // this.eventNewForm.get('adItemType').valueChanges.subscribe(
    //   val => {
    //
    //   }
    // );
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
      });
    }
  }

  onSubmit() {
    console.log(this.eventNewForm);
    // this.userService.closeDialog.emit(true);
    const frmData = new FormData();
    for (let i = 0; i < this.myFiles.length; i++) {
      frmData.append('fileUpload', this.myFiles[i]);
    }
    this.eventDto.title = this.eventNewForm.value.title;
    this.eventDto.description = this.eventNewForm.value.description;
    this.eventDto.eventItemType = this.eventNewForm.value.eventItemType;
    this.eventDto.eventType = this.eventNewForm.value.eventType;
    this.eventDto.price = this.eventNewForm.value.price;
    this.eventDto.category = this.eventNewForm.value.category;
    this.eventDto.seatsTotal = this.eventNewForm.value.seats_total;
    this.eventDto.eventDate = this.eventNewForm.value.eventDate;
    this.eventDto.lat = this.lat;
    this.eventDto.lng = this.lng;
    this.eventDto.userEmail = this.userService.currentUser.email;
    // this.userService.events.splice(0, 0 , this.eventdDto);
    frmData.append('title', this.eventNewForm.value.title);
    frmData.append('description', this.eventNewForm.value.description);
    frmData.append('eventItemType', this.eventNewForm.value.eventItemType);
    frmData.append('eventType', this.eventNewForm.value.eventType);
    frmData.append('category', this.eventNewForm.value.category);
    if (this.eventNewForm.value.eventItemType === 'Free') {
      this.eventNewForm.get('price').setValue(0);
      this.eventNewForm.get('seats_total').setValue(0);
    }
    frmData.append('price', this.eventNewForm.value.price);
    frmData.append('seats_total', this.eventNewForm.value.seats_total);
    frmData.append('lat', this.lat.toString());
    frmData.append('lng', this.lng.toString());
    frmData.append('location', this.eventDto.location);
    frmData.append('userEmail', this.userService.currentUser.email);
    frmData.append('eventDate', this.eventNewForm.value.eventDate);
    console.log(frmData.getAll('fileUpload'));
    console.log(frmData.get('location'));
    console.log("FormData is: ");
    // for (var value of frmData.values()) {
    //   console.log(value);
    // }
    this.userService.postNewEventImages(frmData).subscribe(
      // (response) => {
      //   console.log(response);
      //   // this.spinnerService.show();
      //   this.userService.getEventsWithImages().subscribe(
      //     (response1) => {console.log(response1);
      //     this.userService.events = response1;
      //     // this.spinnerService.hide();
      //     this.userService.events.forEach( event => event.image = this.imageType + event.image);
      //     }
      //   );
      // },
      //     (error) => console.log(error)
    );
  }

  onChoseLocation(clickEvent) {
    console.log(this.lat + " " + this.lng);
    this.locationChosen = true;
    // Location:
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(this.lat, this.lng);
    const request = {
      location: latlng
    };
    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0] != null) {
          this.eventDto.location = results[0].formatted_address;
          console.log(this.eventDto.location);
        }
      }
    });
  }

  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.ngZone.run(() => {
        // Here we can get correct event
        console.log(e.latLng.lat(), e.latLng.lng());
        this.lat = e.latLng.lat();
        this.lng = e.latLng.lng();
      });
    });
  }

  getFileDetails (e) {
    console.log (e.target.files);
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsBinaryString(uploadedFile);
    for (let i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.eventDto.image = 'data:image/PNG;base64,' + btoa(binaryString);
  }

  // Implement in on submit
  uploadFiles () {
    const frmData = new FormData();
    for (let i = 0; i < this.myFiles.length; i++) {
      frmData.append('fileUpload', this.myFiles[i]);
    }
  }

  validForm(): boolean {
    // if (this.eventNewForm.get('eventItemType').value === 'Apartament') {
    //   return !(!this.eventNewForm.get('price').valid || !this.eventNewForm.get('title').valid
    //     || !this.eventNewForm.get('description').valid ||
    //     !this.eventNewForm.get('eventType').valid || !this.eventNewForm.get('rooms').valid || !this.eventNewForm.get('surface').valid &&
    //     !this.eventNewForm.get('partitioning').valid || !this.eventNewForm.get('comfort').valid ||
    //     !this.eventNewForm.get('floorLevel').valid || !this.eventNewForm.get('yearBuilt').valid);
    // }
    // if (this.eventNewForm.get('eventItemType').value === 'Casa') {
    //   return !(!this.eventNewForm.get('title').valid || !this.eventNewForm.get('description').valid ||
    //     !this.eventNewForm.get('eventType').valid ||
    //     !this.eventNewForm.get('rooms').valid || !this.eventNewForm.get('surface').valid ||
    //     !this.eventNewForm.get('yearBuilt').valid || !this.eventNewForm.get('areaSurface').valid ||
    //     !this.eventNewForm.get('furnished').valid || !this.eventNewForm.get('price').valid);
    // }
    return true;
  }
}
