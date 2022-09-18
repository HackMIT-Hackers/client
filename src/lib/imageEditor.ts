import { ToolType } from "../hooks/useToolSelect";

export type ImageEditorOptions = {
  readonly canvas: HTMLCanvasElement;
  readonly image: ImageBitmap;
  readonly initialTool: ToolType;
  readonly initialBrushSize: number;
}

export type ImageUpdateToolOptions = {
  readonly tool: ToolType;
  readonly brushSize: number;
}

type Position = {
  readonly x: number;
  readonly y: number;
}

type ImageDimensions = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number
}

export enum LayerNames {
  World = "World",
  Viewport = "Viewport",
  Mask = "Mask",
  Base = "Base",
  Offscreen = "Offscreen"
}

/**
 * An editor which allows users to manipulate images through operations.
 * Communicates asynchronously with API server.
 */
export class ImageEditor {
  // Client-side state.
  readonly layers: Record<string, { element: HTMLCanvasElement, context: CanvasRenderingContext2D }>;

  // Mutable state.
  toolType: ToolType;
  brushSize: number;
  positionBuffer: Position[];

  constructor(readonly options: ImageEditorOptions) {
    this.brushSize = options.initialBrushSize;
    this.toolType = options.initialTool;
    this.layers = {};
    this.positionBuffer = [];

    Object.keys(LayerNames).map((layerName) => {
      const element = layerName === LayerNames.World ? options.canvas : document.createElement('canvas') as HTMLCanvasElement;

      this.layers[layerName] = {
        element: element,
        context: element.getContext('2d')!,
      };
    });

    // Initialize base and mask layers.
    {
      this.layers[LayerNames.Base].element.width = options.image.width;
      this.layers[LayerNames.Base].element.height = options.image.height;
      this.layers[LayerNames.Base].context.drawImage(options.image, 0, 0);

      this.layers[LayerNames.Mask].element.width = options.image.width;
      this.layers[LayerNames.Mask].element.height = options.image.height;
    }

    // Setup blend settings for mask layer.
    {
      const context = this.layers[LayerNames.Mask].context;
      context.globalCompositeOperation = "source-over";
    }

    Object.freeze(this.layers);

    // Resize the back buffer so it is the same size as the front one.
    this.resizeBackbuffer();

    // Initial render of canvas.
    this.render();
  }

  updateImage(image: ImageBitmap): void {
    const { width, height } = this.getSize(LayerNames.Base);

    this.layers[LayerNames.Base].context.clearRect(0, 0, width, height);
    this.layers[LayerNames.Mask].context.clearRect(0, 0, width, height);

    this.layers[LayerNames.Base].element.width = image.width;
    this.layers[LayerNames.Base].element.height = image.height;
    this.layers[LayerNames.Base].context.drawImage(image, 0, 0);

    this.layers[LayerNames.Mask].element.width = image.width;
    this.layers[LayerNames.Mask].element.height = image.height;

    this.render();
  }

  /**
   * Initializes canvas based on contents of file.
   */
  render(): void {
    // Clear the canvas.
    this.clearCanvas();

    // Draw the image.
    this.drawImage(LayerNames.Base);

    // Draw the mask.
    {
      this.layers[LayerNames.Offscreen].context.globalAlpha = 0.4;
      this.drawImage(LayerNames.Mask);
      this.layers[LayerNames.Offscreen].context.globalAlpha = 1.0;
      // console.log(this.layers[LayerNames.Mask].element.toDataURL());
    }

    // Flip the back and front buffers.
    this.flipBuffers();
  }

  /**
   * Exports and image and its mask.
   * 
   * @returns base64 encoding data URLs. one for the image, one for the mask.
   */
  async exportImages(): Promise<[string, string]> {
    const mask = this.layers[LayerNames.Mask];
    const base = this.layers[LayerNames.Base];

    return [base.element.toDataURL(), mask.element.toDataURL()];
  }

