import { ref } from 'vue';

/**
 * 拖拽处理器接口
 */
export interface DragHandlers {
  onMouseDown: (e: MouseEvent) => void;
}

/**
 * 辅助线配置
 */
export interface GuideLineOptions {
  showGuideLines?: boolean;
  containerSelector?: string;
  lineColor?: string;
  lineWidth?: number;
}

/**
 * 创建增强的拖拽处理器，支持辅助线
 * @param onDrag 拖拽回调函数，接收新的 x, y 坐标
 * @param getCurrentOffset 获取当前偏移量的函数
 * @param options 辅助线配置选项
 * @returns 拖拽处理器对象
 */
export function createDragHandler(
  onDrag: (x: number, y: number) => void,
  getCurrentOffset: () => { x: number; y: number },
  options: GuideLineOptions = {}
): DragHandlers {
  let startPos = { x: 0, y: 0 };
  let initialOffset = { x: 0, y: 0 };
  let isDragging = false;
  let guideLines: { horizontal?: HTMLElement; vertical?: HTMLElement } = {};

  const {
    showGuideLines = true,
    containerSelector = '.preview-area',
    lineColor = '#f4d03f',
    lineWidth = 1
  } = options;

  /**
   * 创建辅助线元素
   */
  const createGuideLine = (type: 'horizontal' | 'vertical'): HTMLElement => {
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.backgroundColor = lineColor;
    line.style.pointerEvents = 'none';
    line.style.zIndex = '9999';
    line.style.opacity = '0.8';
    
    if (type === 'horizontal') {
      line.style.width = '100%';
      line.style.height = `${lineWidth}px`;
      line.style.left = '0';
    } else {
      line.style.height = '100%';
      line.style.width = `${lineWidth}px`;
      line.style.top = '0';
    }
    
    return line;
  };

  /**
   * 显示辅助线（固定在预览区域中心）
   */
  const showGuides = () => {
    if (!showGuideLines) return;
    
    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) return;

    // 移除已存在的辅助线
    hideGuides();

    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    // 创建水平辅助线（固定在容器中心）
    guideLines.horizontal = createGuideLine('horizontal');
    guideLines.horizontal.style.top = `${centerY}px`;
    guideLines.horizontal.style.borderTop = `${lineWidth}px dashed ${lineColor}`;
    guideLines.horizontal.style.backgroundColor = 'transparent';
    container.appendChild(guideLines.horizontal);

    // 创建垂直辅助线（固定在容器中心）
    guideLines.vertical = createGuideLine('vertical');
    guideLines.vertical.style.left = `${centerX}px`;
    guideLines.vertical.style.borderLeft = `${lineWidth}px dashed ${lineColor}`;
    guideLines.vertical.style.backgroundColor = 'transparent';
    container.appendChild(guideLines.vertical);
  };

  /**
   * 隐藏辅助线
   */
  const hideGuides = () => {
    if (guideLines.horizontal) {
      guideLines.horizontal.remove();
      guideLines.horizontal = undefined;
    }
    if (guideLines.vertical) {
      guideLines.vertical.remove();
      guideLines.vertical = undefined;
    }
  };

  /**
   * 鼠标按下事件处理
   */
  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    isDragging = true;
    startPos = { x: e.clientX, y: e.clientY };
    initialOffset = getCurrentOffset();
    
    // 开始拖拽时显示辅助线
    if (showGuideLines) {
      showGuides();
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      const newX = initialOffset.x + deltaX;
      const newY = initialOffset.y + deltaY;

      onDrag(newX, newY);
    };

    const onMouseUp = () => {
      isDragging = false;
      hideGuides();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return { onMouseDown };
}

/**
 * 创建响应式拖拽状态
 */
export function useDragState() {
  const isDragging = ref(false);
  const dragPosition = ref({ x: 0, y: 0 });

  const createReactiveDragHandler = (
    onDrag?: (x: number, y: number) => void,
    options?: GuideLineOptions
  ): DragHandlers => {
    return createDragHandler(
      (x, y) => {
        dragPosition.value = { x, y };
        onDrag?.(x, y);
      },
      () => dragPosition.value,
      options
    );
  };

  return {
    isDragging,
    dragPosition,
    createReactiveDragHandler
  };
}

/**
 * 简化的拖拽处理器，不带辅助线
 */
export function createSimpleDragHandler(
  onDrag: (x: number, y: number) => void,
  getCurrentOffset: () => { x: number; y: number }
): DragHandlers {
  return createDragHandler(onDrag, getCurrentOffset, { showGuideLines: false });
}
