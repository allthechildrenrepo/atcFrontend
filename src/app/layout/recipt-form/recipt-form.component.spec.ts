import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciptFormComponent } from './recipt-form.component';

describe('ReciptFormComponent', () => {
  let component: ReciptFormComponent;
  let fixture: ComponentFixture<ReciptFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReciptFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciptFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
