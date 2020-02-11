import {Component, Input, TemplateRef, ViewChild, ChangeDetectionStrategy} from '@angular/core';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {
  TSqGalleryBottomViewerTemplateRefContext,
  TSqGalleryListItemTemplateRefContext,
  TSqGalleryTopViewerTemplateRefContext
} from '../../models/tsq-gallery-template-ref-context.model';
import {TSqGalleryViewerComponent} from '../tsq-gallery-viewer/tsq-gallery-viewer.component';

@Component({
  selector: 'tsq-gallery, [tsq-gallery]',
  templateUrl: 'main-tsq-gallery.component.html',
  styleUrls: ['main-tsq-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TSqGalleryComponent {

  @ViewChild(TSqGalleryViewerComponent, {static: false}) viewer: TSqGalleryViewerComponent;

  /** Files to be displayed at the Preview and Viewer. Accepted types: images and pdfs. */
  @Input() files: TSqGalleryFileModel[];

  /** Override the class of the container for the Preview.
   * The class should either have `::ng-deep` (not recommended) or be global.
   */
  @Input() containerClass: string;

  /** Override the class of the container for each file of the Preview.
   * The class should either have `::ng-deep` (not recommended) or be global.
   */
  @Input() itemContainerClass: string;

  /** Override the class of the header of the Viewer. The class should either have `::ng-deep` (not recommended) or be global. */
  @Input() topViewerClass: string;

  /** Override the inner content for image type files on the Preview. Check `TSqGalleryListItemTemplateRefContext` for variables access. */
  @Input() imagePreviewTemplate: TemplateRef<TSqGalleryListItemTemplateRefContext>;

  /** Override the inner content for pdf type files on the Preview. This can be used if you want to hide the file.
   * Check `TSqGalleryListItemTemplateRefContext` for variables access.
   */
  @Input() pdfPreviewTemplate: TemplateRef<TSqGalleryListItemTemplateRefContext>;

  /** Override the inner content of the top of the Viewer. Check `TSqGalleryTopViewerTemplateRefContext` for variables access. */
  @Input() topViewerTemplate: TemplateRef<TSqGalleryTopViewerTemplateRefContext>;

  /** Add content at the bottom of the Viewer. Check `TSqGalleryBottomViewerTemplateRefContext` for variables access. */
  @Input() bottomViewerTemplate: TemplateRef<TSqGalleryBottomViewerTemplateRefContext>;

  /** Override the loader shown at the Viewer. */
  @Input() loadingTemplate: TemplateRef<any>;

  /** Toggle display a Loader over the View content. */
  @Input() showLoading = false;

  /** Toggle display the Preview or a single access action button. Override `imagePreviewTemplate` to edit it in case of `false`. */
  @Input() hasMiniPreviews = true;

  /** Toggle action of closing the backdrop of the Viewer. */
  @Input() backdropClickClose = true;

  /** Toggle the navigation actions buttons at the Viewer. */
  @Input() displayNavigation = true;

  /** Toggle display the image index count at the top of the Viewer. */
  @Input() displayNavigationIndex = true;

  /** Toggle display the option to download files on the Viewer.  */
  @Input() allowDownload = true;

  /** Option to change the displayed image when the files is of an unsupported format.  */
  @Input() invalidFormatDisplayImage: string;

  /** Open preview for file of Index. */
  contextOpen = (index?: number) => {
    this.viewer.open(index);
  }

  getListItemContext(file: TSqGalleryFileModel, index: number): TSqGalleryListItemTemplateRefContext {
    return {
      index,
      name: !!file && file.name,
      url: !!file && file.displayUrl,
      type: !!file && file.type,
      alt: !!file && file.displayAlt,
      fns: {
        open: this.contextOpen,
      }
    };
  }
}
