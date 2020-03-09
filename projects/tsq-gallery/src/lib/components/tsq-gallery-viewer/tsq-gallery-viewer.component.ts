import {Component, Input, Renderer2, TemplateRef, ElementRef, ViewChild} from '@angular/core';
import {PDFProgressData} from 'ng2-pdf-viewer';
import {throttle} from 'lodash';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {galleryAnimations} from '../../utils/gallery.animations';
import {
  TSqGalleryBottomViewerTemplateRefContext,
  TSqGalleryTopViewerTemplateRefContext
} from '../../models/tsq-gallery-template-ref-context.model';
import {SupportedKeys, SupportedScrollDirection} from './../../models/tsq-gallery-supported-keys';
import {TSqGalleryFilePositioningActions} from '../../models/tsq-gallery-file-positioning-actions.model';

@Component({
  selector: 'tsq-gallery-viewer',
  templateUrl: 'tsq-gallery-viewer.component.html',
  styleUrls: ['tsq-gallery-viewer.component.scss'],
  animations: [galleryAnimations],
})
export class TSqGalleryViewerComponent {
  @ViewChild('backdrop', {static: false}) backdropRef: ElementRef;

  @Input()
  set files(files: TSqGalleryFileModel[]) {
    this.galleryFiles = files;
    if (files.length === 0) {
      this.close();
    }
    if (this.selectedFileIndex > files.length - 1) {
      this.setCurrentFile(files.length - 1);
    }
  }

  @Input() topViewerClass: string;
  @Input() topViewerTemplate: TemplateRef<TSqGalleryTopViewerTemplateRefContext>;
  @Input() bottomViewerTemplate: TemplateRef<any>;
  @Input() loadingTemplate: TemplateRef<any>;
  @Input() showLoading: boolean;
  @Input() backdropClickClose: boolean;
  @Input() displayNavigation: boolean;
  @Input() displayNavigationIndex: boolean;
  @Input() allowDownload: boolean;
  @Input() invalidFormatDisplayImage: string;
  @Input() displayInline: boolean;
  @Input() keepOpen: boolean;

  touchTimeStamp = 0;
  touchX = 0;
  initialTouchX = 0;
  canGoForward = false;
  canGoBack = false;
  isViewerOpen = false;
  expanded = false;
  navigationDelay = false;
  pdfLoading = false;
  isMoving = false;
  galleryFilePositioning = new TSqGalleryFilePositioningActions();

  galleryFiles: TSqGalleryFileModel[];
  selectedFileIndex: number;
  selectedFileToDisplay: TSqGalleryFileModel;
  topViewerContext: TSqGalleryTopViewerTemplateRefContext;
  bottomViewerContext: TSqGalleryBottomViewerTemplateRefContext;
  scrollListener: () => void;

  constructor(private renderer: Renderer2) {}

  open(index?: number) {
    this.isViewerOpen = true;
    this.setCurrentFile(index);

    if (!this.displayInline) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    }

