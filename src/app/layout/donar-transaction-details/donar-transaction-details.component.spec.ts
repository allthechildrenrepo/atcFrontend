import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonarTransactionDetailsComponent } from './donar-transaction-details.component';

describe('DonarTransactionDetailsComponent', () => {
  let component: DonarTransactionDetailsComponent;
  let fixture: ComponentFixture<DonarTransactionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonarTransactionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonarTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
