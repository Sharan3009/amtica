import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-float-form-footer',
  templateUrl: './float-form-footer.component.html',
  styleUrls: ['./float-form-footer.component.css']
})
export class FloatFormFooterComponent implements OnInit {

  constructor() { }
  @Input('route') routerLink:any;
  @Input('routeText') routeText:string;
  @Input('disableSubmit') disableSubmit:boolean;
  ngOnInit() {
  }

}
