import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelecallerListComponent } from './telecaller-list.component';

describe('TelecallerListComponent', () => {
  let component: TelecallerListComponent;
  let fixture: ComponentFixture<TelecallerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelecallerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelecallerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
