import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciptDownloadComponent } from './recipt-download.component';

describe('ReciptDownloadComponent', () => {
  let component: ReciptDownloadComponent;
  let fixture: ComponentFixture<ReciptDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReciptDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciptDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
