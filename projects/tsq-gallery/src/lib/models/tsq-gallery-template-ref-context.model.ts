import {TSqGalleryFileModel} from './tsq-gallery-file.model';

export interface TSqGalleryListItemTemplateRefContext {
  index: number;
  name: string;
  url: string;
  type: string;
  alt: string;
  fns?: {[key: string]: () => any};
}

export interface TSqGallerytopViewerTemplateRefContext {
  index: number;
  file: TSqGalleryFileModel;
  fns?: {[key: string]: () => any};
}

export interface TSqGallerybottomViewerTemplateRefContext {
  index: number;
  file: TSqGalleryFileModel;
  fns?: {[key: string]: () => any};
}
