# TSqGallery

Angular file preview and carrousel viewer for images and pdfs.

It uses [ng2-pdf-viewer](https://github.com/VadimDez/ng2-pdf-viewer) to display pdfs.

## Usage

Install via `yarn tsq-gallery` or `npm install tsq-gallery`;
Import to your app.modules.

## Demo

Install dependencies via `yarn` or `npm install`;
Run locally at [localhost:4200](http://localhost:4200/) with `ng serve`

## Params

- **files** - Files to be displayed at the Preview and Viewer. Accepted types: images and pdfs. 
- **showLoading** - Toggle display a Loader over the View content.
## Options

- **containerClass** - Override the class of the container for each file of the Preview. The class should either have `::ng-deep` (not recommended) or be global.
- **imagePreviewTemplate** - Override the inner content for image type files on the Preview. Check `TSqGalleryListItemTemplateRefContext` for variables access.
- **pdfPreviewTemplate** - Override the inner content for pdf type files on the Preview. This can be used if you want to hide the file. Check `TSqGalleryListItemTemplateRefContext` for variables access.
- **hasMiniPreviews** - Toggle display the Preview or a single access action button. Override `imagePreviewTemplate` to edit it in case of `false`.
- **backdropClickClose** - Toggle action of closing the backdrop of the Viewer.
- **displayNavigation** - Toggle the navigation actions buttons at the Viewer.
- **displayNavigationIndex** - Toggle display the image index count at the top of the Viewer.
- **topViewerClass** - Override the class of the header of the Viewer. The class should either have `::ng-deep` (not recommended) or be global.
- **topViewerTemplate** - Override the inner content of the top of the Viewer. Check `TSqGalleryTopViewerTemplateRefContext` for variables access.
- **bottomViewerTemplate** - Add content at the bottom of the Viewer. Check `TSqGalleryBottomViewerTemplateRefContext` for variables access.
- **loadingTemplate** - Override the loader shown at the Viewer.
- **allowDownload** - Toggle display the option to download files on the Viewer.
- **invalidFormatDisplayImage** - Option to change the displayed image when the files is of an unsupported format.
