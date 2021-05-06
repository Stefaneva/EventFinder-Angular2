import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EventDto} from '../event/eventDto';
import {MapsAPILoader} from '@agm/core';
import {FormControl, FormGroup} from '@angular/forms';
import * as FileSaver from 'file-saver';
import {DomSanitizer} from '@angular/platform-browser';
import {FavoriteDto} from '../models/favoriteDto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReviewDtoRequest} from '../models/reviewDtoRequest';
import {ReviewDtoResponse} from '../models/reviewDtoResponse';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  images: string[] = [];
  imgBase64: string[] = [];
  private readonly imageType: string = 'data:image/PNG;base64,';
  lat = 0;
  lng = 0;
  address: string;
  oldAddress: string;
  zoom = 15;
  panelOpenState = false;
  eventId: number;
  step = 0;
  eventDetailsChanges: EventDto = new EventDto();
  changeLocation = false;
  newLocation: FormGroup;
  hidden = true;
  // adUserPhone: number;
  eventDto: EventDto = new EventDto();
  myFiles: File [] = [];
  // reviews: ReviewDtoRequest[] = [];
  rating = 0;
  comment: string;
  reviewsDates: Date[] = [];
  editReview = false;
  reviewChanges: ReviewDtoRequest;
  // userReviewedAd: boolean;

  @ViewChild('search')
  searchElementRef: ElementRef;

  constructor(public userService: UserService,
              private ngZone: NgZone,
              private mapsAPILoader: MapsAPILoader,
              private route: ActivatedRoute,
              public domSanitizer: DomSanitizer,
              public snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit() {
    this.userService.userReviewedEvent = false;
    this.userService.isFavourite = false;
    this.userService.eventDetails = new EventDto();
    this.route.params.subscribe( params => {
      this.eventId = parseInt(params['id'], 10);
      // this.userService.eventDetails.id = parseInt(this.adId, 10);
    } );
    this.userService.getEventInfo(this.eventId).subscribe(
      response1 => {
        this.eventDetailsChanges.id = response1.id;
        this.eventDetailsChanges.title = response1.title;
        this.eventDetailsChanges.description = response1.description;
        this.eventDetailsChanges.feeType = response1.feeType;
        this.eventDetailsChanges.eventType = response1.eventType;
        this.eventDetailsChanges.category = response1.category;
        this.eventDetailsChanges.price = response1.price;
        this.eventDetailsChanges.lat = response1.lat;
        this.eventDetailsChanges.lng = response1.lng;
        this.eventDetailsChanges.seatsTotal = response1.seatsTotal;
        this.eventDetailsChanges.eventDate = response1.eventDate;
        this.eventDetailsChanges.userEmail = response1.userDetails.mail;
        this.eventDetailsChanges.avgEventReview = response1.avgEventReview;
        console.log(response1);
        this.userService.eventDetails.id = response1.id;
        this.userService.eventDetails.title = response1.title;
        this.userService.eventDetails.description = response1.description;
        this.userService.eventDetails.feeType = response1.feeType;
        this.userService.eventDetails.eventType = response1.eventType;
        this.userService.eventDetails.category = response1.category;
        this.userService.eventDetails.seatsTotal = response1.seatsTotal;
        this.userService.eventDetails.price = response1.price;
        this.userService.eventDetails.lat = response1.lat;
        this.userService.eventDetails.lng = response1.lng;
        this.userService.eventDetails.eventDate = response1.eventDate;
        this.userService.eventDetails.userEmail = response1.userDetails.email;
        this.userService.eventDetails.avgEventReview = response1.avgEventReview;
        this.userService.eventUserPhone = response1.userDetails.phoneNumber;
        this.lat = this.userService.eventDetails.lat;
        this.lng = this.userService.eventDetails.lng;
        console.log(this.userService.eventDetails.id);
        // Favourite Button Check
        if (this.userService.favoriteEvents.length > 0) {
          this.userService.favoriteEvents.forEach(
            event => {
              console.log(event.id);
              console.log(this.userService.eventDetails.id);
              if (event.id === this.userService.eventDetails.id) {
                this.userService.isFavourite = true;
              }
            }
          );
        }
    // Location
        const geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(this.lat, this.lng);
        const request = {
          location: latlng
        };
        geocoder.geocode(request, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0] != null) {
              this.oldAddress = this.address;
              this.address = results[0].formatted_address;
              console.log(this.address);
            }
          }
        });
        this.userService.getEventImages(this.eventId).subscribe(
          (response) => {
            this.images = response;
            this.imgBase64 = response;
            this.eventDetailsChanges.image = this.images[0];
            for (let i = 0; i < this.images.length; i++) {
              this.images[i] = this.imageType + this.images[i];
            }
            console.log(this.images);
          }
        );
      }
    );
    this.userService.getReviews(this.eventId).subscribe(
        response => {
          this.userService.reviews = response;
          console.log(this.userService.reviews);
          let i = 0;
          this.userService.reviews.forEach(
            review => {
              this.reviewsDates[i++] = new Date(review.date);
              // if (review.userType === 'AGENT_IMOBILIAR') {
              //   review.userType = 'Agent Imobiliar';
              // } else {
              //   review.userType = 'Utilizator';
              // }
            }
          );
        }
    );
    this.newLocation = new FormGroup({
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
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.eventDetailsChanges.lat = this.lat;
          this.eventDetailsChanges.lng = this.lng;
          this.zoom = 16;
          this.changeLocation = true;
        });
      });
    });
  }

  setStep(indexx: number) {
    this.panelOpenState = true;
    this.step = indexx;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  saveChanges(step: number) {
    this.userService.eventDetails = this.eventDetailsChanges;
    this.userService.replaceEventInfo(this.eventDetailsChanges).subscribe(
      response => {
        console.log(response);
      }
    );
  }

  cancelChanges(step: number) {
    if (step === 1) {
      this.eventDetailsChanges.description = this.userService.eventDetails.description;
    }
    if (step === 2) {
      this.eventDetailsChanges = this.userService.eventDetails;
    }
  }

  onChoseLocation(event) {
    if (this.changeLocation === true) {
      this.lat = event.coords.lat;
      this.lng = event.coords.lng;
      // this.changeLocation = true;
      this.eventDetailsChanges.lat = this.lat;
      this.eventDetailsChanges.lng = this.lng;
      // Location:
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(this.lat, this.lng);
      const request = {
        location: latlng
      };
      geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0] != null) {
            this.address = results[0].formatted_address;
            console.log(this.address);
          }
        }
      });
    }
  }

  changeTheLocation() {
    this.changeLocation = true;
    this.hidden = false;
  }

  cancelLocationChanges() {
    this.lat = this.eventDetailsChanges.lat;
    this.lng = this.eventDetailsChanges.lng;
    this.changeLocation = false;
    this.hidden = true;
    this.newLocation.get('searchControl').setValue(null);
  }

  saveLocationChanges() {
    console.log(this.address);
    this.changeLocation = false;
    this.hidden = true;
    this.newLocation.get('searchControl').setValue(null);
    this.userService.eventDetails = this.eventDetailsChanges;
    this.userService.replaceEventInfo(this.eventDetailsChanges).subscribe(
      response => {
        console.log(response);
      }
    );
  }

  saveImages() {
    const imageName = 'image';
    let imageNumber = 1;
    this.imgBase64.forEach(image => {
      const res = image.slice(22, image.length);
      const byteCharacters = atob(res);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'image/png'});
      FileSaver.saveAs(blob, imageName + imageNumber);
      imageNumber++;
    });
  }

  replaceImages() {
    this.images.length = 0;
    const input   = document.getElementById('fileInput');
    input.click();
  }

  getFileDetails (e) {
    for (let i = 0; i < e.target.files.length; i++) {
      const uploadedFile = e.target.files[i];
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(uploadedFile);
      this.myFiles.push(e.target.files[i]);
    }
    const frmData = new FormData();
    frmData.append('eventId', this.eventDetailsChanges.id.toString());
    for (let i = 0; i < this.myFiles.length; i++) {
      frmData.append('fileUpload', this.myFiles[i]);
    }
    console.log(this.images);
    this.userService.replaceEventImages(frmData).subscribe(
      response => {
        console.log(response);
      }
    );
  }

  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.images.push('data:image/PNG;base64,' + btoa(binaryString));
  }

  saveFavorite() {
    if (this.userService.currentUser.accessToken) {
      this.userService.isFavourite = true;
      const favorite: FavoriteDto = new FavoriteDto();
      favorite.eventId = this.userService.eventDetails.id;
      favorite.userEmail = this.userService.currentUser.email;
      this.userService.saveFavorite(favorite).subscribe(
        response => {
          console.log(response);
          // this.snackBar.open('Anunțul a fost adăugat la favorite!', 'OK', {duration: 5000});
          this.userService.getFavoriteEvents().subscribe(
            result => {
              this.userService.favoriteEvents = result;
              this.userService.favoriteEvents.forEach( event => event.image = this.imageType + event.image);
            }
          );
        }
      );
    } else {
      // this.snackBar.open('Intră în cont pentru a adăuga anunțul la favorite!', 'OK', {duration: 5000});
    }
  }

  googleMapsDirection() {
    const url: string = 'http://maps.google.com/maps?q=' + this.lat + ',' + this.lng;
    window.open(url);
  }

  addReview() {
    if (!this.userService.currentUser.accessToken) {
      this.snackBar.open('Intră în cont pentru a adăuga o recenzie!', 'Ok', {duration: 5000});
      return;
    }
    if (this.userService.userReviewedEvent) {
      this.snackBar.open('Ați adăugat deja o recenzie!', 'Ok', {duration: 5000});
      return;
    }
    if (!this.comment || !this.rating) {
      this.snackBar.open('Trebuie să adăugați text și rating recenziei!', 'Ok', {duration: 5000});
      return;
    }
    const reviewNewArrayElement = new ReviewDtoRequest();
    const review = new ReviewDtoResponse();
    review.eventId = this.eventDetailsChanges.id;
    review.mail = this.userService.currentUser.email;
    review.comment = this.comment;
    review.rating = this.rating;
    this.userService.saveReview(review).subscribe(
      result => {
        console.log(result);
        reviewNewArrayElement.idReview = result;
        reviewNewArrayElement.mail = review.mail;
        reviewNewArrayElement.comment = review.comment;
        reviewNewArrayElement.rating = review.rating;
        reviewNewArrayElement.date = new Date().toDateString();
        reviewNewArrayElement.username = this.userService.currentUser.name;
        // reviewNewArrayElement.userType = 'Utilizator';
        console.log(reviewNewArrayElement.date);
        this.reviewsDates.splice(0, 0, new Date(reviewNewArrayElement.date));
      }
    );
    this.userService.userReviewedEvent = true;
    this.userService.eventDetails.avgEventReview = (this.userService.eventDetails.avgEventReview + review.rating)
                                              / (this.userService.reviews.length + 1);
    this.userService.reviews.splice(0, 0, reviewNewArrayElement);
    this.rating = null;
    this.comment = null;
  }

  editUserReview(review: ReviewDtoRequest) {
    // this.editReview = true;
    review.editReview = true;
    this.reviewChanges = review;
  }

  deleteUserReview(review: ReviewDtoRequest) {
    const index = this.userService.reviews.indexOf(review);
    this.userService.reviews.splice(index, 1);
    this.userService.deleteReview(review.idReview).subscribe(
      result => {
        console.log(result);
        this.snackBar.open('Recenzia a fost ștearsă!', 'Ok', {duration: 5000});
        this.userService.userReviewedEvent = false;
      }
    );
    let sum = 0;
    this.userService.reviews.forEach(
      review2 => {
        sum += review2.rating;
      }
    );
    this.userService.eventDetails.avgEventReview = sum / this.userService.reviews.length;
    this.rating = null;
    this.comment = null;
  }

  editUserReviewSave(review: ReviewDtoRequest) {
    const index = this.userService.reviews.indexOf(review);
    this.userService.reviews[index].comment = this.reviewChanges.comment;
    this.userService.reviews[index].rating = this.reviewChanges.rating;
    const reviewResponse = new ReviewDtoResponse();
    reviewResponse.idReview = this.reviewChanges.idReview;
    reviewResponse.rating = this.reviewChanges.rating;
    reviewResponse.comment = this.reviewChanges.comment;
    reviewResponse.like = this.reviewChanges.like;
    console.log(reviewResponse.idReview);
    this.userService.editReview(reviewResponse).subscribe(
      response => {
        console.log(response);
        this.snackBar.open('Modificările au fost salvate!', 'Ok', {duration: 5000});
      }
    );
    // this.editReview = false;
    review.editReview = false;
    let sum = 0;
    this.userService.reviews.forEach(
      review2 => {
        sum += review2.rating;
      }
    );
    this.userService.eventDetails.avgEventReview = sum / this.userService.reviews.length;
  }

  editReviewCancel(review: ReviewDtoRequest) {
    // this.reviewChanges = review;
    review.editReview = false;
    this.editReview = false;
  }

  calendarRedirect() {
    if (!this.userService.currentUser.accessToken) {
      this.snackBar.open('Intră în cont pentru a face o programare!', 'Ok', {duration: 5000});
      return;
    }
    this.userService.eventDetailsCalendar = this.userService.eventDetails;
    this.userService.userCalendar = false;
    this.router.navigateByUrl('/calendar');
  }
}

