import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { MatDialog } from '@angular/material';
import { HomeComponent } from '../home/home.component';
import { UserService } from 'src/app/api/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent extends AppComponent implements OnInit {
  private _loginGroup = new FormGroup({
    email : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required]),
  })
  constructor(private _matDialog: MatDialog, private _toastr: ToastrService, private _userService:UserService) { 
    super();
  }

  ngOnInit() {
  }

  private signIn():any{
    this._loginGroup.setErrors({errors:true});
    let data = {
      email: this._loginGroup.get('email').value,
      password: this._loginGroup.get('password').value
    }
    this._userService.loginApi(data)
    .subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this._matDialog.open(HomeComponent)
      } else {
        this._toastr.warning(apiResponse.message)
      }
      this._loginGroup.setErrors(null);
    }, (err) => {
      console.log(err)
      this._toastr.error(err.message);
      this._loginGroup.setErrors(null);
    })
  }

}
