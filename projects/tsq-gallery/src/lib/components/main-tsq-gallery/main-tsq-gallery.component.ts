import {Component, Input, OnInit, TemplateRef} from '@angular/core';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {TSqGalleryTemplateRefContext} from '../../models/tsq-gallery-template-ref-context.model';

@Component({
  selector: 'tsq-gallery',
  templateUrl: 'main-tsq-gallery.component.html',
  styleUrls: ['main-tsq-gallery.component.scss'],
})
export class TSqGalleryComponent implements OnInit {

  @Input() files: TSqGalleryFileModel[];
  @Input() fileDisplayTemplate: TemplateRef<TSqGalleryTemplateRefContext>;

  constructor() {
  }

  ngOnInit() {
  }

  getContext(file: TSqGalleryFileModel): TSqGalleryTemplateRefContext {
    return {
      url: file.displayUrl,
      alt: file.displayAlt,
    };
  }
}
