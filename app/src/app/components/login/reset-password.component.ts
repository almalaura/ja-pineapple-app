import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import Swal from 'sweetalert2';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./login.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup
  id$: Observable<number>
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    protected fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['', Validators.compose([
        Validators.required
      ])],
      confirmPassword: ['', Validators.compose([
        Validators.required
      ])]
    }, { validators: this.checkPasswords })
    this.id$ = this.route.queryParams.pipe(
      map(params => params.id)
    )
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

  resetPassword(id: number): void {
    if (this.form.valid) {
      this.authService.resetPassword(id, this.form.get('confirmPassword')?.value).subscribe(
        (_) => {
          Swal.fire('Contraseña restablecidad con exito')
          this.router.navigate(['/login'])
        }
      )
    }
  }

}
