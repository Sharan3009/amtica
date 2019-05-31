import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import{ RouterModule } from '@angular/router';  

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { UserService } from './api/user.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    UserModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
