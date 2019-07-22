import {TSqGalleryFileModel} from './tsq-gallery-file.model';

export interface TSqGalleryListItemTemplateRefContext {
  index: number;
  url: string;
  alt: string;
  fns?: {[key: string]: () => any};
}

export interface TSqGalleryTopPreviewTemplateRefContext {
  file: TSqGalleryFileModel;
  fns?: {[key: string]: () => any};
}
