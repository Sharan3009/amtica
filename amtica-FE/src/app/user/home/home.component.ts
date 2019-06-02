import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { UserService } from 'src/app/api/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public header:string;
  public fullName: string;
  public body: string;
  constructor(@Inject(MAT_DIALOG_DATA) private _data: any, private _userService:UserService, private _toastr:ToastrService, private _matDialog: MatDialog) { }

  ngOnInit() {
    this.header = this._data.header;
    this.fullName = this._data.fullName;
    this.body = this._data.body;
  }

  public logout(){
    this._userService.logoutApi()
    .subscribe((apiResponse)=>{
      if(apiResponse.status === 200){
        this._toastr.success("You are logged out successfully")
        this._matDialog.closeAll();
      } else {
        this._toastr.error(apiResponse.error);
      }
    },(err)=>{
      this._toastr.error(err.error);
      console.log(err);
    })
  }

}
