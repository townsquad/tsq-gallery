export class TSqGalleryFileModel {
  name: string;
  type: 'pdf' | 'image' | 'file';
  displayUrl: string;
  displayAlt?: string;
  downloadUrl?: string;
}
