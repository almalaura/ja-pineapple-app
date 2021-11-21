import { Component, OnInit } from '@angular/core';
import { faTrashAlt, faPen, faPlus} from '@fortawesome/free-solid-svg-icons';
import {DecimalPipe} from '@angular/common';
import { QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';

import {User} from '../../models/user';
import {UserService} from './user.service';
import {NgbdSortableHeaderUser, SortEvent} from '../../directives/sortableUser.directive';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  providers: [UserService, DecimalPipe],
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  faPen = faPen;
  faPlus = faPlus;
  faTrashAlt = faTrashAlt;
  users: User[] = [];
  users$: Observable<User[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeaderUser) headers: QueryList<NgbdSortableHeaderUser>;

  constructor(public service: UserService) {
    this.users$ = service.users$;
    this.total$ = service.total$;
    this.headers = new QueryList();
  }

  ngOnInit(): void {
    this.service.getUsers().subscribe(
      users => this.users = users
    );
  }

  delete(user: User): void {
    console.log("eliminar");
    /*SweetAlert2Module({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al user ${user.nombre} ${user.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.userservice.delete(user.id).subscribe(
          response => {
            this.users = this.users.filter(prod  => prod  !== user)
            SweetAlert2Module(
              'Usuario Eliminado!',
              `Usuario ${user.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    })*/
  }

  onSort({column, direction}: SortEvent) {
      // resetting other headers
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });

      this.service.sortColumn = column;
      this.service.sortDirection = direction;
    }

}
