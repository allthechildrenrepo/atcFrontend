import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTelecallerListComponent } from './assign-telecaller-list.component';

describe('AssignTelecallerListComponent', () => {
  let component: AssignTelecallerListComponent;
  let fixture: ComponentFixture<AssignTelecallerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignTelecallerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTelecallerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
