import {TSqGalleryFileModel} from './tsq-gallery-file.model';

export interface TSqGalleryListItemTemplateRefContext {
  index: number;
  name: string;
  url: string;
  type: string;
  alt: string;
  fns?: {[key: string]: () => any};
}

export interface TSqGalleryTopPreviewTemplateRefContext {
  file: TSqGalleryFileModel;
  fns?: {[key: string]: () => any};
}

export interface TSqGalleryBottomPreviewTemplateRefContext {
  $implicit: TSqGalleryFileModel;
  fns?: {[key: string]: () => any};
}
