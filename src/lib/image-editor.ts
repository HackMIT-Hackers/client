export type ImageEditorOptions = {
  readonly canvas: HTMLCanvasElement;
  readonly image: ImageBitmap;
}

type ImageDimensions = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number
}

/**
 * An editor which allows users to manipulate images through operations.
 * Communicates asynchronously with API server.
 */
export class ImageEditor {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly originalImage: ImageBitmap;
  
  constructor(readonly options: ImageEditorOptions) {
    this.canvas = options.canvas;
    const context = this.canvas.getContext("2d");

    if (context === null) {
      throw Error("Could not initialize canvas context properly.");
    }

    this.originalImage = options.image;

    this.context = context;

    this.initialize();
  }

  /**
   * Initializes canvas based on contents of file.
   */
  initialize(): void {
    // Clear the canvas.
    this.context.fillStyle = "#ffffff";
    this.context.clearRect(0, 0, this._width, this._height);

    const actualDimensions = this.calculateRatios();

    this.context.drawImage(this.originalImage, actualDimensions.x, actualDimensions.y, actualDimensions.width, actualDimensions.height);
  }

  /**
   * Calculates the ratios of the image such that it can fit on the canvas.
   */
  private calculateRatios(): ImageDimensions {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const imageWidth = this.originalImage.width;
    const imageHeight = this.originalImage.height;

    const aspectRatio = imageHeight / imageWidth;

    let actualWidth = Math.min(imageWidth, canvasWidth);
    let actualHeight = actualWidth * aspectRatio;

    if (imageHeight > imageWidth) {
      actualHeight = Math.min(imageHeight, canvasHeight);
      actualWidth = actualHeight / aspectRatio;
    }

    return { x: (canvasWidth - actualWidth) / 2, y: (canvasHeight - actualHeight) / 2, width: actualWidth, height: actualHeight };
  }

  /**
   * Returns the width of the canvas.
   */
  private get _width(): number {
    return this.canvas.width;
  }

  /**
   * Returns the height of the canvas.
   */
  private get _height(): number {
    return this.canvas.height;
  }
}
