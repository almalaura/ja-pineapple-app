import { Component, Inject, OnInit } from '@angular/core'
import {User} from '../../models/user'
import {UserService} from './user.service'
import {DecimalPipe} from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-form-user',
  providers: [UserService, DecimalPipe],
  templateUrl: './form-user.component.html'
})

export class FormUserComponent implements OnInit {
  title:string = "CREAR NUEVO USUARIO";

  formUser: FormGroup

  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<FormUserComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User) { }

  ngOnInit():void {
    this.initForm();
    if (this.user) {
      this.patchForm(this.user)
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initForm(): void {
    this.formUser = this.fb.group({
      id: [],
      username: ['', Validators.compose([
          Validators.required,
      ])],
      password: ['', Validators.required],
      email: ['', Validators.compose([
          Validators.required,
          Validators.email
      ])],
      name: ['', Validators.compose([
          Validators.required,
      ])],
      surname: ['', Validators.compose([
          Validators.required,
      ])],
      roles: 'user',
      switchRol: [false]
    });
  }

  patchForm(registro: User): void {
    this.formUser.patchValue({
      ...registro,
    });
  }
}
