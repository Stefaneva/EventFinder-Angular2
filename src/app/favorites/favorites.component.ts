import { Component, OnInit } from '@angular/core';
// import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

import { EventDto } from '../event/eventDto';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  private readonly imageType: string = 'data:image/PNG;base64,';

  constructor(public userService: UserService,
              private spinnerService: NgxSpinnerService,
              private router: Router,
              private dialog: MatDialog,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userService.getFavoriteEvents().subscribe(
      response => {
        this.userService.favoriteEvents = response;
        this.userService.favoriteEvents.forEach( event => event.image = this.imageType + event.image);
        console.log(response);
      }
    );
  }

  viewEventDetails(event: EventDto) {
    this.userService.eventDetails = event;
    this.router.navigate(['/EventDetails', event.id]);
  }

  // deleteEvent(event: EventDto) {
  //   const index = this.userService.favoriteEvents.indexOf(event);
  //   this.userService.favoriteEvents.splice(index, 1);
  //   this.userService.deleteFavoriteEvent(event.id).subscribe(
  //     result => this.snackBar.open('Anunțul a fost șters!', 'OK', {duration: 5000})
  //   );
  // }

}
