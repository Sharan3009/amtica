import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  private email = new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/) ]);
  private password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  private hidePassword = true;
  constructor() { }

  ngOnInit() {
  }

  private getErrorMessage(type) {
    let error:string = "";
    if(type === "email"){
      error = this.email.hasError('required') ? 'Email cannot be empty' :
        this.email.hasError('pattern') ? 'Email format should be <i>john@doe.com</i>' :
            '';
    } else if (type === "password"){
      error = this.password.hasError('required') ? 'Password cannot be empty' :
        this.password.hasError('minlength') ? 'Password must be atleast 8 characters long' :
            '';
    } else {
      error = "Please enter in correct format";
    }
    return `<b>${error}</b>`;
  }

  private signUp(user){

  }

}
