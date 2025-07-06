import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Login } from './login/login';
import { Register } from './register/register';
import { ResetPassword } from './reset-password/reset-password';
import { ForgotPassword } from './forgot-password/forgot-password';
import { VerifyEmail } from './verify-email/verify-email';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'verify-email', component: VerifyEmail },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    Login,
    Register,
    ResetPassword,
    ForgotPassword,
    VerifyEmail
  ]
})
export class AuthModule { }