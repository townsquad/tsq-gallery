import {Component} from '@angular/core';
import {TSqGalleryFileModel} from '../../projects/tsq-gallery/src/lib/models/tsq-gallery-file.model';

@Component({
  selector: 'tsq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  files: TSqGalleryFileModel[] = [
    {name: 'file_01.png', displayUrl: './assets/images/01.png'},
    {name: 'file_02.png', displayUrl: './assets/images/02.png'},
    {name: 'file_03.png', displayUrl: './assets/images/03.png'},
    {name: 'file_04.png', displayUrl: './assets/images/04.png'},
    {name: 'file_05.png', displayUrl: './assets/images/05.png'},
    {name: 'file_06.png', displayUrl: './assets/images/06.png'},
    {name: 'file_07.png', displayUrl: './assets/images/07.png'},
    {name: 'file_08.png', displayUrl: './assets/images/08.png'},
  ];
}
