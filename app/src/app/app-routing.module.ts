import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from './components/products/products.component';
import { FormProductsComponent } from './components/products/form.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { FormUserComponent } from './components/users/form-user.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ResetPasswordComponent } from './components/login/reset-password.component';
import { ForgotPasswordComponent } from './components/login/forgot-password.component';

import { AuthGaurdService } from './service/auth-gaurd.service';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'products', component: ProductsComponent,canActivate:[AuthGaurdService] },
  {path: 'users', component: UsersComponent,canActivate:[AuthGaurdService] },
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent,canActivate:[AuthGaurdService] },
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'user/form', component: FormUserComponent},
  {path: 'user/form/:id', component: FormUserComponent},
  {path: 'products/form', component: FormProductsComponent},
  {path: 'products/form/:id', component: FormProductsComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
