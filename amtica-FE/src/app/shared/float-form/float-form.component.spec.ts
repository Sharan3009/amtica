import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatFormComponent } from './float-form.component';

describe('FloatFormComponent', () => {
  let component: FloatFormComponent;
  let fixture: ComponentFixture<FloatFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
