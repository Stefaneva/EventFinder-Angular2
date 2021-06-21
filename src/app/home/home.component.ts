import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {UserService} from '../user.service';
// import {AdDto} from '../add/adDto';
// import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {Router} from '@angular/router';
import {MapsAPILoader} from '@agm/core';
// import {ModalAgreementComponent} from '../modal-agreement/modal-agreement.component';
import {MatDialog} from '@angular/material/dialog';
import {SnotifyService} from 'ng-snotify';
import { from } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventDto } from '../event/eventDto';
import { ModalAgreementComponent } from '../modal-agreement/modal-agreement.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private readonly imageType: string = 'data:image/PNG;base64,';
  public image: any = [];
  places: string[] = [];

  constructor(private authService: AuthService,
              private mapsAPILoader: MapsAPILoader,
              public userService: UserService,
              private spinnerService: NgxSpinnerService,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.mapsAPILoader.load();
    this.spinnerService.show();
    this.userService.getEvents().subscribe(
      (response) => {
        console.log(response);
        this.userService.events = response;
        this.userService.events.forEach(
          event => {
            event.image = this.imageType + event.image;
            event.eventDate = event.eventDate.slice(0,-5);
          });
        // const geocoder = new google.maps.Geocoder();
        // for (let i = 0; i < this.userService.ads.length; i++) {
        //   const latlng = new google.maps.LatLng(this.userService.ads[i].lat, this.userService.ads[i].lng);
        //   const request = {
        //     location: latlng
        //   };
        //   geocoder.geocode(request, (results, status) => {
        //     if (status === google.maps.GeocoderStatus.OK) {
        //       if (results[0] != null) {
        //         this.userService.ads[i].locationPlace = results[0].formatted_address;
        //         console.log(this.userService.ads[i].locationPlace);
        //       } else {
        //         console.log('1');
        //       }
        //     } else {
        //       console.log(this.userService.ads[i].title + ' ' +
        //       this.userService.ads[i].locationPlace + ' ' + this.userService.ads[i].id);
        //     }
        //   });
        // }
        this.spinnerService.hide();
        // this.userService.snotifyService.success('Body content', { position: 'rightTop'});
      }
    );
  }

  viewEventDetails(event: EventDto) {
    this.userService.eventDetails = event;
    const url = '/EventDetails/' + event.id;
    // this.router.navigateByUrl('/AdDetails');
    this.router.navigate(['/EventDetails', event.id]);
  }

  deleteEvent(event: EventDto) {
    this.userService.eventDeletedOwner = event;
    this.userService.closeDialog.subscribe(
      result => this.dialog.closeAll());
    const dialogRef = this.dialog.open(ModalAgreementComponent, {});
      const index = this.userService.events.indexOf(event);
      this.userService.deleteEvent(event.id).subscribe(
        result => {
          console.log(result);
          this.userService.events.splice(index, 1);
        }
      );
    }
}
