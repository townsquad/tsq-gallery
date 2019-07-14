import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {TSqGalleryModule} from '../../projects/ngx-tsq-gallery/src/lib/tsq-gallery.module';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TSqGalleryModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
