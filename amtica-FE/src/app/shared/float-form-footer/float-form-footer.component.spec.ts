import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatFormFooterComponent } from './float-form-footer.component';

describe('FloatFormFooterComponent', () => {
  let component: FloatFormFooterComponent;
  let fixture: ComponentFixture<FloatFormFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatFormFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatFormFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
