import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { userRouterConfig } from './user.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRouterConfig)
  ],
  declarations: [
    SignUpComponent,
    SignInComponent,
    HomeComponent,
  ]
})
export class UserModule { }
