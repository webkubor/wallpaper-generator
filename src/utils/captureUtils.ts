import domtoimage from 'dom-to-image-more';
import { formatNow } from './time';

export interface CaptureOptions {
  backgroundColor?: string | null;
  scale?: number;
  pixelRatio?: number;
  width?: number;
  height?: number;
  cacheBust?: boolean;
  quality?: number;
  style?: Record<string, string>;
  filter?: (node: Node) => boolean;
  shapeRendering?: string;
}

interface DomToImageOptions {
  width?: number;
  height?: number;
  pixelRatio?: number;
  bgcolor?: string;
  cacheBust?: boolean;
  quality?: number;
  style?: Record<string, string>;
  filter?: (node: Node) => boolean;
  shapeRendering?: string;
}

const resolveDomOptions = (element: HTMLElement, options: CaptureOptions = {}): DomToImageOptions => {
  const rect = element.getBoundingClientRect();
  const width = Math.max(1, Math.round(options.width ?? rect.width));
  const height = Math.max(1, Math.round(options.height ?? rect.height));
  const pixelRatio = Math.max(1, options.pixelRatio ?? options.scale ?? 2);
  const style = {
    ...options.style,
    transform: 'scale(1)',
    transformOrigin: 'center center'
  };

  return {
    width,
    height,
    pixelRatio,
    bgcolor: options.backgroundColor ?? undefined,
    cacheBust: options.cacheBust ?? true,
    quality: options.quality,
    style,
    filter: options.filter,
    shapeRendering: options.shapeRendering
  };
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export async function captureAndDownload(
  element: HTMLElement,
  filename: string,
  options: CaptureOptions = {}
): Promise<void> {
  const domOptions = resolveDomOptions(element, options);
  const blob = await domtoimage.toBlob(element, domOptions);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function captureElement(
  element: HTMLElement,
  options: CaptureOptions = {}
): Promise<HTMLCanvasElement> {
  const domOptions = resolveDomOptions(element, options);
  const dataUrl = await domtoimage.toPng(element, domOptions);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = domOptions.width ?? img.naturalWidth;
  canvas.height = domOptions.height ?? img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  return canvas;
}

export function generateTimestampFilename(prefix: string = 'capture', extension: string = 'png'): string {
  const ts = formatNow('YYYYMMDD-HHmmss');
  return `${prefix}-${ts}.${extension}`;
}

export async function captureWallpaper(
  previewArea: HTMLElement,
  downloadOption: 'withBackground' | 'withoutBackground',
  filename: string
): Promise<void> {
  const targetElement = downloadOption === 'withBackground'
    ? previewArea
    : (previewArea.querySelector('.export-container') ||
       previewArea.querySelector('.wallpaper-content') ||
       previewArea.querySelector('.preview-canvas') ||
       previewArea) as HTMLElement;

  const options: CaptureOptions = {
    backgroundColor: downloadOption === 'withBackground' ? null : 'transparent',
    scale: 2
  };

  await captureAndDownload(targetElement, filename, options);
}
