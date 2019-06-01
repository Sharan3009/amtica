import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatFormComponent } from './float-form/float-form.component';

@NgModule({
  declarations: [FloatFormComponent],
  imports: [
    CommonModule
  ],
  exports: [FloatFormComponent]
})
export class SharedModule { }
