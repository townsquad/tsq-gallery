import {Component} from '@angular/core';
import {TSqGalleryFileModel} from '../../projects/tsq-gallery/src/lib/models/tsq-gallery-file.model';

@Component({
  selector: 'tsq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  files: TSqGalleryFileModel[] = [
    {
      name: 'file_01.png',
      type: 'image',
      displayUrl: './assets/images/01.png',
      downloadUrl: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'
    },
    {
      name: 'file_02.png',
      type: 'image',
      displayUrl: './assets/images/02.png',
      downloadUrl: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'
    },
    {
      name: 'file_03.png',
      type: 'image',
      displayUrl: './assets/images/03.png',
      downloadUrl: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'
    },
    {
      name: 'file_04.png',
      type: 'image',
      displayUrl: './assets/images/04.png',
      downloadUrl: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'
    },
    {
      name: 'file_05.png',
      type: 'image',
      displayUrl: './assets/images/05.png',
      downloadUrl: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'
    },
    {
      name: 'file_01.pdf',
      type: 'pdf',
      displayUrl: './assets/pdfs/01.pdf',
      downloadUrl: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'
    }
  ];

  removeFromList(removeIndex: number) {
    this.files = this.files.filter((file, index) => index !== removeIndex);
  }

  downloadFile(file: TSqGalleryFileModel) {
    window.open(file.downloadUrl, '_blank');
  }
}
