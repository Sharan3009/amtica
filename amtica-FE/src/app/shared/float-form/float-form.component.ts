import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-float-form',
  templateUrl: './float-form.component.html',
  styleUrls: ['./float-form.component.css']
})
export class FloatFormComponent implements OnInit {
  @Input('headerText') headerText:string;
  constructor() { }

  ngOnInit() {
  }

}