    setTimeout(() => {
      if (!!this.backdropRef) {
        this.backdropRef.nativeElement.focus();

        const throttleFunc = throttle(this.onWindowScroll, 1);
        this.scrollListener = this.renderer.listen(this.backdropRef.nativeElement, 'wheel', throttleFunc);
      }
    }, 10);
  }

  pdfOpenOnProgress(progressData: PDFProgressData) {
    this.pdfLoading = progressData.loaded < progressData.total;
  }

  close() {
    this.isViewerOpen = false;
    this.setCurrentFile(undefined);

    if (!this.displayInline) {
      this.renderer.removeStyle(document.body, 'overflow');
    }

    if (!!this.scrollListener) {
      this.scrollListener();
    }
  }

  expand() {
    this.expanded = !this.expanded;

    if (this.expanded) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  goForward(addDelay = false) {
    if (this.canGoForward && !this.navigationDelay) {
      this.setCurrentFile(this.selectedFileIndex + 1);

      if (addDelay) {
        this.navigationDelay = true;
        setTimeout(() => this.navigationDelay = false, 150);
      }
    }
  }

  goBack(addDelay = false) {
    if (this.canGoBack && !this.navigationDelay) {
      this.setCurrentFile(this.selectedFileIndex - 1);

      if (addDelay) {
        this.navigationDelay = true;
        setTimeout(() => this.navigationDelay = false, 150);
      }
    }
  }

  downloadFile() {
    const aTag = document.createElement('a');
    aTag.setAttribute('download', this.selectedFileToDisplay.name);
    aTag.setAttribute('href', this.selectedFileToDisplay.downloadUrl);
    aTag.setAttribute('type', 'hidden');
    aTag.setAttribute('target', '_blank');

    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  }

  closeBackdrop($event: TouchEvent | MouseEvent) {
    $event.stopPropagation();

    if (this.backdropClickClose && !this.isMoving && !this.showLoading) {
      if (!this.keepOpen) {
        this.close();
      } else if (this.expanded) {
        this.expand();
      }
    }
  }

  onWindowScroll = ($event: WheelEvent) => {
    $event.preventDefault();

    if ($event.ctrlKey) {
      if (!window['chrome']) {
        const zoomValue = $event.deltaY * 0.01;

        if ((zoomValue > 0 && this.galleryFilePositioning.canZoomOut) || (zoomValue < 0 && this.galleryFilePositioning.canZoomIn)) {
          this.galleryFilePositioning.setImageZoom(-zoomValue);
          this.galleryFilePositioning.adjustHorizontalPositionOnZoom();
        }
      }
    } else if (Math.abs($event.deltaX) > 0 && Math.abs($event.deltaX) > Math.abs($event.deltaY)) {
      if (this.galleryFilePositioning.canMove) {
        const direction = $event.deltaX > 0 ? SupportedScrollDirection.RIGHT : SupportedScrollDirection.LEFT;

        this.galleryFilePositioning.moveImageTo(direction, Math.abs($event.deltaX * 0.7));
      } else {
        if ($event.deltaX > 15) {
          this.goForward(true);
        } else if ($event.deltaX < -15) {
          this.goBack(true);
        }
      }
    } else if (Math.abs($event.deltaY) > 0) {
      const direction = $event.deltaY > 0 ? SupportedScrollDirection.DOWN : SupportedScrollDirection.UP;

      this.galleryFilePositioning.moveImageTo(direction, Math.abs($event.deltaY * 0.7));
    }
  }

  onKeyDown(keyboardEvent: KeyboardEvent) {
    const key = keyboardEvent.key;

    switch (key) {
      case SupportedKeys.ArrowLeft: {
        this.goBack();
        break;
      }
      case SupportedKeys.ArrowRight: {
        this.goForward();
        break;
      }
      case SupportedKeys.Esc: {
        if (this.expanded) {
          this.expand();
        } else if (!this.showLoading && !this.keepOpen) {
          this.close();
        }
        break;
      }
      case SupportedKeys.ArrowDown : {
        this.galleryFilePositioning.moveImageTo(SupportedScrollDirection.DOWN, 40);
        break;
      }
      case SupportedKeys.ArrowUp : {
        this.galleryFilePositioning.moveImageTo(SupportedScrollDirection.UP, 40);
        break;
      }
      case SupportedKeys.Minus : {
        if (this.galleryFilePositioning.canZoomOut) {
          this.galleryFilePositioning.zoomOut();
        }
        break;
      }
      case SupportedKeys.Plus : {
        if (this.galleryFilePositioning.canZoomIn) {
          this.galleryFilePositioning.zoomIn();
        }
        break;
      }
    }
  }

  dragDown(e: TouchEvent | MouseEvent, isTouch = false) {
    this.galleryFilePositioning.setRelativePosition(this.getClientX(e), this.getClientY(e));
    if (!isTouch) {
      this.isMoving = true;
    }
  }

  dragUp() {
    this.isMoving = false;
  }

  dragMove(e: TouchEvent | MouseEvent) {
    this.galleryFilePositioning.moveImageRelativeToPosition(this.getClientX(e), this.getClientY(e));
  }

  touchStart(e: TouchEvent | MouseEvent) {
    this.initialTouchX = this.getClientX(e);
    this.touchX = this.getClientX(e);
    this.touchTimeStamp = new Date().getTime();
  }

  touchMove(e: TouchEvent | MouseEvent) {
    this.touchX = this.getClientX(e);
  }

  touchEnd() {
    if (Math.abs(this.touchX - this.initialTouchX) > 80 && (new Date().getTime() - this.touchTimeStamp) < 250) {
      if (this.touchX - this.initialTouchX < 0) {
        this.goForward();
      } else {
        this.goBack();
      }
    }
  }

  private getClientX(e: TouchEvent | MouseEvent): number {
    return e instanceof MouseEvent ? e.clientX : e.touches[0].pageX;
  }

  private getClientY(e: TouchEvent | MouseEvent): number {
    return e instanceof MouseEvent ? e.clientY : e.touches[0].pageY;
  }

  private setCurrentFile(index: number) {
    this.galleryFilePositioning.resetImagePosition();

    this.pdfLoading = false;
    this.selectedFileIndex = index || 0;
    this.selectedFileToDisplay = !!this.galleryFiles && this.galleryFiles[index || 0];

    this.canGoBack = this.selectedFileIndex > 0;
    this.canGoForward = this.selectedFileIndex  < this.galleryFiles.length - 1;

    this.topViewerContext = {
      file: this.selectedFileToDisplay,
      index: this.selectedFileIndex,
      fns: {
        close: this.close,
      },
    };

    this.bottomViewerContext = {
      file: this.selectedFileToDisplay,
      index: this.selectedFileIndex,
    };
  }
}
