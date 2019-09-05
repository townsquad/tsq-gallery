import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PdfViewerModule} from 'ng2-pdf-viewer';

import {TSqGalleryComponent} from './components/main-tsq-gallery/main-tsq-gallery.component';
import {TSqGalleryViewerComponent} from './components/tsq-gallery-viewer/tsq-gallery-viewer.component';

@NgModule({
  declarations: [
    TSqGalleryComponent,
    TSqGalleryViewerComponent,
  ],
  imports: [
    CommonModule,
    PdfViewerModule,
  ],
  exports: [
    TSqGalleryComponent,
  ]
})
export class TSqGalleryModule {}
