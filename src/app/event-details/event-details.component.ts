import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EventDto} from '../event/eventDto';
import {MapsAPILoader} from '@agm/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
// import { saveAs } from 'file-saver';
import {DomSanitizer} from '@angular/platform-browser';
import {FavoriteDto} from '../models/favoriteDto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReviewDtoRequest} from '../models/reviewDtoRequest';
import {ReviewDtoResponse} from '../models/reviewDtoResponse';
import { MatCarouselSlide, MatCarouselSlideComponent } from '@ngbmodule/material-carousel';
import { SlideImage } from '../models/SlideImage';
import { SliderCustomImageComponent } from 'ng-image-slider/lib/slider-custom-image/slider-custom-image.component';
import { OwlOptions } from 'ngx-owl-carousel-2';
import * as moment from 'moment';
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';
import { CalendarEventDto } from '../models/calendarEvent';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})

export class EventDetailsComponent implements OnInit {

  images: string[] = [];
  imgBase64: string[] = [];
  imageObject: Array<object> = [];
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
  slicedDate: string;
  changeLocation = false;
  saveLocation = false;
  changeEventLink = false;
  saveLink = false;
  cancelLocationChange = false;
  cancelLinkChange = false;
  newLocation: FormGroup;
  newLink: FormGroup;
  hidden = true;
  hiddenNewLink = true;
  // adUserPhone: number;
  eventDto: EventDto = new EventDto();
  myFiles: File [] = [];
  reviews: ReviewDtoRequest[] = [];
  rating = 0;
  comment: string;
  reviewsDates: Date[] = [];
  editReview = false;
  reviewChanges: ReviewDtoRequest;
  userReviewedAd: boolean;
  //map
  map: google.maps.Map;
  mapClickListener: google.maps.MapsEventListener;
  // Carousel Options:
  customOptions: OwlOptions = {
    loop: true,
    items: 1,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
        0: {
            items: 1,
        },
        400: {
            items: 2,
        },
        740: {
            items: 3,
        },
        940: {
            items: 4,
        },
    },
    nav: true,
  };

  @ViewChild('search')
  searchElementRef: ElementRef;

  @ViewChild('linkEvent')
  linkEventElementRef: ElementRef;

  @ViewChild('slideshow')
  slideshow: any;

  constructor(public userService: UserService,
              private ngZone: NgZone,
              private mapsAPILoader: MapsAPILoader,
              private route: ActivatedRoute,
              public domSanitizer: DomSanitizer,
              public snackBar: MatSnackBar,
              private router: Router,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.userService.userReviewedEvent = false;
    this.userService.isFavourite = false;
    this.userService.isBooked = false;
    this.userService.eventDetails = new EventDto();
    this.route.params.subscribe( params => {
      this.eventId = parseInt(params['id'], 10);
      // this.userService.eventDetails.id = parseInt(this.adId, 10);
    } );
    this.userService.getEventInfo(this.eventId).subscribe(
      response1 => {
        console.log(response1);
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
        this.eventDetailsChanges.seatsOccupied = response1.seatsOccupied;
        this.eventDetailsChanges.eventDate = response1.eventDate;
        this.slicedDate = this.eventDetailsChanges.eventDate.slice(0, -5);
        this.eventDetailsChanges.userEmail = response1.userDetails.mail;
        this.eventDetailsChanges.avgEventReview = response1.avgEventReview;
        this.eventDetailsChanges.duration = response1.duration;
        this.userService.eventDetails.id = response1.id;
        this.userService.eventDetails.title = response1.title;
        this.userService.eventDetails.description = response1.description;
        this.userService.eventDetails.feeType = response1.feeType;
        this.userService.eventDetails.eventType = response1.eventType;
        this.userService.eventDetails.category = response1.category;
        this.userService.eventDetails.seatsTotal = response1.seatsTotal;
        this.userService.eventDetails.seatsOccupied = response1.seatsOccupied;
        this.userService.eventDetails.price = response1.price;
        this.userService.eventDetails.lat = response1.lat;
        this.userService.eventDetails.lng = response1.lng;
        this.userService.eventDetails.eventDate = response1.eventDate;
        this.userService.eventDetails.eventDate = this.userService.eventDetails.eventDate.slice(0, -5);
        this.userService.eventDetails.userEmail = response1.userDetails.mail;
        this.userService.eventDetails.avgEventReview = response1.avgEventReview;
        this.userService.eventDetails.duration = response1.duration;
        if (this.userService.eventDetails.avgEventReview === undefined) {
          this.userService.eventDetails.avgEventReview = 0;
        }
        this.userService.eventDetails.eventLink = response1.eventLink;
        if (this.userService.eventDetails.eventLink) {
          this.changeEventLink = false;
          this.changeLocation = true;
        }
        else {
          this.changeEventLink = true;
          this.changeLocation = false;
        }
        

        console.log(this.userService.eventDetails.eventLink);
        this.userService.eventUserPhone = response1.userDetails.phone;
        this.lat = this.userService.eventDetails.lat;
        this.lng = this.userService.eventDetails.lng;
        console.log(this.userService.eventDetails.id);
        console.log(response1.eventLink);
        console.log(this.userService.eventDetails.eventLink);
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
        // Book Button Check
        if (this.userService.bookedEvents.length > 0) {
          this.userService.bookedEvents.forEach(
            bookedEvent => {
              console.log("this.userService.isBooked is: " + this.userService.isBooked)
              console.log(bookedEvent.userEmail);
              if (bookedEvent.eventId === this.userService.eventDetails.id) {
                this.userService.isBooked = true;
              }
            }
          )
        }

        console.log("User reviewed event is: " + this.userService.userReviewedEvent);

          // Location
        this.mapsAPILoader.load().then(() => {
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
        })

        this.userService.getEventImages(this.eventId).subscribe(
          (response) => {
            this.images = response;
            this.imgBase64 = response;
            this.eventDetailsChanges.image = this.images[0];
            for (let i = 0; i < this.images.length; i++) {
              this.images[i] = this.imageType + this.images[i];
              var slideImage = new SlideImage();
              slideImage.image = this.images[i];
              this.imageObject.push(slideImage);
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
              console.log(review);
              this.reviewsDates[i++] = new Date(review.date);
            }
          );
          if (this.userService.reviews.length > 0 &&
            this.userService.currentUser !== undefined &&
            this.userService.currentUser !== null) {
                
            for (const review1 of this.userService.reviews) {
              if (review1.mail === this.userService.currentUser.email) {
                this.userService.userReviewedEvent = true;
                console.log("this.userService.userReviewedEvent is: " + this.userService.userReviewedEvent)
                return;
              }
            }
          }
        }
    );

    console.log("The booked event is: " + this.userService.isBooked);
    console.log("The favorite event is: " + this.userService.isFavourite);

    // // All appointments
    // this.userService.getBookedEvents(this.eventId).subscribe(
    //   responseUserBookedEvents => {
    //     console.log(responseUserBookedEvents);
    //     this.userService.bookedEvents = responseUserBookedEvents;
    //     console.log(this.userService.bookedEvents);

    //     if (this.userService.bookedEvents.length > 0 &&
    //         this.userService.currentUser !== undefined &&
    //         this.userService.currentUser !== null) {
            
    //           if (this.userService.bookedEvents.length > 0) {
    //             this.userService.bookedEvents.forEach(
    //               bookedEvent => {
    //                 console.log("this.userService.isBooked is: " + this.userService.isBooked)
    //                 console.log(bookedEvent.userEmail);
    //                 if (bookedEvent.userEmail === this.userService.currentUser.email) {
    //                   this.userService.isBooked = true;
    //                 }
    //               }
    //             )
    //           }
    //         }
    //       }
    // );

    this.newLocation = new FormGroup({
      'searchControl' : new FormControl(null)
    });
    this.newLink = new FormGroup({
      'newLinkControl' : new FormControl(null)
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
          // this.changeLocation = true;
          // this.changeEventLink = true;
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
    this.userService.updateEventInfo(this.eventDetailsChanges).subscribe(
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
      // this.eventDetailsChanges.lat = this.lat;
      // this.eventDetailsChanges.lng = this.lng;
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

  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.ngZone.run(() => {
        // Here we can get correct event
        console.log(e.latLng.lat(), e.latLng.lng());
        console.log(this.changeLocation + " " + this.changeEventLink);
        this.lat = e.latLng.lat();
        this.lng = e.latLng.lng();
        this.eventDetailsChanges.lat = this.lat;
        this.eventDetailsChanges.lng = this.lng;
      });
    });
  }

  changeTheLocation() {
    this.cancelLocationChange = true;
    this.saveLocation = true;
    this.changeLocation = true;
    this.hidden = false;
  }

  changeTheLink() {
    this.cancelLinkChange = true;
    this.changeEventLink = true;
    this.saveLink = true;
    this.hiddenNewLink = false;
  }

  cancelLocationChanges() {
    this.lat = this.eventDetailsChanges.lat;
    this.lng = this.eventDetailsChanges.lng;
    this.cancelLocationChange = false;
    this.saveLocation = false;
    this.changeLocation = false;
    this.hidden = false;
    this.newLocation.get('searchControl').setValue(null);
  }

  cancelLinkChanges() {
    this.cancelLinkChange = false;
    this.saveLink = false;
    this.changeEventLink = false;
    this.hiddenNewLink = false;
    this.newLink.get('newLinkControl').setValue(null);
  }

  saveLocationChanges() {
    console.log(this.address);
    this.changeLocation = false;
    this.cancelLocationChange = false;
    this.saveLocation = false;
    this.hidden = true;
    this.newLocation.get('searchControl').setValue(null);
    this.userService.eventDetails = this.eventDetailsChanges;
    this.eventDetailsChanges.location = this.address;

    this.userService.updateEventInfo(this.eventDetailsChanges).subscribe(
      response => {
        console.log(response);
      }
    );
  }

  saveNewLinkChanges() {
    this.changeEventLink = false;
    this.cancelLinkChange = false;
    this.saveLink = false;
    this.hiddenNewLink = true;
    console.log("Sending to BE the new link " +this.newLink.get('newLinkControl').value);
    this.eventDetailsChanges.eventLink = this.newLink.get('newLinkControl').value;
    this.newLink.get('newLinkControl').setValue(null);
    this.userService.eventDetails = this.eventDetailsChanges;

    this.userService.updateEventInfo(this.eventDetailsChanges).subscribe(
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
    const input = document.getElementById('fileInput');
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
          this.snackBar.open('The Event has been added to Favorites!', 'OK', {duration: 5000});
          this.userService.getFavoriteEvents().subscribe(
            result => {
              this.userService.favoriteEvents = result;
              this.userService.favoriteEvents.forEach( event => event.image = this.imageType + event.image);
            }
          );
        }
      );
    } else {
      this.snackBar.open('Login to save the event in Favorites!', 'OK', {duration: 5000});
    }
  }

  googleMapsDirection() {
    const url: string = 'http://maps.google.com/maps?q=' + this.lat + ',' + this.lng;
    window.open(url);
  }

  addReview() {
    if (!this.userService.currentUser.accessToken) {
      this.snackBar.open('Please login in your account to add a review!', 'Ok', {duration: 5000});
      return;
    }
    if (this.userService.userReviewedEvent) {
      this.snackBar.open('You have already added a review!', 'Ok', {duration: 5000});
      return;
    }
    if (!this.comment || !this.rating) {
      this.snackBar.open('Please add both a star and a rating for a review!', 'Ok', {duration: 5000});
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
    this.editReview = true;
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
        this.snackBar.open('Review edited with success!', 'Ok', {duration: 5000});
      }
    );
    // this.editReview = false;
    // review.editReview = false;
    let sum = 0;
    this.userService.reviews.forEach(
      review2 => {
        sum += review2.rating;
      }
    );
    this.userService.eventDetails.avgEventReview = sum / this.userService.reviews.length;
    review.editReview = false;
    this.editReview = false;
  }

  editReviewCancel(review: ReviewDtoRequest) {
    // this.reviewChanges = review;
    review.editReview = false;
    this.editReview = false;
  }

  // TO:DO Change to a bookmark logic
  bookSeat() {
    if (!this.userService.currentUser.accessToken) {
      this.snackBar.open('Login into your account to book a seat!', 'Ok', {duration: 5000});
      return;
    }
        // 2) Compare the events with the current one, if good ok else show message
        // 3) If ok save appointment and TotalSeats -= 1 for this event
        // 4) Redirect
        
        var startDate = this.userService.eventDetails.eventDate;
        var endDate = moment(this.userService.eventDetails.eventDate).add(this.userService.eventDetails.duration, 'hours')
                                                                      .format("YYYY-MM-DD HH:mm");
    
        var canBeBooked = true;
        console.log(canBeBooked);
        console.log(this.userService.bookedEvents);
        this.userService.bookedEvents.forEach(event => {
            console.log(canBeBooked);
            console.log("Comparisons: ");
            console.log(moment(startDate).isAfter(event.startDate));
            console.log(moment(startDate).isBefore(event.endDate));
            console.log(moment(endDate).isAfter(event.startDate));
            console.log(moment(endDate).isBefore(event.endDate));
            console.log("End of comparisons: ")

            if ((moment(startDate).isAfter(event.startDate) && moment(startDate).isBefore(event.endDate)) ||
                (moment(endDate).isAfter(event.startDate) && moment(endDate).isBefore(event.endDate))) {
                  canBeBooked = false;
            }
          }
        )
        console.log(canBeBooked);

        if (!canBeBooked) {
          this.snackBar.open('The Event can not be booked due to conflicting schedules! Please check your calendar!', 'OK', {duration: 10000});
        }

        else {
          var calendarAppointmentDto = new CalendarEventDto();
          calendarAppointmentDto.message = this.userService.eventDetails.title;
          calendarAppointmentDto.userEmail = this.userService.currentUser.email;
          calendarAppointmentDto.eventId = this.userService.eventDetails.id;
          calendarAppointmentDto.startDate = startDate;
          calendarAppointmentDto.endDate = endDate;
          
          console.log(calendarAppointmentDto);
          this.spinner.show();
          this.userService.bookEvent(calendarAppointmentDto).subscribe(
            responseBookEvent => {
              console.log(responseBookEvent);
              this.spinner.hide();
              this.userService.eventDetailsCalendar = this.userService.eventDetails;
              this.userService.userCalendar = false;
              this.router.navigateByUrl('/calendar');
            }
          )
        }
  }

  reviewDate() {
    return moment().isAfter(this.userService.eventDetails.eventDate);
  }

  private static urlValidator({value}: AbstractControl): null | ValidationErrors {
    try {
       new URL(value);
       return null;
    } catch {
       return {pattern: true};
    }
  }
}

