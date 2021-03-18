import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionReceiptDetailsComponent } from './transaction-receipt-details.component';

describe('TransactionReceiptDetailsComponent', () => {
  let component: TransactionReceiptDetailsComponent;
  let fixture: ComponentFixture<TransactionReceiptDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionReceiptDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionReceiptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
