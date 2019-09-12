import {Component, Input, Renderer2, TemplateRef, ElementRef, ViewChild} from '@angular/core';
import {PDFProgressData} from 'ng2-pdf-viewer';

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

  initialX = 0;
  initialY = 0;
  initialLeft = 0;
  initialTop = 0;
  positionLeft = 0;
  positionTop = 0;

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

  get canZoomIn(): boolean {
    return this.imageZoom < 1.8;
  }

  get canZoomOut(): boolean {
    return this.imageZoom > 0.5;
  }

  get canGoFoward(): boolean {
    return this.selectedFileIndex < this.files.length - 1;
  }

  get canGoBack(): boolean {
    return this.selectedFileIndex > 0;
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

    this.scrollListener = this.renderer.listen('document', 'wheel', ($event) => this.onWindowScroll($event));
  }

  close() {
    this.resetPosition();

    this.isOpen = false;
    this.selectedFileIndex = undefined;
    this.renderer.removeStyle(document.body, 'overflow');

    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  onWindowScroll($event: WheelEvent) {
    if ($event.ctrlKey) {
      if (!window['chrome']) {
        const zoomValue = $event.deltaY * 0.01;

        if (zoomValue > 0 && this.canZoomOut) {
          this.imageZoom -= zoomValue;
        } else if (zoomValue < 0 && this.canZoomIn) {
          this.imageZoom -= zoomValue;
        }
      }
    } else if ($event.deltaY < 0 || $event.deltaY > 0) {
      switch (this.imageRotation % 360) {
        case 0:
        case -360: {
          this.positionTop += this.zoomModifier($event.deltaY * 0.7);
          break;
        }
        case 90:
        case -270: {
          this.positionLeft += this.zoomModifier($event.deltaY * 0.7);
          break;
        }
        case 180:
        case -180: {
          this.positionTop -= this.zoomModifier($event.deltaY * 0.7);
          break;
        }
        case 270:
        case -90: {
          this.positionLeft -= this.zoomModifier($event.deltaY * 0.7);
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
    }
  }

  dragDown(e) {
    this.initialX = this.getClientX(e);
    this.initialY = this.getClientY(e);
    this.initialLeft = this.positionLeft;
    this.initialTop = this.positionTop;
    this.isMoving = true;
  }

  dragUp() {
    this.isMoving = false;
  }

  dragMove(e) {
    if (this.isMoving) {
      switch (this.imageRotation % 360) {
        case 0:
        case -360: {
          this.positionLeft = this.zoomModifier(this.initialLeft + (this.getClientX(e) - this.initialX)) ;
          this.positionTop = this.zoomModifier(this.initialTop + (this.getClientY(e) - this.initialY));
          break;
        }
        case 90:
        case -270: {
          this.positionLeft = this.zoomModifier(this.initialLeft + (this.getClientY(e) - this.initialY));
          this.positionTop = this.zoomModifier(this.initialTop + (-this.getClientX(e) + this.initialX));
          break;
        }
        case 180:
        case -180: {
          this.positionLeft = this.zoomModifier(this.initialLeft + (-this.getClientX(e) + this.initialX));
          this.positionTop = this.zoomModifier(this.initialTop + (-this.getClientY(e) + this.initialY));
          break;
        }
        case 270:
        case -90: {
          this.positionLeft = this.zoomModifier(this.initialLeft + (-this.getClientY(e) + this.initialY));
          this.positionTop = this.zoomModifier(this.initialTop + (this.getClientX(e) - this.initialX));
          break;
        }
      }
    }
  }

  getClientX(e: TouchEvent | MouseEvent): number {
    return e instanceof MouseEvent ?
      e.clientX :
      e.touches[0].clientX;
  }

  getClientY(e: TouchEvent | MouseEvent): number {
    return e instanceof MouseEvent ?
      e.clientY :
      e.touches[0].clientY;
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
    const url = this.selectedFileToDisplay.downloadUrl;

    const aTag = document.createElement('a');
    aTag.setAttribute('download', this.selectedFileToDisplay.name);
    aTag.setAttribute('href', this.selectedFileToDisplay.downloadUrl);

    aTag.setAttribute('type', 'hidden');

    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  }

  goFoward() {
    if (this.canGoFoward) {
      this.resetPosition();
      this.selectedFileIndex++;
      this.pdfLoading = false;
    }
  }

  goBack() {
    if (this.canGoBack) {
      this.resetPosition();
      this.selectedFileIndex--;
      this.pdfLoading = false;
    }
  }
}
