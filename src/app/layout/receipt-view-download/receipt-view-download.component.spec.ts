import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptViewDownloadComponent } from './receipt-view-download.component';

describe('ReceiptViewDownloadComponent', () => {
  let component: ReceiptViewDownloadComponent;
  let fixture: ComponentFixture<ReceiptViewDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptViewDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptViewDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
