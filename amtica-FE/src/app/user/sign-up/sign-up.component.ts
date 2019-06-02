import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MyErrorStateMatcher } from './errorStateMatcher';
import { AppComponent } from 'src/app/app.component';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/api/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent extends AppComponent implements OnInit {
  private _signUpGroup = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/) ]),
    firstName : new FormControl('', [Validators.required]),
    lastName : new FormControl(),
    password : new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword : new FormControl('', [Validators.required,this.unMatchPassword])
  })
  private _matcher = new MyErrorStateMatcher();
  constructor(private _toastr: ToastrService,private _userService: UserService, private _router: Router) { 
    super();
  }

  ngOnInit() {
    this.reverseCheckUnMatchPassword();
    this.checkIfUserLoggedIn();
  }

  private checkIfUserLoggedIn(){
    this._userService.loginStatusApi()
    .subscribe((apiResponse)=>{
      if (apiResponse.status === 200) {
        this._router.navigate(["/login"])
      }
    },(error)=>{
      console.log(error)
      this._toastr.error(error.message);
    })
  }

  private unMatchPassword(ac: AbstractControl){
    let password = ac.root.get('password')
    let confirmPassword = ac.value;
    if(password && confirmPassword === password.value){
      return null;
    } else {
      return { unMatchPassword : true };
    }
  }

  private reverseCheckUnMatchPassword():any{
    this._signUpGroup.get('password')
    .valueChanges
    .subscribe((value)=>{
      let confirmPassword = this._signUpGroup.get('confirmPassword');
      if(value && confirmPassword.value && value === confirmPassword.value){
      confirmPassword.setErrors(null);
      } else {
        confirmPassword.setErrors({unMatchPassword:true});
      }
    })
  }

  private signUp():void{
    this._signUpGroup.setErrors({errors:true});
    let suffixText = "is invalid";
    let data={
      email : this._signUpGroup.get('email').value.toLowerCase(),
      firstName: this._signUpGroup.get('firstName').value,
      lastName : this._signUpGroup.get('lastName').value || '',
      password : this._signUpGroup.get('password').value
    }

    if(this._signUpGroup.get('email').invalid){
      this._toastr.error(`Email ${suffixText}`)
    } else if(this._signUpGroup.get('firstName').invalid){
      this._toastr.error(`First Name ${suffixText}`)
    } else if(this._signUpGroup.get('password').invalid){
      this._toastr.error(`Password ${suffixText}`)
    } else if(data.password !== this._signUpGroup.get('confirmPassword').value){
      this._toastr.error(`Passwords do not match`)
    } else{
      this._userService.signupApi(data)
      .subscribe((apiResponse)=>{
        if(apiResponse.status === 200){
          data['activateUserToken'] = apiResponse.data.activateUserToken
          this._toastr.success("Account created successfully")
          setTimeout(()=>{
            this._router.navigate(['/'])
          },1000)
        } else {
          this._toastr.warning(apiResponse.message)
        }
        this._signUpGroup.setErrors(null);
      },(err)=>{
        console.log(err)
        this._toastr.error(err.message);
        this._signUpGroup.setErrors(null);
      })
    }
  }

}
