import {Component, Input, Renderer2, TemplateRef, ElementRef, ViewChild} from '@angular/core';
import {PDFProgressData} from 'ng2-pdf-viewer';
import {throttle} from 'lodash';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {galleryAnimations} from '../../utils/gallery.animations';
import {
  TSqGalleryBottomViewerTemplateRefContext,
  TSqGalleryTopViewerTemplateRefContext
} from '../../models/tsq-gallery-template-ref-context.model';

enum SupportedKeys {
  ArrowRight = 'ArrowRight',
  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  Esc = 'Escape',
  Minus = '-',
  Plus = '+',
}

@Component({
  selector: 'tsq-gallery-viewer',
  templateUrl: 'tsq-gallery-viewer.component.html',
  styleUrls: ['tsq-gallery-viewer.component.scss'],
  animations: [galleryAnimations],
})
export class TSqGalleryViewerComponent {

  @Input()
  set files(files: TSqGalleryFileModel[]) {
    if (files.length === 0) {
      this.close();
    }
    if (this.selectedFileIndex > files.length - 1) {
      this.selectedFileIndex = files.length - 1;
    }

    this.readFiles = files;
  }
  get files() { return this.readFiles; }

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

  navigationDelay = false;
  pdfLoading = false;
  keypress = false;
  isMoving = false;
  imageRotation = 0;
  imageZoom = 1;
  selectedFileIndex: number;
  scrollListener: () => void;

  @ViewChild('backdrop', {static: false}) backdropRef: ElementRef;

  private readFiles: TSqGalleryFileModel[];
  private isOpen: boolean;

  constructor(private renderer: Renderer2) { }

  contextClose = () => {
    this.close();
  }

  get isViewerOpen(): boolean {
    return this.isOpen;
  }

  get selectedFileToDisplay(): TSqGalleryFileModel {
    const file = this.files && this.files[!!this.selectedFileIndex || this.selectedFileIndex === 0 ? this.selectedFileIndex : 0];

    return file;
  }

  get topViewerContext(): TSqGalleryTopViewerTemplateRefContext {
    return {
      file: this.selectedFileToDisplay,
      index: this.selectedFileIndex,
      fns: {
        close: this.contextClose,
      },
    };
  }

  get bottomViewerContext(): TSqGalleryBottomViewerTemplateRefContext {
    return {
      file: this.selectedFileToDisplay,
      index: this.selectedFileIndex,
    };
  }

  get canDrag(): boolean {
    return this.imageZoom > 1.0;
  }

  get canZoomIn(): boolean {
    return this.imageZoom < 1.8;
  }

  get canZoomOut(): boolean {
    return this.imageZoom > 0.5;
  }

  get canGoFoward(): boolean {
    return this.selectedFileIndex < this.files.length - 1 && !this.navigationDelay;
  }

  get canGoBack(): boolean {
    return this.selectedFileIndex > 0 && !this.navigationDelay;
  }

  resetPosition(resetRotation: boolean = true) {
    this.imageZoom = 1;
    this.initialX = 0;
    this.initialY = 0;
    this.initialLeft = 0;
    this.initialTop = 0;
    this.positionLeft = 0;
    this.positionTop = 0;

    if (resetRotation) {
      this.imageRotation = 0;
    }
  }

  open(index?: number) {
    this.isOpen = true;
    this.selectedFileIndex = index || 0;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    setTimeout(() => {
      if (!!this.backdropRef) {
        this.backdropRef.nativeElement.focus();
      }

      this.resetPosition();
    }, 10);

    const throttleFunc = throttle(this.onWindowScroll, 1);
    this.scrollListener = this.renderer.listen('document', 'wheel', throttleFunc);

    this.renderer.setStyle(document.body, 'overscroll-behavior-x', 'none');
  }

  close() {
    this.resetPosition();

    this.isOpen = false;
    this.selectedFileIndex = undefined;
    this.renderer.removeStyle(document.body, 'overflow');

    if (!!this.scrollListener) {
      this.scrollListener();
    }

    this.renderer.removeClass(document.body, 'overscroll-behavior-x');
  }

  onWindowScroll = ($event: WheelEvent) => {
    if ($event.ctrlKey) {
      if (!window['chrome']) {
        const zoomValue = $event.deltaY * 0.01;

        if (zoomValue > 0 && this.canZoomOut) {
          this.imageZoom -= zoomValue;
          this.adjustHorizontalPositionOnZoom();
        } else if (zoomValue < 0 && this.canZoomIn) {
          this.imageZoom -= zoomValue;
          this.adjustHorizontalPositionOnZoom();
        }
      }
    } else if (Math.abs($event.deltaX) > 0 && Math.abs($event.deltaX) > Math.abs($event.deltaY)) {
      if (this.canDrag) {
        switch (this.imageRotation % 360) {
          case 0:
          case -360: {
            this.positionLeft -= this.zoomModifier($event.deltaX * 0.7);
            break;
          }
          case 90:
          case -270: {
            this.positionTop += this.zoomModifier($event.deltaX * 0.7);
            break;
          }
          case 180:
          case -180: {
            this.positionLeft += this.zoomModifier($event.deltaX * 0.7);
            break;
          }
          case 270:
          case -90: {
            this.positionTop -= this.zoomModifier($event.deltaX * 0.7);
            break;
          }
        }
      } else {
        if ($event.deltaX > 15) {
          this.goFoward();
        } else if ($event.deltaX < -15) {
          this.goBack();
        }
      }
    } else if (Math.abs($event.deltaY) > 0) {
      switch (this.imageRotation % 360) {
        case 0:
        case -360: {
          this.positionTop -= this.zoomModifier($event.deltaY * 0.7);
          break;
        }
        case 90:
        case -270: {
          this.positionLeft -= this.zoomModifier($event.deltaY * 0.7);
          break;
        }
        case 180:
        case -180: {
          this.positionTop += this.zoomModifier($event.deltaY * 0.7);
          break;
        }
        case 270:
        case -90: {
          this.positionLeft += this.zoomModifier($event.deltaY * 0.7);
          break;
        }
      }
    }
  }

