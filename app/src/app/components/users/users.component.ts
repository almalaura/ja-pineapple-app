import { Component, OnInit, ViewChild } from '@angular/core';
import { faTrashAlt, faPen, faPlus} from '@fortawesome/free-solid-svg-icons';
import {DecimalPipe} from '@angular/common';
import { QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';

import {User} from '../../models/user';
import {UserService} from './user.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormUserComponent } from './form-user.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  providers: [UserService, DecimalPipe],
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['username', 'email', 'name', 'surname', 'roles', 'created_at', 'actions'];
  users$: Observable<User[]> = this.service.getUsers().pipe(
    tap((data) => {
      this.dataSource = new MatTableDataSource(data);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    })
  );

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    public service: UserService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {

  }

  applyFilter(event: any): void {
    const filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filter;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDownloadExcel(): void {
    //this.areasService.downloadExcel(this.selection.selected);
  }

  createDialog() {
    const dialogRef = this.dialog.open(FormUserComponent, {
      width: '40%',
      data: null,
    });

    dialogRef.afterClosed().subscribe( (result: FormGroup) => {
      if (result?.valid) {
        const finalUser = {
          ...result.value,
          roles: result.get('switchRol')?.value ? 'user' : 'admin'
        }
        this.service.create(finalUser).subscribe(
          (reg) => {
            const data = this.dataSource.data;
            data.push(reg);
            this.dataSource.data = data;
          }
        )
      }
    });
  }

  editDialog(user: User) {
    const dialogRef = this.dialog.open(FormUserComponent, {
      width: '40%',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      if (result?.valid) {
        const finalUser = {
          ...result.value,
          roles: result.get('switchRol')?.value ? 'user' : 'admin'
        }
        this.service.update(finalUser).subscribe(
          (reg) => {
            const indexTable = this.dataSource.data.indexOf(user);
            if (indexTable !== -1) {
              const list = this.dataSource.data
              list[indexTable] = reg;
              this.dataSource.data = list
            }
          }
        )
      }
    });
  }

  delete(user: User): void {
    if(user.id) {
      this.service.delete(user.id).subscribe(
        () => {
          this.dataSource.data = this.dataSource.data.filter( item => item.id != user.id)
        }
      )
    }
  }
}
