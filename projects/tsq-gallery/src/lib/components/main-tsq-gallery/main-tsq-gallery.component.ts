import {Component, Input, TemplateRef, ViewChild} from '@angular/core';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {
  TSqGalleryBottomPreviewTemplateRefContext,
  TSqGalleryListItemTemplateRefContext,
  TSqGalleryTopPreviewTemplateRefContext
} from '../../models/tsq-gallery-template-ref-context.model';
import {TSqGalleryPreviewComponent} from '../tsq-gallery-preview/tsq-gallery-preview.component';

@Component({
  selector: 'tsq-gallery',
  templateUrl: 'main-tsq-gallery.component.html',
  styleUrls: ['main-tsq-gallery.component.scss'],
})
export class TSqGalleryComponent {

  @ViewChild(TSqGalleryPreviewComponent, {static: false}) preview: TSqGalleryPreviewComponent;

  @Input() files: TSqGalleryFileModel[];
  @Input() fileDisplayTemplate: TemplateRef<TSqGalleryListItemTemplateRefContext>;
  @Input() topPreviewTemplate: TemplateRef<TSqGalleryTopPreviewTemplateRefContext>;
  @Input() bottomPreviewTemplate: TemplateRef<TSqGalleryBottomPreviewTemplateRefContext>;
  @Input() loadingTemplate: TemplateRef<any>;
  @Input() showLoading = false;
  @Input() hasMiniPreviews = true;
  @Input() backdropClickClose = true;
  @Input() displayNavigation = true;
  @Input() displayNavigationIndex = true;

  contextOpen = (index?: number) => {
    this.preview.open(index);
  }

  getListItemContext(file: TSqGalleryFileModel, index: number): TSqGalleryListItemTemplateRefContext {
    return {
      index,
      url: file && file.displayUrl,
      alt: file && file.displayAlt,
      fns: {
        open: this.contextOpen,
      }
    };
  }
}
