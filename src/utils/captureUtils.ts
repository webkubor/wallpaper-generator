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
 * 复制目标并去除缩放样式以便导出
 */
const cloneForCapture = (element: HTMLElement | null): HTMLElement | null => {
  if (!element) return null;
  const clone = element.cloneNode(true) as HTMLElement;
  const exportContainer = clone.querySelector('.export-container') as HTMLElement | null;
  if (exportContainer) {
    exportContainer.style.transform = 'scale(1)';
    exportContainer.style.transformOrigin = 'center center';
  }
  const rect = element.getBoundingClientRect();
  clone.style.position = 'fixed';
  clone.style.top = `${rect.top}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.zIndex = '9999';
  clone.style.opacity = '0';
  clone.style.pointerEvents = 'none';
  clone.style.userSelect = 'none';
  clone.style.transition = 'none';
  clone.style.overflow = 'visible';
  document.body.appendChild(clone);
  return clone;
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
  const cloneElement = cloneForCapture(targetElement);
  const captureTarget = cloneElement || targetElement;
  
  try {
    await captureAndDownload(captureTarget, filename, options);
  } finally {
    if (cloneElement && cloneElement.parentElement) {
      cloneElement.parentElement.removeChild(cloneElement);
    }
  }
}
