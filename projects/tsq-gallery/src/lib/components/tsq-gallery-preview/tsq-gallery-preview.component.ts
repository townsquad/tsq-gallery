import {Component, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'tsq-gallery-preview',
  templateUrl: 'tsq-gallery-preview.component.html',
  styleUrls: ['tsq-gallery-preview.component.scss']
})
export class TsqGalleryPreviewComponent implements OnInit {

  constructor(private renderer: Renderer2) {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  ngOnInit() {
  }

  click() {
    this.renderer.removeStyle(document.body, 'overflow');
  }
}
