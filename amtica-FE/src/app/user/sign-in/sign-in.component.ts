import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HomeComponent } from '../home/home.component';
import { UserService } from 'src/app/api/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent extends AppComponent implements OnInit {
  public loginGroup = new FormGroup({
    email : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required]),
  })
  constructor(private _matDialog: MatDialog, private _toastr: ToastrService, private _userService:UserService) { 
    super();
  }

  ngOnInit() {
    this.checkIfUserLoggedIn();
  }

  //  if user is logged in then show the user dialog, else nothing
  // Here we are sending the message "Welcome back"
  private checkIfUserLoggedIn(){
    this._userService.loginStatusApi()
    .subscribe((apiResponse)=>{
      if (apiResponse.status === 200) {
        let data = {
          header: 'Welcome back',
          fullName: this.getFullname(apiResponse.data),
          body: ''
        }
          this.showLoggedInDialog(data);
      }
    },(error)=>{
      console.log(error)
      this._toastr.error(error.message);
    })
  }

  // on success login, we are sending the message "Welcome"
  public signIn():any{
    this.loginGroup.setErrors({errors:true});
    let data = {
      email: this.loginGroup.get('email').value,
      password: this.loginGroup.get('password').value
    }
    this._userService.loginApi(data)
    .subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        let data = {
          header: 'Welcome',
          fullName: this.getFullname(apiResponse.data),
          body: 'You are successfully logged in'
        }
          this.showLoggedInDialog(data);
      } else {
        this._toastr.warning(apiResponse.message)
      }
      this.loginGroup.setErrors(null);
    }, (err) => {
      console.log(err)
      this._toastr.error(err.message);
      this.loginGroup.setErrors(null);
    })
  }

  // settings to show loggedin dialog
  private showLoggedInDialog(data){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '50vw';
    dialogConfig.minHeight = '50vh';
    dialogConfig.maxWidth = '90vw';
    dialogConfig.maxHeight = '90vh';
    dialogConfig.data = data;
    this._matDialog.open(HomeComponent,dialogConfig);
  }

  // function to get full name from data object
  private getFullname(obj){
    let fullname =  obj.firstName + ' ' +obj.lastName;
    return fullname.trim();
  }

}
