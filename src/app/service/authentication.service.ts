import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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
  public username: string;
  public rol: string;
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  protected token: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  //Iniciar sesión
  authenticate(username: string, password: string) {
    return this.http.post<Login>(environment.hostUrl + `/auth/signin`,{ username, password },
    {headers: this.httpHeaders})
    .pipe(tap((res) => {
      let roles = this.isAdminRole(res.roles) ? 'ROLE_ADMIN' : 'ROLE_USER'
      this.rol = roles;
      this.username = res.username;
      this.token = res.accessToken;
      sessionStorage.setItem('rol', this.rol);
      sessionStorage.setItem('username', res.username);
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
  //Define los permisos de usuario en las acciones y navegación
  isUserAdmin(): boolean {
    let user = sessionStorage.getItem('rol')
    return (user === 'ROLE_ADMIN' && this.isUserLoggedIn())
  }
  //Recuperar contraseña
  checkEmail(email: string): Observable<User> {
    return this.http.get<User>(environment.hostUrl + '/forgot_password/' + email, {headers: this.httpHeaders})
  }
  //Cambiar la contraseña
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
    sessionStorage.removeItem('rol')
    sessionStorage.removeItem('username')
    this.router.navigate(['login'])
  }
}
