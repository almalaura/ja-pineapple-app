import { Component, OnInit } from '@angular/core'
import {User} from '../../models/user'
import {UserService} from './user.service'
import {Router, ActivatedRoute} from '@angular/router'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {DecimalPipe} from '@angular/common';
@Component({
  selector: 'app-form-user',
  providers: [UserService, DecimalPipe],
  templateUrl: './form-user.component.html'
})

export class FormUserComponent implements OnInit {
switchRol:boolean = false;
  title:string = "CREAR NUEVO USUARIO";
  user: User = {
    id: 0,
    name: '',
    surname: '',
    username: '',
    password: '',
    email: '',
    roles: '',
    created_at: ''
  }


  constructor(private userService: UserService,
  private router: Router,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit():void {
    this.cargarUser()
  }
  //Cargar los datos del usuario si la acción es actualizar
  cargarUser(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.userService.getUser(id).subscribe( (user) => this.user = user)
      }
    })
  }
  //Evento para cambiar el valor del checkbox
  changed = (event:any) => {
    console.log(event.currentTarget.checked)
    this.switchRol = event.currentTarget.checked;
  }
  //Crea un nuevo usuario
  create(): void {
    //asigar valor a roles por la interfaz del checkbox
    console.log(this.switchRol);
    if (this.switchRol === true) {
      this.user.roles = 'admin';
    }
    console.log(this.user)
    this.userService.create(this.user)
      .subscribe((user) => {
        let usercreated = user;
        console.log("user"+usercreated);
        this.router.navigate(['/users'])
        Swal.fire('Nuevo user', `Usuario creado con éxito!`, 'success')
      },
      (error) =>{
        console.log("error"+error)
        throw error;
      }
    );
  }
  //Actualiza los datos del usuario
  update():void{
    this.userService.update(this.user)
    .subscribe( user => {
      this.router.navigate(['/users'])
      Swal.fire('Usuario Actualizado', `Usuario actualizado con éxito!`, 'success')
    }

    )
  }
}
