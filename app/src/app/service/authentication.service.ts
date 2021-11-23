import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Observable } from 'rxjs';

export interface Login {
  id: number,
  accessToken: string,
  username: string,
  roles: string[]
}

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  public rol: string
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  protected token: string = ''

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string) {
    return this.http.post<Login>(environment.hostUrl + `/auth/signin`,{ username, password },
    {headers: this.httpHeaders})
    .pipe(tap((res) => {
      let roles = this.isAdminRole(res.roles) ? 'ROLE_ADMIN' : 'ROLE_USER'
      this.rol = roles
      this.token = res.accessToken;
      sessionStorage.setItem('rol', this.rol);
      sessionStorage.setItem('token', res.accessToken);
    }));
  }

  isAdminRole(roles: string[]): boolean {
    let result = false
    roles.forEach(item => {
      if (item === 'ROLE_ADMIN') result = true
    })
    return result
  }

  isUserAdmin(): boolean {
    let user = sessionStorage.getItem('rol')
    return (user === 'ROLE_ADMIN' && this.isUserLoggedIn())
  }

  checkEmail(email: string): Observable<User> {
    return this.http.get<User>(environment.hostUrl + '/forgot_password/' + email, {headers: this.httpHeaders})
  }

  resetPassword(id: number, password: string): Observable<User> {
    return this.http.put<User>(environment.hostUrl + '/auth/reset_password/' + id, password, {headers: this.httpHeaders})
  }

  createBasicAuthToken(){
    return 'Bearer ' + sessionStorage.getItem('token');
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('token')
    return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('token')
  }
}
