import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustVisitDonarComponent } from './trust-visit-donar.component';

describe('TrustVisitDonarComponent', () => {
  let component: TrustVisitDonarComponent;
  let fixture: ComponentFixture<TrustVisitDonarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustVisitDonarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustVisitDonarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
