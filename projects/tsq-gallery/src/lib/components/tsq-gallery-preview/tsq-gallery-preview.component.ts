import {Component, Input, Renderer2, TemplateRef, ElementRef, ViewChild} from '@angular/core';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {galleryAnimations} from '../../utils/gallery.animations';
import {
  TSqGalleryBottomPreviewTemplateRefContext,
  TSqGalleryTopPreviewTemplateRefContext
} from '../../models/tsq-gallery-template-ref-context.model';

enum SupportedKeys {
  ArrowRight = 'ArrowRight',
  ArrowLeft = 'ArrowLeft',
  Esc = 'Escape',
}

@Component({
  selector: 'tsq-gallery-preview',
  templateUrl: 'tsq-gallery-preview.component.html',
  styleUrls: ['tsq-gallery-preview.component.scss'],
  animations: [galleryAnimations],
})
export class TSqGalleryPreviewComponent {

  @Input() files: TSqGalleryFileModel[];
  @Input() topPreviewTemplate: TemplateRef<TSqGalleryTopPreviewTemplateRefContext>;
  @Input() bottomPreviewTemplate: TemplateRef<any>;
  @Input() loadingTemplate: TemplateRef<any>;
  @Input() showLoading: boolean;
  @Input() backdropClickClose: boolean;
  @Input() displayNavigation: boolean;
  @Input() displayNavigationIndex: boolean;

  imageRotation = 0;
  imageZoom = 1;
  selectedFileIndex: number;
  @ViewChild('backdrop') backdropRef:ElementRef;

  private isOpen: boolean;

  constructor(private renderer: Renderer2) { }

  contextClose = () => {
    this.close();
  }

  get isPreviewOpen(): boolean {
    return this.isOpen;
  }

  get selectedFileToDisplay(): TSqGalleryFileModel {
    return this.files && this.files[!!this.selectedFileIndex || this.selectedFileIndex === 0 ? this.selectedFileIndex : 0];
  }

  get topPreviewContext(): TSqGalleryTopPreviewTemplateRefContext {
    return {
      file: this.selectedFileToDisplay,
      fns: {
        close: this.contextClose,
      },
    };
  }

  get bottomPreviewContext(): TSqGalleryBottomPreviewTemplateRefContext {
    return {
      $implicit: this.selectedFileToDisplay,
    };
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
    return this.imageZoom > 1;
  }



  canDragOnZoom(): boolean {
    return this.imageZoom > 1;
  }

  isMoving = false;

  dragDown(e) {
    if (this.canDragOnZoom()) {
      e.stopPropagation();

      console.log('down')

      // this.initialX = this.getClientX(e);
      // this.initialY = this.getClientY(e);
      // this.initialLeft = this.positionLeft;
      // this.initialTop = this.positionTop;
      this.isMoving = true;
    }
  }

  dragUp(e) {
    e.stopPropagation();
    console.log('up')
    this.isMoving = false;
  }

  dragMove(e) {
    if (this.isMoving) {
      e.stopPropagation();

      console.log('move')
        // this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
        // this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
    }
  }

  turnLeft() {
    this.imageRotation -= 90;
  }

  turnRight() {
    this.imageRotation += 90;
  }

  private goFoward() {
    this.selectedFileIndex++;
  }

  private canGoFoward(): boolean {
    return this.selectedFileIndex < this.files.length - 1;
  }

  private goBack() {
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
