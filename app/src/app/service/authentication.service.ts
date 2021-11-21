import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  public username: string = '';
  public password: string = '';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string) {
    return this.http.post(environment.hostUrl + `/auth/signin`,{ username, password },
    {headers: this.httpHeaders})
    .pipe(map((res) => {
      this.username = username;
      this.password = password;
      sessionStorage.setItem('username', username);
    }));
  }

  createBasicAuthToken(username: string, password: string){
    return 'Basic ' + window.btoa(username + ":" + password);
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username')
    return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('username')
  }
}
