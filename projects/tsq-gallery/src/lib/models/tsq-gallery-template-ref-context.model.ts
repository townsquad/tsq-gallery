import {TSqGalleryFileModel} from './tsq-gallery-file.model';

export interface TSqGalleryListItemTemplateRefContext {
  index: number;
  name: string;
  url: string;
  type: string;
  alt: string;
  fns?: {[key: string]: () => any};
}

export interface TSqGalleryTopViewerTemplateRefContext {
  index: number;
  file: TSqGalleryFileModel;
  fns?: {[key: string]: () => any};
}

export interface TSqGalleryBottomViewerTemplateRefContext {
  index: number;
  file: TSqGalleryFileModel;
  fns?: {[key: string]: () => any};
}
