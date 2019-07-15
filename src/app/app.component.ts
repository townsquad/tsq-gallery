import {Component} from '@angular/core';
import {TSqGalleryFileModel} from '../../projects/tsq-gallery/src/lib/models/tsq-gallery-file.model';

@Component({
  selector: 'tsq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  files: TSqGalleryFileModel[] = [
    {displayUrl: './assets/images/01.png'},
    {displayUrl: './assets/images/02.png'},
    {displayUrl: './assets/images/03.png'},
    {displayUrl: './assets/images/04.png'},
    {displayUrl: './assets/images/05.png'},
    {displayUrl: './assets/images/06.png'},
    {displayUrl: './assets/images/07.png'},
    {displayUrl: './assets/images/08.png'},
  ];
}
