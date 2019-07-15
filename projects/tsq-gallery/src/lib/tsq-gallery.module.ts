import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TSqGalleryComponent} from './components/main-tsq-gallery/main-tsq-gallery.component';

@NgModule({
  declarations: [
    TSqGalleryComponent,
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
