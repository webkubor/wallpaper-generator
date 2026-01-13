import html2canvas from 'html2canvas';
import { formatNow } from './time';

/**
 * HTML元素截图选项
 */
export interface CaptureOptions {
  backgroundColor?: string | null;
  scale?: number;
  useCORS?: boolean;
  allowTaint?: boolean;
  foreignObjectRendering?: boolean;
  logging?: boolean;
  width?: number;
  height?: number;
}

/**
 * HTML元素转换为Canvas并下载
 */
export async function captureAndDownload(
  element: HTMLElement,
  filename: string,
  options: CaptureOptions = {}
): Promise<void> {
  const defaultOptions: CaptureOptions = {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    ...options
  };
  
  const canvas = await html2canvas(element, defaultOptions);
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * HTML元素转换为Canvas
 */
export async function captureElement(
  element: HTMLElement,
  options: CaptureOptions = {}
): Promise<HTMLCanvasElement> {
  const defaultOptions: CaptureOptions = {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    ...options
  };
  
  return await html2canvas(element, defaultOptions);
}

/**
 * 临时清除 export-container 缩放，返回恢复函数
 */
const disableScaleDuringCapture = (element: HTMLElement | null): (() => void) => {
  if (!element) return () => {};
  const exportContainers = element.matches('.export-container')
    ? [element]
    : Array.from(element.querySelectorAll<HTMLElement>('.export-container'));
  const original = exportContainers.map((el) => ({
    el,
    transform: el.style.transform,
    transformOrigin: el.style.transformOrigin
  }));
  exportContainers.forEach((el) => {
    el.style.transform = 'scale(1)';
    el.style.transformOrigin = 'center center';
  });

  return () => {
    original.forEach(({ el, transform, transformOrigin }) => {
      el.style.transform = transform;
      el.style.transformOrigin = transformOrigin;
    });
  };
};

/**
 * 生成带时间戳的文件名
 */
export function generateTimestampFilename(prefix: string = 'capture', extension: string = 'png'): string {
  const ts = formatNow('YYYYMMDD-HHmmss');
  return `${prefix}-${ts}.${extension}`;
}

/**
 * 壁纸导出专用函数
 */
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
    scale: 2,
    useCORS: true
  };
  const restoreScale = disableScaleDuringCapture(targetElement);
  try {
    await captureAndDownload(targetElement, filename, options);
  } finally {
    restoreScale();
  }
}
