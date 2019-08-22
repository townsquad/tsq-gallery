# NgxTsqGallery

Angular file preview and carrousel viewer for images and pdfs.

It uses [ng2-pdf-viewer](https://github.com/VadimDez/ng2-pdf-viewer) to display pdfs.

## Usage

Install via `yarn tsq-gallery` or `npm install tsq-gallery`;
Import to your app.modules.

## Demo

Install dependencies via `yarn` or `npm install`;
Run locally at [localhost:4200](http://localhost:4200/) with `ng serve`

## Options

preview, like adding a custom icon instead.
- **containerClass** - override container class. The class should have `::ng-deep` (not recommended) or be global to work. 
- **imagePreviewTemplate** - override inner content for images.
- **pdfPreviewTemplate** - change how the inner content of the preview for pdf files is displayed. This can be used if you want to hide the file.
- **hasMiniPreviews** - by default it is shown a mini for each file, if false, it shows a single access point for the viewer instead of showing previews. To override it, pass a `imagePreviewTemplate`.
- **loadingTemplate** - display loader over content.
- **backdropClickClose** - disables or enables to close the viewer by clicking on the backdrop.
- **displayNavigation** - display navigation actions at side of the contents.
- **displayNavigationIndex** - show page count at the top.
- **topViewerClass** - override header of the viwer. The class should have `::ng-deep` (not recommended) or be global to work.
- **topViewerTemplate** - override the default top section of the viewer.
- **bottomViewerTemplate** - override the default bottom section of the viewer.
- **loaderTemplate** - override the loader shown inside of the viewer.
