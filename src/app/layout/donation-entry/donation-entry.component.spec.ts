import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationEntryComponent } from './donation-entry.component';

describe('DonationEntryComponent', () => {
  let component: DonationEntryComponent;
  let fixture: ComponentFixture<DonationEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
