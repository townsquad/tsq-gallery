import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TsqGalleryPreviewComponent } from './tsq-gallery-preview.component';

describe('TsqGalleryPreviewComponent', () => {
  let component: TsqGalleryPreviewComponent;
  let fixture: ComponentFixture<TsqGalleryPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TsqGalleryPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TsqGalleryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
