import {Component, Input, Renderer2, TemplateRef, ElementRef, ViewChild} from '@angular/core';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {galleryAnimations} from '../../utils/gallery.animations';
import {
  TSqGallerybottomViewerTemplateRefContext,
  TSqGallerytopViewerTemplateRefContext
} from '../../models/tsq-gallery-template-ref-context.model';

enum SupportedKeys {
  ArrowRight = 'ArrowRight',
  ArrowLeft = 'ArrowLeft',
  Esc = 'Escape',
}

@Component({
  selector: 'tsq-gallery-viewer',
  templateUrl: 'tsq-gallery-viewer.component.html',
  styleUrls: ['tsq-gallery-viewer.component.scss'],
  animations: [galleryAnimations],
})
export class TSqGalleryViewerComponent {

  @Input() files: TSqGalleryFileModel[];
  @Input() topViewerTemplate: TemplateRef<TSqGallerytopViewerTemplateRefContext>;
  @Input() bottomViewerTemplate: TemplateRef<any>;
  @Input() loadingTemplate: TemplateRef<any>;
  @Input() showLoading: boolean;
  @Input() backdropClickClose: boolean;
  @Input() displayNavigation: boolean;
  @Input() displayNavigationIndex: boolean;

  initialX = 0;
  initialY = 0;
  initialLeft = 0;
  initialTop = 0;
  positionLeft = 0;
  positionTop = 0;

  isMoving = false;
  imageRotation = 0;
  imageZoom = 1;
  selectedFileIndex: number;
  @ViewChild('backdrop', {static: false}) backdropRef:ElementRef;

  private isOpen: boolean;

  constructor(private renderer: Renderer2) { }

  contextClose = () => {
    this.close();
  }

  get isViewerOpen(): boolean {
    return this.isOpen;
  }

  get selectedFileToDisplay(): TSqGalleryFileModel {
    return this.files && this.files[!!this.selectedFileIndex || this.selectedFileIndex === 0 ? this.selectedFileIndex : 0];
  }

  get topViewerContext(): TSqGallerytopViewerTemplateRefContext {
    return {
      file: this.selectedFileToDisplay,
      fns: {
        close: this.contextClose,
      },
    };
  }

  get bottomViewerContext(): TSqGallerybottomViewerTemplateRefContext {
    return {
      $implicit: this.selectedFileToDisplay,
    };
  }

  resetPosition() {
    this.isMoving = false;
    this.imageZoom = 1;
    this.imageRotation = 0;
    this.initialX = 0;
    this.initialY = 0;
    this.initialLeft = 0;
    this.initialTop = 0;
    this.positionLeft = 0;
    this.positionTop = 0;
  }

  open(index?: number) {
    this.isOpen = true;
    this.selectedFileIndex = index || 0;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    setTimeout(() => this.backdropRef.nativeElement.focus(), 50);
  }

  close() {
    this.imageRotation = 0;
    this.imageZoom = 1;

    this.isOpen = false;
    this.selectedFileIndex = undefined;
    this.renderer.removeStyle(document.body, 'overflow');
  }

  onKeyUp(keyboardEvent: KeyboardEvent) {
    const key = keyboardEvent.key;
    if (!this.showLoading && !!this.files) {
      if (this.isArrowRight(keyboardEvent.key) && this.canGoFoward()) {
        this.goFoward();
      } else if (this.isArrowLeft(key) && this.canGoBack()) {
        this.goBack();
      } else if (this.isEsc(key)) {
        this.close();
      }
    }
  }

  zoomIn() {
    if (this.canZoomIn()) {
      this.imageZoom += 0.1;
    }
  }
  canZoomIn(): boolean {
    return this.imageZoom < 2;
  }

  zoomOut() {
    if (this.canZoomOut()) {
      this.imageZoom -= 0.1;
    }
  }

  canZoomOut(): boolean {
    return this.imageZoom > 0.5;
  }

  dragDown(e) {
    this.initialX = this.getClientX(e);
    this.initialY = this.getClientY(e);
    this.initialLeft = this.positionLeft;
    this.initialTop = this.positionTop;
    this.isMoving = true;
  }

  dragUp(e) {
    setTimeout(() => {
      this.isMoving = false;
    }, (20));
  }

  dragMove(e) {
    if (this.isMoving) {
      this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
      this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
    }
  }

  getClientX(e) {
    return e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
  }

  getClientY(e) {
    return e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
  }

  turnLeft() {
    this.imageRotation -= 90;
  }

  turnRight() {
    this.imageRotation += 90;
  }

  private goFoward() {
    this.resetPosition();
    this.selectedFileIndex++;
  }

  private canGoFoward(): boolean {
    return this.selectedFileIndex < this.files.length - 1;
  }

  private goBack() {
    this.resetPosition();
    this.selectedFileIndex--;
  }

  private canGoBack(): boolean {
    return this.selectedFileIndex > 0;
  }

  private isArrowLeft(key: string): boolean {
    return key === SupportedKeys.ArrowLeft;
  }

  private isArrowRight(key: string): boolean {
    return key === SupportedKeys.ArrowRight;
  }

  private isEsc(key: string): boolean {
    return key === SupportedKeys.Esc;
  }
}
