import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonarSearchPageComponent } from './donar-search-page.component';

describe('DonarSearchPageComponent', () => {
  let component: DonarSearchPageComponent;
  let fixture: ComponentFixture<DonarSearchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonarSearchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonarSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
