import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PdfViewerModule} from 'ng2-pdf-viewer';
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {
  faCloudDownloadAlt,
  faSearchMinus,
  faSearchPlus,
  faUndoAlt,
  faRedoAlt,
  faTimesCircle,
  faEyeSlash} from '@fortawesome/free-solid-svg-icons';

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
    FontAwesomeModule,
  ],
  exports: [
    TSqGalleryComponent,
  ]
})
export class TSqGalleryModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCloudDownloadAlt, faSearchMinus, faSearchPlus, faUndoAlt, faRedoAlt, faTimesCircle, faEyeSlash);
  }
}
