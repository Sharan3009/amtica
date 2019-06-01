import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';

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
  constructor() { 
    super();
  }

  ngOnInit() {
  }

  private signIn():any{
    this._loginGroup.setErrors({errors:true})
  }

}
