import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, throwError, Subject} from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError,map } from 'rxjs/operators';
import { User, UserCreate } from '../../models/user';
import { environment } from '../../../environments/environment.prod';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Injectable()
export class UserService {
  private urlEndPoint: string = '/users';
  private httpHeaders: HttpHeaders

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService) {
      this.httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authService.createBasicAuthToken()
      })
  }

  isAdminRole(roles: {id: number, name: string}[]): boolean {
    let result = false
    roles.forEach(item => {
      if (item.name === 'ROLE_ADMIN') result = true
    })
    return result
  }

  //Obtener todos los datos de usuarios
  getUsers(): Observable<User[]>{
    return this.http.get<UserCreate[]>(environment.hostUrl+this.urlEndPoint).pipe(
      map(data => data.map(reg => ({
        ...reg,
        roles: this.isAdminRole(reg.roles) ? 'admin' : 'user'
      })))
    )
  }
  //Crear un usuario
  create(user: User) : Observable<User> {
    const createUser = {
      ...user,
      roles: [user.roles]
    }
    return this.http.post<UserCreate>(`${environment.hostUrl}/auth/signup`, createUser, {headers: this.httpHeaders}).pipe(
        map(reg => ({
          ...reg,
          roles: this.isAdminRole(reg.roles) ? 'admin' : 'user'
        })),
        catchError((err) => {
          console.log('error caught in service')
          return throwError(err);
        })
      )
  }
  //Obtener la información del usuario
  getUser(id: string): Observable<User>{
    return this.http.get<UserCreate>(`${environment.hostUrl+this.urlEndPoint}/${id}`).pipe(
      map(data => ({
        ...data,
        roles: this.isAdminRole(data.roles) ? 'admin' : 'user'
      }))
    )
  }
  //Actualizar los datos del usuario
  update(user: User): Observable<User>{
    const userCreate = {
      ...user,
      roles: [user.roles]
    }
    return this.http.put<UserCreate>(`${environment.hostUrl+this.urlEndPoint}/${user.id}`, userCreate, {headers: this.httpHeaders}).pipe(
      map(data => ({
        ...data,
        roles: this.isAdminRole(data.roles) ? 'admin' : 'user'
      }))
    )
  }
  //Eliminar el registro de un usuario
  delete(id: number): Observable<any>{
    return this.http.delete<any>(`${environment.hostUrl+this.urlEndPoint}/${id}`, {headers: this.httpHeaders})
  }
}
