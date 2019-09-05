import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';

import {TSqGalleryModule} from 'tsq-gallery';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TSqGalleryModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