  onProgress(progressData: PDFProgressData) {
    this.pdfLoading = progressData.loaded < progressData.total;
  }

  onKeyDown(keyboardEvent: KeyboardEvent) {
    const key = keyboardEvent.key;

    switch (key) {
      case SupportedKeys.ArrowLeft: {
        this.goBack();
        break;
      }
      case SupportedKeys.ArrowRight: {
        this.goFoward();
        break;
      }
      case SupportedKeys.Esc: {
        if (!this.showLoading) {
          this.close();
        }
        break;
      }
      case SupportedKeys.ArrowDown : {
        switch (this.imageRotation % 360) {
          case 0:
          case -360: {
            this.positionTop -= this.zoomModifier(40);
            break;
          }
          case 90:
          case -270: {
            this.positionLeft -= this.zoomModifier(40);
            break;
          }
          case 180:
          case -180: {
            this.positionTop += this.zoomModifier(40);
            break;
          }
          case 270:
          case -90: {
            this.positionLeft += this.zoomModifier(40);
            break;
          }
        }
        break;
      }
      case SupportedKeys.ArrowUp : {
        switch (this.imageRotation % 360) {
          case 0:
          case -360: {
            this.positionTop += this.zoomModifier(40);
            break;
          }
          case 90:
          case -270: {
            this.positionLeft += this.zoomModifier(40);
            break;
          }
          case 180:
          case -180: {
            this.positionTop -= this.zoomModifier(40);
            break;
          }
          case 270:
          case -90: {
            this.positionLeft -= this.zoomModifier(40);
            break;
          }
        }
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

  zoomIn() {
    if (this.canZoomIn) {
      this.imageZoom += 0.1;
    }
  }

  zoomOut() {
    if (this.canZoomOut) {
      this.imageZoom -= 0.1;

      this.adjustHorizontalPositionOnZoom();
    }
  }

  adjustHorizontalPositionOnZoom() {
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

  dragDown(e, isTouch = false) {
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

  dragMove(e) {
    switch (this.imageRotation % 360) {
      case 0:
      case -360: {
        this.positionLeft = this.initialLeft + this.zoomModifier(this.getClientX(e) - this.initialX);
        this.positionTop = this.initialTop + this.zoomModifier(this.getClientY(e) - this.initialY);
        break;
      }
      case 90:
      case -270: {
        this.positionLeft = this.initialLeft + this.zoomModifier(this.getClientY(e) - this.initialY);
        this.positionTop = this.initialTop + this.zoomModifier(-this.getClientX(e) + this.initialX);
        break;
      }
      case 180:
      case -180: {
        this.positionLeft = this.initialLeft + this.zoomModifier(-this.getClientX(e) + this.initialX);
        this.positionTop = this.initialTop + this.zoomModifier(-this.getClientY(e) + this.initialY);
        break;
      }
      case 270:
      case -90: {
        this.positionLeft = this.initialLeft + this.zoomModifier(-this.getClientY(e) + this.initialY);
        this.positionTop = this.initialTop + this.zoomModifier(this.getClientX(e) - this.initialX);
        break;
      }
    }
  }

  touchStart(e) {
    this.initialTouchX = this.getClientX(e);
    this.touchX = this.getClientX(e);
    this.touchTimeStamp = new Date().getTime();
  }

  touchMove(e) {
    this.touchX = this.getClientX(e);
  }

  touchEnd() {
    if (Math.abs(this.touchX - this.initialTouchX) > 80 && (new Date().getTime() - this.touchTimeStamp) < 250) {
      if (this.touchX - this.initialTouchX < 0) {
        this.goFoward();
      } else {
        this.goBack();
      }
    }
  }

  getClientX(e: TouchEvent | MouseEvent): number {
    return e instanceof MouseEvent ?
      e.clientX :
      e.touches[0].pageX;
  }

  getClientY(e: TouchEvent | MouseEvent): number {
    return e instanceof MouseEvent ?
      e.clientY :
      e.touches[0].pageY;
  }

  zoomModifier(value: number) {
    return value * ((2 - this.imageZoom) * 1.1);
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

  goFoward() {
    if (this.canGoFoward) {
      this.resetPosition();
      this.selectedFileIndex++;
      this.pdfLoading = false;

      this.navigationDelay = true;
      setTimeout(() => this.navigationDelay = false, 250);
    }
  }

  goBack() {
    if (this.canGoBack) {
      this.resetPosition();
      this.selectedFileIndex--;
      this.pdfLoading = false;

      this.navigationDelay = true;
      setTimeout(() => this.navigationDelay = false, 250);
    }
  }

  closeBackdrop($event: TouchEvent | MouseEvent) {
    $event.stopPropagation();

    if (this.backdropClickClose && !this.isMoving && !this.showLoading) {
      close();
    }
  }
}
