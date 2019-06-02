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
  /* using formGroup to create bunch of formcontrols form. Final validation of all the form controls together
  / is applied on formGroup */
  public signUpGroup = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/) ]),
    firstName : new FormControl('', [Validators.required]),
    lastName : new FormControl(),
    password : new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword : new FormControl('', [Validators.required,this.unMatchPassword])
  })
  public matcher = new MyErrorStateMatcher();
  constructor(private _toastr: ToastrService,private _userService: UserService, private _router: Router) { 
    super();
  }

  ngOnInit() {
    this.reverseCheckUnMatchPassword();
    this.checkIfUserLoggedIn();
  }

  // check if user is loggedin using auth_token key, If loggedin then redirect to login
  private checkIfUserLoggedIn(){
    this._userService.loginStatusApi()
    .subscribe((apiResponse)=>{
      if (apiResponse.status === 200) {
        this._router.navigate(["/login"]) // redirecting to login page if user is logged in
      }
    },(error)=>{
      console.log(error)
      this._toastr.error(error.message);
    })
  }

  // custom validation for confirm password input formcontrol
  private unMatchPassword(ac: AbstractControl){
    let password = ac.root.get('password')
    let confirmPassword = ac.value;
    if(password && confirmPassword === password.value){
      return null; // if passwords matched then return null, i.e not error
    } else {
      return { unMatchPassword : true }; // else return an error so that submit button stays disabled
    }
  }

  /* if Passwords Matched success validation, but after this validation, user changes the password field (not confirmpasssword field)
  then to change back the "Passwords Matched" to "Passwords do not match"*/
  private reverseCheckUnMatchPassword():any{
    this.signUpGroup.get('password')
    .valueChanges
    .subscribe((value)=>{
      let confirmPassword = this.signUpGroup.get('confirmPassword');
      if(value && confirmPassword.value && value === confirmPassword.value){
        confirmPassword.setErrors(null);
      } else {
        confirmPassword.setErrors({unMatchPassword:true});
      }
    })
  }

  // to call signup api on submit button
  public signUp():void{
    // setting error, so that button goes disabled when submitted the form
    this.signUpGroup.setErrors({errors:true});
    let suffixText = "is invalid";
    let data={
      email : this.signUpGroup.get('email').value.toLowerCase(),
      firstName: this.signUpGroup.get('firstName').value,
      lastName : this.signUpGroup.get('lastName').value || '',
      password : this.signUpGroup.get('password').value
    }

    if(this.signUpGroup.get('email').invalid){
      this._toastr.error(`Email ${suffixText}`)
    } else if(this.signUpGroup.get('firstName').invalid){
      this._toastr.error(`First Name ${suffixText}`)
    } else if(this.signUpGroup.get('password').invalid){
      this._toastr.error(`Password ${suffixText}`)
    } else if(data.password !== this.signUpGroup.get('confirmPassword').value){
      this._toastr.error(`Passwords do not match`)
    } else{
      this._userService.signupApi(data)
      .subscribe((apiResponse)=>{
        if(apiResponse.status === 200){
          this._toastr.success("Account created successfully")
          setTimeout(()=>{
            this._router.navigate(['/'])
          },1000)
        } else {
          this._toastr.warning(apiResponse.message)
        }
        // re enabling the button on success or error again
        this.signUpGroup.setErrors(null);
      },(err)=>{
        console.log(err)
        this._toastr.error(err.message);
        this.signUpGroup.setErrors(null);
      })
    }
  }

}
