import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchBranchAlertComponent } from './switch-branch-alert.component';

describe('SwitchBranchAlertComponent', () => {
  let component: SwitchBranchAlertComponent;
  let fixture: ComponentFixture<SwitchBranchAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchBranchAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchBranchAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
