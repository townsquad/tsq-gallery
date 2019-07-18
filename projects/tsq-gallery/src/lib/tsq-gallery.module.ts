import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TSqGalleryComponent} from './components/main-tsq-gallery/main-tsq-gallery.component';
import {TsqGalleryPreviewComponent} from './components/tsq-gallery-preview/tsq-gallery-preview.component';

@NgModule({
  declarations: [
    TSqGalleryComponent,
    TsqGalleryPreviewComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TSqGalleryComponent,
  ]
})
export class TSqGalleryModule {
}
