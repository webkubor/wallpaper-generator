import html2canvas from 'html2canvas';
import dayjs from 'dayjs';

/**
 * HTML元素截图选项
 */
export interface CaptureOptions {
  backgroundColor?: string | null;
  scale?: number;
  useCORS?: boolean;
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
 * 生成带时间戳的文件名
 */
export function generateTimestampFilename(prefix: string = 'capture', extension: string = 'png'): string {
  return `${prefix}-${dayjs().format('YYYYMMDD-HHmmss')}.${extension}`;
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
    : (previewArea.querySelector('.wallpaper-content') || 
       previewArea.querySelector('.preview-canvas') || 
       previewArea) as HTMLElement;
  
  const options: CaptureOptions = {
    backgroundColor: downloadOption === 'withBackground' ? null : 'transparent',
    scale: 2,
    useCORS: true
  };
  
  await captureAndDownload(targetElement, filename, options);
}
