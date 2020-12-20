import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthService {

  data: Object;
  private _BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  register(data: Object) {
    console.log(data);
    return this.http.post(this._BASE_URL + '/signup', data);
    // return this.http.post(this.local + '/signup', data);
  }

  login(Username: string, Password: string) {
    const headerPost = new HttpHeaders({'Content-Type': 'application/json'});
    const data = JSON.stringify({username: Username, password: Password});

    return this.http.post(this._BASE_URL + '/auth', data, {headers: headerPost});
  }

}
