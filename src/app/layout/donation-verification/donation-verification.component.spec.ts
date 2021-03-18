import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationVerificationComponent } from './donation-verification.component';

describe('DonationVerificationComponent', () => {
  let component: DonationVerificationComponent;
  let fixture: ComponentFixture<DonationVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
