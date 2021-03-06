import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private loginservice: AuthenticationService
  ) { }

  username: string = '';
  password: string = '';
  errorMessage = 'Datos invalidos';
  invalidLogin = false;

  ngOnInit() {
  }

  // Click iniciar sesión
  checkLogin() {
    this.loginservice.authenticate(this.username, this.password).subscribe((result) => {
      this.invalidLogin = false;
      //Redireccionar a home
      this.router.navigate(['home']);
    }, () => {
      //Mostrar mensaje de error al usuario
      this.invalidLogin = true;
    });
  }

}
