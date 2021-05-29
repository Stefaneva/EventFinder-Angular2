import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {UserDataDto} from '../models/userDataDto';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: UserDataDto[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  blockUser(user: UserDataDto) {
    user.enabled = false;
    this.userService.updateUserAccess(user).subscribe(
      result => console.log(result)
    );
  }

  unblockUser(user: UserDataDto) {
    user.enabled = true;
    this.userService.updateUserAccess(user).subscribe(
      result => console.log(result)
    );
  }
}
