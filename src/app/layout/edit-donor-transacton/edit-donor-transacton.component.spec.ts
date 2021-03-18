import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDonorTransactonComponent } from './edit-donor-transacton.component';

describe('EditDonorTransactonComponent', () => {
  let component: EditDonorTransactonComponent;
  let fixture: ComponentFixture<EditDonorTransactonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDonorTransactonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDonorTransactonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
