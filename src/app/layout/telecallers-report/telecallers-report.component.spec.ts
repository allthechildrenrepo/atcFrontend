import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelecallersReportComponent } from './telecallers-report.component';

describe('TelecallersReportComponent', () => {
  let component: TelecallersReportComponent;
  let fixture: ComponentFixture<TelecallersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelecallersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelecallersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
