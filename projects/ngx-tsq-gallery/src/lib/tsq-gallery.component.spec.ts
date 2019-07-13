import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TSqGalleryComponent} from './tsq-gallery.component';

describe('TSqGalleryComponent', () => {
  let component: TSqGalleryComponent;
  let fixture: ComponentFixture<TSqGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TSqGalleryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TSqGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
