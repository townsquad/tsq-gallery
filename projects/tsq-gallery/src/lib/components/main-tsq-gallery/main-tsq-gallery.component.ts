import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {
  TSqGalleryListItemTemplateRefContext,
  TSqGalleryTopPreviewTemplateRefContext
} from '../../models/tsq-gallery-template-ref-context.model';
import {TSqGalleryPreviewComponent} from '../tsq-gallery-preview/tsq-gallery-preview.component';

@Component({
  selector: 'tsq-gallery',
  templateUrl: 'main-tsq-gallery.component.html',
  styleUrls: ['main-tsq-gallery.component.scss'],
})
export class TSqGalleryComponent implements OnInit {

  @ViewChild(TSqGalleryPreviewComponent, {static: false}) preview: TSqGalleryPreviewComponent;

  @Input() files: TSqGalleryFileModel[];
  @Input() fileDisplayTemplate: TemplateRef<TSqGalleryListItemTemplateRefContext>;
  @Input() topPreviewTemplate: TemplateRef<TSqGalleryTopPreviewTemplateRefContext>;
  @Input() bottomPreviewTemplate: TemplateRef<any>;

  constructor() {
  }

  ngOnInit() {
  }

  open = (index?: number) => {
    this.preview.open(index);
  }

  getListItemContext(file: TSqGalleryFileModel, index: number): TSqGalleryListItemTemplateRefContext {
    return {
      index,
      url: file.displayUrl,
      alt: file.displayAlt,
      fns: {
        open: this.open,
      }
    };
  }
}
