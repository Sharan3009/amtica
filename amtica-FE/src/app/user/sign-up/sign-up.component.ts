import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MyErrorStateMatcher } from './errorStateMatcher';
import { AppComponent } from 'src/app/app.component';

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
  constructor() { 
    super();
  }

  ngOnInit() {
    this.reverseCheckUnMatchPassword();
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
