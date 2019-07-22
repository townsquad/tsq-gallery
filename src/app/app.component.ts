import {Component} from '@angular/core';
import {TSqGalleryFileModel} from '../../projects/tsq-gallery/src/lib/models/tsq-gallery-file.model';

@Component({
  selector: 'tsq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  files: TSqGalleryFileModel[] = [
    // tslint:disable-next-line:max-line-length
    {name: 'file_01.png', displayUrl: './assets/images/01.png', downloadUrl: 'https://cdn.vox-cdn.com/thumbor/GNXFfWIVnp-51ld-aYdKv-JzxRI=/0x0:637x355/1820x1213/filters:focal(269x128:369x228):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'},
    // tslint:disable-next-line:max-line-length
    {name: 'file_02.png', displayUrl: './assets/images/02.png', downloadUrl: 'https://cdn.vox-cdn.com/thumbor/GNXFfWIVnp-51ld-aYdKv-JzxRI=/0x0:637x355/1820x1213/filters:focal(269x128:369x228):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'},
    // tslint:disable-next-line:max-line-length
    {name: 'file_03.png', displayUrl: './assets/images/03.png', downloadUrl: 'https://cdn.vox-cdn.com/thumbor/GNXFfWIVnp-51ld-aYdKv-JzxRI=/0x0:637x355/1820x1213/filters:focal(269x128:369x228):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'},
    // tslint:disable-next-line:max-line-length
    {name: 'file_04.png', displayUrl: './assets/images/04.png', downloadUrl: 'https://cdn.vox-cdn.com/thumbor/GNXFfWIVnp-51ld-aYdKv-JzxRI=/0x0:637x355/1820x1213/filters:focal(269x128:369x228):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'},
    // tslint:disable-next-line:max-line-length
    {name: 'file_05.png', displayUrl: './assets/images/05.png', downloadUrl: 'https://cdn.vox-cdn.com/thumbor/GNXFfWIVnp-51ld-aYdKv-JzxRI=/0x0:637x355/1820x1213/filters:focal(269x128:369x228):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'},
    // tslint:disable-next-line:max-line-length
    {name: 'file_06.png', displayUrl: './assets/images/06.png', downloadUrl: 'https://cdn.vox-cdn.com/thumbor/GNXFfWIVnp-51ld-aYdKv-JzxRI=/0x0:637x355/1820x1213/filters:focal(269x128:369x228):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'},
    // tslint:disable-next-line:max-line-length
    {name: 'file_07.png', displayUrl: './assets/images/07.png', downloadUrl: 'https://cdn.vox-cdn.com/thumbor/GNXFfWIVnp-51ld-aYdKv-JzxRI=/0x0:637x355/1820x1213/filters:focal(269x128:369x228):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'},
    // tslint:disable-next-line:max-line-length
    {name: 'file_08.png', displayUrl: './assets/images/08.png', downloadUrl: 'https://cdn.vox-cdn.com/thumbor/GNXFfWIVnp-51ld-aYdKv-JzxRI=/0x0:637x355/1820x1213/filters:focal(269x128:369x228):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/51105501/adventuretime.0.png'},
  ];

  downloadFile(file: TSqGalleryFileModel) {
    window.open(file.downloadUrl, '_blank');
  }
}