  /**
   * Updates the current internal state of the position inside editor.
   * 
   * @param x new x position inside canvas
   * @param y new y position inside canvas
   */
  updatePosition(x: number, y: number): void {
    // TODO(kosinw): Change to viewport
    const { width: canvasWidth, height: canvasHeight } = this.getSize(LayerNames.Offscreen);
    const { width: imageWidth, height: imageHeight } = this.getSize(LayerNames.Mask);
    const { x: offsetX, y: offsetY } = this.calculateRatios();
    const mouseX = x * canvasWidth;
    const mouseY = y * canvasHeight;
    const context = this.layers[LayerNames.Mask].context;
    const conversionFactor = Math.max(1, Math.max(imageWidth / canvasWidth, imageHeight / canvasHeight));

    let previousCompositeOperation: GlobalCompositeOperation;

    if (this.toolType === ToolType.Eraser) {
      previousCompositeOperation = context.globalCompositeOperation;
      context.globalCompositeOperation = 'destination-out';
    }

    // TODO(kosinw): Batch draw calls for this.
    if (this.toolType === ToolType.Brush || this.toolType === ToolType.Eraser) {
      context.fillStyle = '#9ACC59';

      context.beginPath();
      context.arc((mouseX - offsetX) * conversionFactor, (mouseY - offsetY) * conversionFactor, this.brushSize * conversionFactor, 0, 2 * Math.PI);
      context.fill();
      this.render();
      // this.positionBuffer.push({ x: (mouseX - offsetX) * conversionFactor, y: (mouseY - offsetY) * conversionFactor });
    }

    if (this.toolType === ToolType.Eraser) {
      context.globalCompositeOperation = previousCompositeOperation!;
    }

  }

  /**
   * Resizes the backbuffer so it matches the size of your mom.
   */
  resizeBackbuffer(): void {
    this.layers[LayerNames.Offscreen].element.width = this.layers[LayerNames.World].element.width;
    this.layers[LayerNames.Offscreen].element.height = this.layers[LayerNames.World].element.height;
  }

  /**
   * Updates the current tool being used.
   * 
   * @param tool the next tool to use with image editor
   */
  updateTool(options: ImageUpdateToolOptions) {
    this.toolType = options.tool;
    this.brushSize = options.brushSize;
  }

  private drawImage(layer: LayerNames) {
    const { context: renderTarget } = this.layers[LayerNames.Offscreen];
    const { element: image } = this.layers[layer];

    const actualDimensions = this.calculateRatios();

    // console.log(actualDimensions);
    renderTarget.drawImage(image, actualDimensions.x, actualDimensions.y, actualDimensions.width, actualDimensions.height);
  }

  private flipBuffers(): void {
    this.layers[LayerNames.World].context.drawImage(this.layers[LayerNames.Offscreen].element, 0, 0);
  }

  private clearCanvas(): void {
    const { context, element } = this.layers[LayerNames.Offscreen];

    context.fillStyle = "#ffffff";
    context.clearRect(0, 0, element.width, element.height);
  }

  private getSize(layer: LayerNames): { width: number, height: number } {
    return this.layers[layer].element;
  }

  /**
   * Calculates the ratios of the image such that it can fit on the canvas.
   */
  private calculateRatios(): ImageDimensions {
    const canvas = this.layers[LayerNames.Offscreen].element;
    const image = this.layers[LayerNames.Base].element;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imageWidth = image.width;
    const imageHeight = image.height;

    // console.log(canvasWidth, canvasHeight, imageWidth, imageHeight);

    // const aspectRatio = imageHeight / imageWidth;

    const conversionFactor = Math.max(1, Math.max(imageWidth / canvasWidth, imageHeight / canvasHeight));

    return {
      x: (canvasWidth - imageWidth / conversionFactor) / 2,
      y: (canvasHeight - imageHeight / conversionFactor) / 2,
      width: imageWidth / conversionFactor,
      height: imageHeight / conversionFactor
    };
  }
}
