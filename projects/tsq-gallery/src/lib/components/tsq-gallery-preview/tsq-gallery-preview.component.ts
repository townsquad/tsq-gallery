import {Component, Input, Renderer2, TemplateRef} from '@angular/core';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {
  TSqGalleryBottomPreviewTemplateRefContext,
  TSqGalleryTopPreviewTemplateRefContext
} from '../../models/tsq-gallery-template-ref-context.model';

@Component({
  selector: 'tsq-gallery-preview',
  templateUrl: 'tsq-gallery-preview.component.html',
  styleUrls: ['tsq-gallery-preview.component.scss']
})
export class TSqGalleryPreviewComponent {

  @Input() files: TSqGalleryFileModel[];
  @Input() topPreviewTemplate: TemplateRef<TSqGalleryTopPreviewTemplateRefContext>;
  @Input() bottomPreviewTemplate: TemplateRef<any>;

  private isOpen: boolean;
  private selectedFileIndex: number;

  constructor(private renderer: Renderer2) {
  }

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
    this.selectedFileIndex = index;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  close() {
    this.isOpen = false;
    this.selectedFileIndex = undefined;
    this.renderer.removeStyle(document.body, 'overflow');
  }

  onKeyUp(keyboardEvent: KeyboardEvent) {
    const key = keyboardEvent.key;
    if (!!this.files) {
      if (this.isArrowRight(keyboardEvent.key) && this.canGoForward(this.selectedFileIndex, this.files.length)) {
        this.selectedFileIndex++;
      } else if (this.isArrowLeft(key) && this.canGoBack(this.selectedFileIndex)) {
        this.selectedFileIndex--;
      } else if (this.isEsc(key)) {
        this.close();
      }
    }
  }

  private canGoForward(selectedIndex: number, fileListLength: number): boolean {
    return selectedIndex < fileListLength - 1;
  }

  private canGoBack(selectedIndex: number): boolean {
    return selectedIndex > 0;
  }

  private isArrowLeft(key: string): boolean {
    return key === SupportedArrows.ArrowLeft;
  }

  private isArrowRight(key: string): boolean {
    return key === SupportedArrows.ArrowRight;
  }

  private isEsc(key: string): boolean {
    return key === SupportedArrows.Esc;
  }
}

enum SupportedArrows {
  ArrowRight = 'ArrowRight',
  ArrowLeft = 'ArrowLeft',
  Esc = 'Escape',
}
