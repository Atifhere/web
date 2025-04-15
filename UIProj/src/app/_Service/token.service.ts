import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  Logout()
  {
    localStorage.clear();
  }

  Login(token: string, username: string, userRole: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', username);
    localStorage.setItem('userRole', userRole);
  }
}
