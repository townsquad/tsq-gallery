import {Component, Input, Renderer2, TemplateRef, ElementRef, ViewChild} from '@angular/core';

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

  keypress = false;
  isMoving = false;
  imageRotation = 0;
  imageZoom = 1;
  selectedFileIndex: number;
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
    return this.imageZoom < 2;
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
    this.isMoving = true;
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

    setTimeout(() => { this.isMoving = false; }, 10);
  }

  open(index?: number) {
    this.isOpen = true;
    this.selectedFileIndex = index || 0;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    setTimeout(() => this.backdropRef.nativeElement.focus(), 10);
  }

  close() {
    this.resetPosition();

    this.isOpen = false;
    this.selectedFileIndex = undefined;
    this.renderer.removeStyle(document.body, 'overflow');
  }

  onKeyUp() {
    this.isMoving = false;
  }

  onKeyDown(keyboardEvent: KeyboardEvent) {
    const key = keyboardEvent.key;
    this.isMoving = true;

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
            this.positionTop -= 40;
            break;
          }
          case 90:
          case -270: {
            this.positionLeft -= 40;
            break;
          }
          case 180:
          case -180: {
            this.positionTop += 40;
            break;
          }
          case 270:
          case -90: {
            this.positionLeft += 40;
            break;
          }
        }
        break;
      }
      case SupportedKeys.ArrowUp : {
        switch (this.imageRotation % 360) {
          case 0:
          case -360: {
            this.positionTop += 40;
            break;
          }
          case 90:
          case -270: {
            this.positionLeft += 40;
            break;
          }
          case 180:
          case -180: {
            this.positionTop -= 40;
            break;
          }
          case 270:
          case -90: {
            this.positionLeft -= 40;
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

  dragDown(e: TouchEvent | MouseEvent) {
    this.initialX = this.getClientX(e);
    this.initialY = this.getClientY(e);
    this.initialLeft = this.positionLeft;
    this.initialTop = this.positionTop;
    this.isMoving = true;
  }

  dragUp() {
    setTimeout(() => {
      this.isMoving = false;
    }, (10));
  }

  dragMove(e: TouchEvent | MouseEvent) {
    if (this.isMoving) {
      switch (this.imageRotation % 360) {
        case 0:
        case -360: {
          this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
          this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
          break;
        }
        case 90:
        case -270: {
          this.positionLeft = this.initialLeft + (this.getClientY(e) - this.initialY);
          this.positionTop = this.initialTop + (-this.getClientX(e) + this.initialX);
          break;
        }
        case 180:
        case -180: {
          this.positionLeft = this.initialLeft + (-this.getClientX(e) + this.initialX);
          this.positionTop = this.initialTop + (-this.getClientY(e) + this.initialY);
          break;
        }
        case 270:
        case -90: {
          this.positionLeft = this.initialLeft + (-this.getClientY(e) + this.initialY);
          this.positionTop = this.initialTop + (this.getClientX(e) - this.initialX);
          break;
        }
      }
    }
  }

  getClientX(e: TouchEvent | MouseEvent): number {
    return e instanceof TouchEvent ?
      e.touches[0].clientX :
      e.clientX;
  }

  getClientY(e: TouchEvent | MouseEvent): number {
    return e instanceof TouchEvent ?
      e.touches[0].clientY :
      e.clientY;
  }

  turnLeft() {
    this.imageRotation -= 90;
  }

  turnRight() {
    this.imageRotation += 90;
  }

  downloadFile() {
    const file = this.selectedFileToDisplay;
    window.open(file.downloadUrl, '_blank');
  }

  private goFoward() {
    if (this.canGoFoward) {
      this.resetPosition();
      this.selectedFileIndex++;
    }
  }

  private goBack() {
    if (this.canGoBack) {
      this.resetPosition();
      this.selectedFileIndex--;
    }
  }
}
