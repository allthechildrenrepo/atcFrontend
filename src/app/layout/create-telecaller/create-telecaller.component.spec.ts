import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTelecallerComponent } from './create-telecaller.component';

describe('CreateTelecallerComponent', () => {
  let component: CreateTelecallerComponent;
  let fixture: ComponentFixture<CreateTelecallerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTelecallerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTelecallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
