import {SupportedScrollDirection} from './tsq-gallery-supported-keys';

export class TSqGalleryFilePositioningActions {
  initialX = 0;
  initialY = 0;
  initialLeft = 0;
  initialTop = 0;
  positionLeft = 0;
  positionTop = 0;
  imageRotation = 0;
  imageZoom = 1;
  canMove = false;
  canZoomOut = false;
  canZoomIn = false;

  zoomIn() {
    if (this.canZoomIn) {
      this.setImageZoom(0.1);
    }
  }

  zoomOut() {
    if (this.canZoomOut) {
      this.setImageZoom(-0.1);
      this.adjustHorizontalPositionOnZoom();
    }
  }

  turnLeft() {
    this.imageRotation -= 90;
  }

  turnRight() {
    this.imageRotation += 90;
  }

  moveImageTo(direction: SupportedScrollDirection, distance: number) {
    const directionMod = direction === SupportedScrollDirection.UP || direction === SupportedScrollDirection.LEFT ? 1 : -1;
    const nextDistance = this.addZoomModifier(distance);
    const imageRotationMod = direction === SupportedScrollDirection.LEFT || direction === SupportedScrollDirection.RIGHT ? 90 : 0;

    switch ((this.imageRotation + imageRotationMod) % 360) {
      case 0:
      case -360: {
        this.positionTop += directionMod * nextDistance;
        break;
      }
      case 90:
      case -270: {
        this.positionLeft += directionMod * nextDistance;
        break;
      }
      case 180:
      case -180: {
        this.positionTop += -directionMod * nextDistance;
        break;
      }
      case 270:
      case -90: {
        this.positionLeft += -directionMod * nextDistance;
        break;
      }
    }
  }

  setRelativePosition(x: number, y: number) {
    this.initialX = x;
    this.initialY = y;
    this.initialLeft = this.positionLeft;
    this.initialTop = this.positionTop;
  }

  moveImageRelativeToPosition(x: number, y: number) {
    switch (this.imageRotation % 360) {
      case 0:
      case -360: {
        this.positionLeft = this.initialLeft + this.addZoomModifier(x - this.initialX);
        this.positionTop = this.initialTop + this.addZoomModifier(y - this.initialY);
        break;
      }
      case 90:
      case -270: {
        this.positionLeft = this.initialLeft + this.addZoomModifier(y - this.initialY);
        this.positionTop = this.initialTop + this.addZoomModifier(-x + this.initialX);
        break;
      }
      case 180:
      case -180: {
        this.positionLeft = this.initialLeft + this.addZoomModifier(-x + this.initialX);
        this.positionTop = this.initialTop + this.addZoomModifier(-y + this.initialY);
        break;
      }
      case 270:
      case -90: {
        this.positionLeft = this.initialLeft + this.addZoomModifier(-y + this.initialY);
        this.positionTop = this.initialTop + this.addZoomModifier(x - this.initialX);
        break;
      }
    }
  }

  addZoomModifier(value: number) {
    return value * ((2 - this.imageZoom) * 1.1);
  }

  setImageZoom(distance: number, replace = false) {
    this.imageZoom = replace ? distance : this.imageZoom + distance;

    this.canMove = this.imageZoom > 1.0;
    this.canZoomIn = this.imageZoom < 1.8;
    this.canZoomOut = this.imageZoom > 0.5;
  }

  adjustHorizontalPositionOnZoom() {
    switch (this.imageRotation % 360) {
      case 0:
      case 180:
      case -180:
      case -360: {
        this.positionLeft = this.imageZoom > 1.0 ? this.positionLeft / 2 : 0;
        break;
      }
      default: {
        this.positionTop = this.imageZoom > 1.0 ? this.positionTop / 2 : 0;
        break;
      }
    }
  }

  resetImagePosition() {
    this.setImageZoom(1, true);
    this.initialX = this.initialY = this.initialLeft = this.initialTop = this.positionLeft = this.positionTop = this.imageRotation = 0;
  }
}
