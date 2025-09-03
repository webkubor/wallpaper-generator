/**
 * 拖拽工具函数
 */
export interface DragHandlers {
  onMouseDown: (e: MouseEvent) => void;
}

/**
 * 创建拖拽处理器
 * @param onDrag 拖拽回调函数，接收新的 x, y 坐标
 * @param getCurrentOffset 获取当前偏移量的函数
 * @returns 拖拽处理器对象
 */
export function createDragHandler(
  onDrag: (x: number, y: number) => void,
  getCurrentOffset: () => { x: number; y: number }
): DragHandlers {
  let startPos = { x: 0, y: 0 };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const currentOffset = getCurrentOffset();
    startPos = { 
      x: e.clientX - currentOffset.x, 
      y: e.clientY - currentOffset.y 
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      onDrag(newX, newY);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return {
    onMouseDown: handleMouseDown
  };
}

/**
 * 下载工具函数
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 图片处理工具函数
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 文件类型检查
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
