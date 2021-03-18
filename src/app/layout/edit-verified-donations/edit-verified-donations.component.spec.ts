import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVerifiedDonationsComponent } from './edit-verified-donations.component';

describe('EditVerifiedDonationsComponent', () => {
  let component: EditVerifiedDonationsComponent;
  let fixture: ComponentFixture<EditVerifiedDonationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVerifiedDonationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVerifiedDonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
