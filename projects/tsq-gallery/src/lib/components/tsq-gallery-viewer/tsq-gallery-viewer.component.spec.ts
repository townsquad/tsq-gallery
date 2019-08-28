import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TSqGalleryViewerComponent } from './tsq-gallery-viewer.component';

describe('TSqGalleryViewerComponent', () => {
  let component: TSqGalleryViewerComponent;
  let fixture: ComponentFixture<TSqGalleryViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TSqGalleryViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TSqGalleryViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
