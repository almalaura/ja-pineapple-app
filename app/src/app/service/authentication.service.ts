import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs/operators';

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

  public username: string = '';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  protected token: string = ''

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string) {
    return this.http.post<Login>(environment.hostUrl + `/auth/signin`,{ username, password },
    {headers: this.httpHeaders})
    .pipe(tap((res) => {
      this.username = res.username;
      this.token = res.accessToken;
      sessionStorage.setItem('token', res.accessToken);
    }));
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
