import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from '../../directives/sortableUser.directive';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment';

interface SearchResult {
  users: User[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
//Ordenar columnas
function sort(users: User[], column: SortColumn, direction: string): User[] {
  if (direction === '' || column === '') {
    return users;
  } else {
    return [...users].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(User: User, term: string, pipe: PipeTransform) {
  return User.name.toLowerCase().includes(term.toLowerCase())
}

@Injectable({providedIn: 'root'})
export class UserService {
  private urlEndPoint: string = '/users';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
  //variable para almacenar todos los usuarios
  usuarios: User[] = [];
  //Variables para filter, search y pagination de la tabla
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _users$ = new BehaviorSubject<User[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private http: HttpClient,private pipe: DecimalPipe) {
    this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._users$.next(result.users);
        this._total$.next(result.total);
      });

      this._search$.next();
    }
  //Obtener todos los datos de usuarios
  getUsers(): Observable<User[]> {
    return this.http.get(environment.hostUrl+this.urlEndPoint).pipe(
      map(response => response as User[])
    );
  }
  //Crear un usuario
  create(user: User) : Observable<User> {
    return this.http.post<User>(`${environment.hostUrl}/auth/signup`, user, {headers: this.httpHeaders})
  }
  //Obtener la información del usuario
  getUser(id: string): Observable<User>{
    return this.http.get<User>(`${environment.hostUrl+this.urlEndPoint}/${id}`)
  }
  //Actualizar los datos del usuario
  update(user: User): Observable<User>{
    return this.http.put<User>(`${environment.hostUrl+this.urlEndPoint}/${user.id}`, user, {headers: this.httpHeaders})
  }
  //Eliminar el registro de un usuario
  delete(id: number): Observable<User>{
    return this.http.delete<User>(`${environment.hostUrl+this.urlEndPoint}/${id}`, {headers: this.httpHeaders})
  }

  get users$() { return this._users$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let users = sort(this.usuarios, sortColumn, sortDirection);

    // 2. filter
    users = users.filter(User => matches(User, searchTerm, this.pipe));
    const total = users.length;

    // 3. paginate
    users = users.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({users, total});
  }

}
