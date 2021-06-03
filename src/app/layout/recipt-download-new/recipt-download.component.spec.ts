import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciptDownloadNewComponent } from './recipt-download.component';

describe('ReciptDownloadComponent', () => {
  let component: ReciptDownloadNewComponent;
  let fixture: ComponentFixture<ReciptDownloadNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReciptDownloadNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciptDownloadNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
