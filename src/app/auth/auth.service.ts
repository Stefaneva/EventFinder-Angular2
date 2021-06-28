import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthService {

  data: Object;
  private _BASE_URL = 'https://localhost:8080';
  // private _BASE_URL = 'https://event-finder-token-manager.herokuapp.com';

  constructor(private http: HttpClient) { }

  register(data: Object) {
    console.log(data);
    return this.http.post(this._BASE_URL + '/api/signup', data);
  }

  login(Email: string, Password: string) {
    const headerPost = new HttpHeaders({'Content-Type': 'application/json'});
    const data = JSON.stringify({email: Email, password: Password});

    return this.http.post(this._BASE_URL + '/api/login', data, {headers: headerPost});
  }

}
