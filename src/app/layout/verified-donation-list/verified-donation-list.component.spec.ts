import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedDonationListComponent } from './verified-donation-list.component';

describe('VerifiedDonationListComponent', () => {
  let component: VerifiedDonationListComponent;
  let fixture: ComponentFixture<VerifiedDonationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifiedDonationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedDonationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
