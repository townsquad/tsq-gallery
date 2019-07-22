import {Component, Input, Renderer2, TemplateRef} from '@angular/core';

import {TSqGalleryFileModel} from '../../models/tsq-gallery-file.model';
import {TSqGalleryTopPreviewTemplateRefContext} from '../../models/tsq-gallery-template-ref-context.model';

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
    if (!!this.files) {
      if (keyboardEvent.key === 'ArrowRight' && this.selectedFileIndex !== this.files.length - 1) {
        this.selectedFileIndex++;
      } else if (keyboardEvent.key === 'ArrowLeft' && this.selectedFileIndex !== 0) {
        this.selectedFileIndex--;
      }
    }
  }
}
