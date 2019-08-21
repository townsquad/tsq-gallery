import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import {TSqGalleryComponent} from './components/main-tsq-gallery/main-tsq-gallery.component';
import {TSqGalleryViewerComponent} from './components/tsq-gallery-viewer/tsq-gallery-viewer.component';

@NgModule({
  declarations: [
    TSqGalleryComponent,
    TSqGalleryViewerComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    PdfViewerModule,
  ],
  exports: [
    TSqGalleryComponent,
  ]
})
export class TSqGalleryModule {
}
