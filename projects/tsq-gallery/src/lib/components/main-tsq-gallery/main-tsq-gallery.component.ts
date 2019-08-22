import {Component, Input, TemplateRef, ViewChild} from '@angular/core';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {
  TSqGallerybottomViewerTemplateRefContext,
  TSqGalleryListItemTemplateRefContext,
  TSqGallerytopViewerTemplateRefContext
} from '../../models/tsq-gallery-template-ref-context.model';
import {TSqGalleryViewerComponent} from '../tsq-gallery-viewer/tsq-gallery-viewer.component';

@Component({
  selector: 'tsq-gallery',
  templateUrl: 'main-tsq-gallery.component.html',
  styleUrls: ['main-tsq-gallery.component.scss'],
})
export class TSqGalleryComponent {

  @ViewChild(TSqGalleryViewerComponent, {static: false}) viewer: TSqGalleryViewerComponent;

  @Input() files: TSqGalleryFileModel[];
  @Input() containerClass: string;
  @Input() topViewerClass: string;
  @Input() imagePreviewTemplate: TemplateRef<TSqGalleryListItemTemplateRefContext>;
  @Input() pdfPreviewTemplate: TemplateRef<TSqGalleryListItemTemplateRefContext>;
  @Input() topViewerTemplate: TemplateRef<TSqGallerytopViewerTemplateRefContext>;
  @Input() bottomViewerTemplate: TemplateRef<TSqGallerybottomViewerTemplateRefContext>;
  @Input() loadingTemplate: TemplateRef<any>;
  @Input() showLoading = false;
  @Input() hasMiniPreviews = true;
  @Input() backdropClickClose = true;
  @Input() displayNavigation = true;
  @Input() displayNavigationIndex = true;

  contextOpen = (index?: number) => {
    this.viewer.open(index);
  }

  getListItemContext(file: TSqGalleryFileModel, index: number): TSqGalleryListItemTemplateRefContext {
    return {
      index,
      name: file && file.name,
      url: file && file.displayUrl,
      type: file && file.type,
      alt: file && file.displayAlt,
      fns: {
        open: this.contextOpen,
      }
    };
  }
}
