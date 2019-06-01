import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatFormComponent } from './float-form/float-form.component';
import { FloatFormFooterComponent } from './float-form-footer/float-form-footer.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [FloatFormComponent, FloatFormFooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule
  ],
  exports: [FloatFormComponent, FloatFormFooterComponent]
})
export class SharedModule { }
