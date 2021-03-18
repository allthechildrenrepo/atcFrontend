import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustTransactionComponent } from './trust-transaction.component';

describe('TrustTransactionComponent', () => {
  let component: TrustTransactionComponent;
  let fixture: ComponentFixture<TrustTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
