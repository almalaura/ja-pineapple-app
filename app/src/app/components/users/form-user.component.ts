import { Component, Inject, OnInit } from '@angular/core'
import {User} from '../../models/user'
import {UserService} from './user.service'
import {Router, ActivatedRoute} from '@angular/router'
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

  switchRol: boolean = false;

  formUser: FormGroup

  constructor(
    private userService: UserService,
    private readonly fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<FormUserComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User) { }

  ngOnInit():void {
    this.initForm();
    if (this.user) {
      this.patchForm(this.user)
    }
  }

  //Crea un nuevo usuario
  create(): void {
    if (this.formUser.valid) {
      const finalUser = {
        ...this.formUser.value,
        roles: this.switchRol ? 'user' : 'admin'
      }
      this.userService.create(finalUser).subscribe()
      this.onNoClick()
    }
  }
  
  //Actualiza los datos del usuario
  update(): void {
    if (this.formUser.valid) {
      const finalUser = {
        ...this.formUser.value,
        roles: this.switchRol ? 'user' : 'admin'
      }
      this.userService.update(finalUser).subscribe()
      this.onNoClick()
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
      roles: 'user'
    });
  }

  patchForm(registro: User): void {
    this.formUser.patchValue({
      ...registro,
    });
  }
}
