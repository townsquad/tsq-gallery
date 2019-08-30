import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {TSqGalleryModule} from 'tsq-gallery';

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
