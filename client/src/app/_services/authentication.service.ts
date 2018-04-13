import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import 'rxjs/add/operator/map'

import { environment } from '../../environments/environment';
import { User } from '../_models';

const helper = new JwtHelperService();

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && currentUser.token) {
      return !helper.isTokenExpired(currentUser.token);
    }
    else {
      return false;
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.API_URL}/auth/login`, { email: email, password: password })
      .map(data => {
        // login successful if there's a jwt token in the response
        if (data && data.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({...data.user, token: data.token}));
        }

        return data;
      });
  }

  register(user: User) {
    return this.http.post<any>(`${environment.API_URL}/auth/register`, user)
      .map(data => {
        // login successful if there's a jwt token in the response
        if (data && data.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({...data.user, token: data.token}));
        }

        return data;
      });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}