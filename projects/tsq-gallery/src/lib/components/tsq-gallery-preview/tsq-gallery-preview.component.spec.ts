import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TSqGalleryPreviewComponent } from './tsq-gallery-preview.component';

describe('TSqGalleryPreviewComponent', () => {
  let component: TSqGalleryPreviewComponent;
  let fixture: ComponentFixture<TSqGalleryPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TSqGalleryPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TSqGalleryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
