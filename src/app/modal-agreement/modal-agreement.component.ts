import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';

@Component({
  selector: 'app-modal-agreement',
  templateUrl: './modal-agreement.component.html',
  styleUrls: ['./modal-agreement.component.css']
})
export class ModalAgreementComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  confirmDelete() {
    this.userService.closeDialog.emit(true);
    if (this.userService.eventDeletedOwner) {
      const index = this.userService.myUserEvents.indexOf(this.userService.eventDeletedOwner);
      this.userService.myUserEvents.splice(index, 1);
      this.userService.deleteEvent(this.userService.eventDeletedOwner.id).subscribe(
        result => {
          console.log(result);
        }
      );
    } else {
      const index = this.userService.events.indexOf(this.userService.eventDeletedAdmin);
      this.userService.events.splice(index, 1);
      this.userService.deleteEvent(this.userService.eventDeletedAdmin.id).subscribe(
        result => {
          console.log(result);
        }
      );
    }
  }

  closeModal() {
    this.userService.closeDialog.emit(true);
  }
}
