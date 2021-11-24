import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./login.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])]
    })
  }

  async sendEmail(): Promise<void> {
    if (this.form.valid) {
      await this.authService.checkEmail(this.form.get('email')?.value).toPromise().then(
        (user) => {
          this.router.navigate(['/reset-password'], {
            queryParams: {
              id: user.id
            },
            queryParamsHandling: 'merge',
          })
        }
      ).catch((_) => {
        Swal.fire('Correo no encontrado', 'El correo introducido no existe por favor ingresar el correo con el que se registró')
      })
    }
  }

}
