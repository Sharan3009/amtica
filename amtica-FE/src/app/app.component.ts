import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  protected _hide = {password:true, confirmPassword:true};
  protected disableSubmit(group: FormGroup):boolean{
    if(group.invalid){
      return true;
    }
      return false;
  }
  private getErrorMessage(type:string, group:FormGroup):string {
    let error:string = "Please enter in correct format";
    if(type === "email"){
      error = group.get('email').hasError('required') ? 'Email cannot be empty' :
        group.get('email').hasError('pattern') ? 'Email format should be <i>john@doe.com</i>' :
            error;
    } else if(type === "firstName"){
      error = group.get('firstName').hasError('required') ? 'First Name cannot be empty' :
            error;
    } else if (type === "password"){
      error = group.get('password').hasError('required') ? 'Password cannot be empty' :
        group.get('password').hasError('minlength') ? 'Password must be atleast 8 characters long' :
            error;
    } else if(type === "confirmPassword"){
        if(group.get('confirmPassword').hasError('required')){
          error = 'Please confirm the password';
        } else if(group.get('confirmPassword').hasError('unMatchPassword')){
          error = 'Passwords do not match';
        } else {
          error = error;
        }
    } else {
      error = "Please enter in correct format";
    }
    return `<b>${error}</b>`;
  }
}
