import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import {Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventDto } from '../event/eventDto';
import { ModalAgreementComponent } from '../modal-agreement/modal-agreement.component';
import { UserService } from '../user.service';


@Component({
  selector: 'app-myEvents',
  templateUrl: './myEvents.component.html',
  styleUrls: ['./myEvents.component.css']
})
export class MyEventsComponent implements OnInit {

  private readonly imageType: string = 'data:image/PNG;base64,';

  constructor(public userService: UserService,
              private spinnerService: NgxSpinnerService,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.spinnerService.show();
    this.userService.getMyUserEvents().subscribe(
      response => {
        this.userService.myUserEvents = response;
        this.userService.myUserEvents.forEach( ad => ad.image = this.imageType + ad.image);
        this.spinnerService.hide();
      }
    );
  }

  viewEventDetails(event: EventDto) {
    this.userService.eventDetails = event;
    this.router.navigate(['/EventDetails', event.id]);
  }

  deleteEvent(event: EventDto) {
    this.userService.eventDeletedOwner = event;
    this.userService.closeDialog.subscribe(
      result => this.dialog.closeAll());
    const dialogRef = this.dialog.open(ModalAgreementComponent, {});
      const index = this.userService.myUserEvents.indexOf(event);
      this.userService.myUserEvents.splice(index, 1);
      this.userService.deleteEvent(event.id).subscribe(
        result => {
          console.log(result);
        }
      );
    }
}
