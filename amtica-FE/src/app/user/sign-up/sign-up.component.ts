import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MyErrorStateMatcher } from './errorStateMatcher';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  private _signUpGroup = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/) ]),
    firstName : new FormControl('', [Validators.required]),
    lastName : new FormControl(),
    password : new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword : new FormControl('', [Validators.required,this.unMatchPassword])
  })
  private _hide = {password:true, confirmPassword:true};
  private _matcher = new MyErrorStateMatcher();
  constructor() { }

  ngOnInit() {
    this.reverseCheckUnMatchPassword();
  }

  private getErrorMessage(type):string {
    let error:string = "Please enter in correct format";
    if(type === "email"){
      error = this._signUpGroup.get('email').hasError('required') ? 'Email cannot be empty' :
        this._signUpGroup.get('email').hasError('pattern') ? 'Email format should be <i>john@doe.com</i>' :
            error;
    } else if(type === "firstName"){
      error = this._signUpGroup.get('firstName').hasError('required') ? 'First Name cannot be empty' :
            error;
    } else if (type === "password"){
      error = this._signUpGroup.get('password').hasError('required') ? 'Password cannot be empty' :
        this._signUpGroup.get('password').hasError('minlength') ? 'Password must be atleast 8 characters long' :
            error;
    } else if(type === "confirmPassword"){
        if(this._signUpGroup.get('confirmPassword').hasError('required')){
          error = 'Please confirm the password';
        } else if(this._signUpGroup.get('confirmPassword').hasError('unMatchPassword')){
          error = 'Passwords do not match';
        } else {
          error = error;
        }
    } else {
      error = "Please enter in correct format";
    }
    return `<b>${error}</b>`;
  }

  private onChange($event){
    if(!$event.control.touched){
      $event.control.markAsTouched();
    }
}

  private disableSubmit():boolean{
    if(this._signUpGroup.invalid){
      return true;
    }
      return false;
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

  private signUp(user):void{

  }

}
