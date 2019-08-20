import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {TSqGalleryComponent} from './components/main-tsq-gallery/main-tsq-gallery.component';
import {TSqGalleryPreviewComponent} from './components/tsq-gallery-preview/tsq-gallery-preview.component';

@NgModule({
  declarations: [
    TSqGalleryComponent,
    TSqGalleryPreviewComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
  ],
  exports: [
    TSqGalleryComponent,
  ]
})
export class TSqGalleryModule {
}
