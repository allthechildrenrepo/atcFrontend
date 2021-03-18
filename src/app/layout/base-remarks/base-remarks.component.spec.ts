import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseRemarksComponent } from './base-remarks.component';

describe('DonorRemarksComponent', () => {
  let component: BaseRemarksComponent;
  let fixture: ComponentFixture<BaseRemarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseRemarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
