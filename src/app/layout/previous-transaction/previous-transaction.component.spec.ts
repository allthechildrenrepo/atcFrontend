import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousTransactionComponent } from './previous-transaction.component';

describe('PreviousTransactionComponent', () => {
  let component: PreviousTransactionComponent;
  let fixture: ComponentFixture<PreviousTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
