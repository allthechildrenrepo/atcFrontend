import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBatchComponent } from './generate-batch.component';

describe('GenerateBatchComponent', () => {
  let component: GenerateBatchComponent;
  let fixture: ComponentFixture<GenerateBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
