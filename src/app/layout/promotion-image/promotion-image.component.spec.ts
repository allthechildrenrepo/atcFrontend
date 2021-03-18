import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionImageComponent } from './promotion-image.component';

describe('PromotionImageComponent', () => {
  let component: PromotionImageComponent;
  let fixture: ComponentFixture<PromotionImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
