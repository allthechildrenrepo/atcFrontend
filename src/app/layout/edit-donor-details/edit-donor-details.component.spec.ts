import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDonorDetailsComponent } from './edit-donor-details.component';

describe('EditDonorDetailsComponent', () => {
  let component: EditDonorDetailsComponent;
  let fixture: ComponentFixture<EditDonorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDonorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDonorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
