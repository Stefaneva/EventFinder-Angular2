import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserDtoUpdate} from '../models/userDtoUpdate';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  editForm: FormGroup;
  password = '';

  constructor(private authService: AuthService,
              public userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      'password' : new FormControl(null, Validators.required),
      'confirm_password' : new FormControl(null, [Validators.required, this.confirmPassword.bind(this)]),
      'phone' : new FormControl('0' + this.userService.currentUser.phone, [Validators.required, Validators.pattern('[0-9]{10}')]),
    });
  }

  confirmPassword(control: FormGroup): {[s: string]: boolean} {
    if (control.value !== this.password) {
      return {'differentPasswords': false};
    }
    return null;
  }

  keyPress(event: any) {
    this.password = event.target.value;
  }

  onSubmit() {
    const userDtoUpdate = new UserDtoUpdate();
    userDtoUpdate.email = this.userService.currentUser.email;
    userDtoUpdate.password = this.editForm.value.password;
    userDtoUpdate.phoneNumber = this.editForm.value.phone;
    console.log(userDtoUpdate);
    this.userService.updateUserData(userDtoUpdate).subscribe(
      response => console.log(response)
    );
    this.userService.eventUserPhone = parseInt(userDtoUpdate.phoneNumber, 10);
    this.userService.closeDialog.emit(true);
  }

}
