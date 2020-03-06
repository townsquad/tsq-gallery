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

  initialX = 0;
  initialY = 0;
  initialLeft = 0;
  initialTop = 0;
  positionLeft = 0;
  positionTop = 0;
  touchTimeStamp = 0;
  touchX = 0;
  initialTouchX = 0;
  imageRotation = 0;
  imageZoom = 1;

  canGoForward = false;
  canGoBack = false;
  canZoomIn = false;
  canZoomOut = false;
  canMove = false;
  isViewerOpen = false;
  navigationDelay = false;
  pdfLoading = false;
  isMoving = false;
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

    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    setTimeout(() => {
      if (!!this.backdropRef) {
        this.backdropRef.nativeElement.focus();
      }
    }, 10);

    const throttleFunc = throttle(this.onWindowScroll, 1);
    this.scrollListener = this.renderer.listen('document', 'wheel', throttleFunc);

    this.renderer.setStyle(document.body, 'overscroll-behavior-x', 'none');
  }

  pdfOpenOnProgress(progressData: PDFProgressData) {
    this.pdfLoading = progressData.loaded < progressData.total;
  }

  close() {
    this.isViewerOpen = false;
    this.setCurrentFile(undefined);

    this.renderer.removeStyle(document.body, 'overflow');

    if (!!this.scrollListener) {
      this.scrollListener();
    }

    this.renderer.removeStyle(document.body, 'overscroll-behavior-x');
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

  closeBackdrop($event: TouchEvent | MouseEvent) {
    $event.stopPropagation();

    if (this.backdropClickClose && !this.isMoving && !this.showLoading) {
      this.close();
    }
  }

  turnLeft() {
    this.imageRotation -= 90;
  }

  turnRight() {
    this.imageRotation += 90;
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

  zoomIn() {
    if (this.canZoomIn) {
      this.setImageZoom(0.1);
    }
  }

  zoomOut() {
    if (this.canZoomOut) {
      this.setImageZoom(-0.1);
      this.adjustHorizontalPositionOnZoom();
    }
  }

  onWindowScroll = ($event: WheelEvent) => {
    if ($event.ctrlKey) {
      // tslint:disable-next-line: no-string-literal
      if (!window['chrome']) {
        const zoomValue = $event.deltaY * 0.01;

        if ((zoomValue > 0 && this.canZoomOut) || (zoomValue < 0 && this.canZoomIn)) {
          this.setImageZoom(-zoomValue);
          this.adjustHorizontalPositionOnZoom();
        }
      }
    } else if (Math.abs($event.deltaX) > 0 && Math.abs($event.deltaX) > Math.abs($event.deltaY)) {
      if (this.canMove) {
        const direction = $event.deltaX > 0 ? SupportedScrollDirection.RIGHT : SupportedScrollDirection.LEFT;

        this.moveImageTo(direction, Math.abs($event.deltaX * 0.7));
      } else {
        if ($event.deltaX > 15) {
          this.goForward(true);
        } else if ($event.deltaX < -15) {
          this.goBack(true);
        }
      }
    } else if (Math.abs($event.deltaY) > 0) {
      const direction = $event.deltaY > 0 ? SupportedScrollDirection.DOWN : SupportedScrollDirection.UP;

      this.moveImageTo(direction, Math.abs($event.deltaY * 0.7));
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
        if (!this.showLoading) {
          this.close();
        }
        break;
      }
      case SupportedKeys.ArrowDown : {
        this.moveImageTo(SupportedScrollDirection.DOWN, 40);
        break;
      }
      case SupportedKeys.ArrowUp : {
        this.moveImageTo(SupportedScrollDirection.UP, 40);
        break;
      }
      case SupportedKeys.Minus : {
        if (this.canZoomOut) {
          this.zoomOut();
        }
        break;
      }
      case SupportedKeys.Plus : {
        if (this.canZoomIn) {
          this.zoomIn();
        }
        break;
      }
    }
  }

  dragDown(e: TouchEvent | MouseEvent, isTouch = false) {
    this.initialX = this.getClientX(e);
    this.initialY = this.getClientY(e);
    this.initialLeft = this.positionLeft;
    this.initialTop = this.positionTop;

    if (!isTouch) {
      this.isMoving = true;
    }
  }

  dragUp() {
    this.isMoving = false;
  }

  dragMove(e: TouchEvent | MouseEvent) {
    switch (this.imageRotation % 360) {
      case 0:
      case -360: {
        this.positionLeft = this.initialLeft + this.addZoomModifier(this.getClientX(e) - this.initialX);
        this.positionTop = this.initialTop + this.addZoomModifier(this.getClientY(e) - this.initialY);
        break;
      }
      case 90:
      case -270: {
        this.positionLeft = this.initialLeft + this.addZoomModifier(this.getClientY(e) - this.initialY);
        this.positionTop = this.initialTop + this.addZoomModifier(-this.getClientX(e) + this.initialX);
        break;
      }
      case 180:
      case -180: {
        this.positionLeft = this.initialLeft + this.addZoomModifier(-this.getClientX(e) + this.initialX);
        this.positionTop = this.initialTop + this.addZoomModifier(-this.getClientY(e) + this.initialY);
        break;
      }
      case 270:
      case -90: {
        this.positionLeft = this.initialLeft + this.addZoomModifier(-this.getClientY(e) + this.initialY);
        this.positionTop = this.initialTop + this.addZoomModifier(this.getClientX(e) - this.initialX);
        break;
      }
    }
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

  private addZoomModifier(value: number) {
    return value * ((2 - this.imageZoom) * 1.1);
  }

  private setImageZoom(distance: number, replace = false) {
    this.imageZoom = replace ? distance : this.imageZoom + distance;

    this.canMove = this.imageZoom > 1.0;
    this.canZoomIn = this.imageZoom < 1.8;
    this.canZoomOut = this.imageZoom > 0.5;
  }

  private adjustHorizontalPositionOnZoom() {
    switch (this.imageRotation % 360) {
      case 0:
      case 180:
      case -180:
      case -360: {
        this.positionLeft = this.imageZoom > 1.0 ? this.positionLeft / 2 : 0;
        break;
      }
      default: {
        this.positionTop = this.imageZoom > 1.0 ? this.positionTop / 2 : 0;
        break;
      }
    }
  }

  private moveImageTo(direction: SupportedScrollDirection, distance: number) {
    const directionMod = direction === SupportedScrollDirection.UP || direction === SupportedScrollDirection.LEFT ? 1 : -1;
    const nextDistance = this.addZoomModifier(distance);
    const imageRotationMod = direction === SupportedScrollDirection.LEFT || direction === SupportedScrollDirection.RIGHT ? 90 : 0;

    switch ((this.imageRotation + imageRotationMod) % 360) {
      case 0:
      case -360: {
        this.positionTop += directionMod * nextDistance;
        break;
      }
      case 90:
      case -270: {
        this.positionLeft += directionMod * nextDistance;
        break;
      }
      case 180:
      case -180: {
        this.positionTop += -directionMod * nextDistance;
        break;
      }
      case 270:
      case -90: {
        this.positionLeft += -directionMod * nextDistance;
        break;
      }
    }
  }

  private resetImagePosition(resetRotation: boolean = true) {
    this.setImageZoom(1, true);
    this.initialX = this.initialY = this.initialLeft = this.initialTop = this.positionLeft = this.positionTop = 0;

    if (resetRotation) {
      this.imageRotation = 0;
    }
  }

  private setCurrentFile(index: number) {
    this.resetImagePosition();

    this.pdfLoading = false;
    this.selectedFileIndex = index;
    this.selectedFileToDisplay = !!this.galleryFiles && this.galleryFiles[index || 0];

    this.canGoBack = index > 0;
    this.canGoForward = index < this.galleryFiles.length - 1;

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
