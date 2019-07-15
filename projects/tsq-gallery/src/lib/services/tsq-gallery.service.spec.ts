import {TestBed} from '@angular/core/testing';

import {TSqGalleryService} from './tsq-gallery.service';

describe('TSqGalleryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TSqGalleryService = TestBed.get(TSqGalleryService);
    expect(service).toBeTruthy();
  });
});
