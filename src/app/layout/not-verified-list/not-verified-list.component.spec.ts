import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotVerifiedListComponent } from './not-verified-list.component';

describe('NotVerifiedListComponent', () => {
  let component: NotVerifiedListComponent;
  let fixture: ComponentFixture<NotVerifiedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotVerifiedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotVerifiedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
