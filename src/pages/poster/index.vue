<template>
  <div class="xhs-page">
    <PosterToolbar />
    <div class="canvas-wrap">
      <div class="poster" ref="posterRef" :style="posterStyle">
        <div class="poster-inner">
          <div class="poster-title draggable" v-if="title" :style="titleStyle"
            @mousedown="titleDragHandler.onMouseDown">
            {{ title }}
          </div>
          <div class="poster-subtitle draggable" v-if="subtitle && showSubtitle" :style="subtitleStyle"
            @mousedown="subtitleDragHandler.onMouseDown" v-html="formatSubtitle">
          </div>
        </div>
      </div>
      <div>
        <Pretemplates @apply-template="applyTemplate" />
        <DesignTips />
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { usePoster } from '@/hooks/usePoster'
import PosterToolbar from './components/PosterToolbar.vue'
import DesignTips from './components/DesignTips.vue'
import Pretemplates from './components/templates.vue'

const {
  // 基础状态
  title,
  subtitle,
  showSubtitle,
  formatSubtitle,
  showLightingEffect,
  
  // 样式计算
  titleStyle,
  subtitleStyle,
  posterStyle,
  
  // 引用
  posterRef,
  
  // 拖拽处理
  titleDragHandler,
  subtitleDragHandler,
  
  // 方法
  updatePositions,
  applyTemplate,
  downloadPoster
} = usePoster()

// 监听副标题显示状态变化
watch(showSubtitle, () => {
  nextTick(updatePositions)
})

onMounted(() => {
  // 监听来自Header的下载事件
  window.addEventListener('downloadPoster', downloadPoster)

  // 初始位置更新
  updatePositions()

  // 添加一个小的延迟，确保DOM完全渲染
  setTimeout(() => {
    updatePositions()
    // 再次更新位置，确保所有样式应用完成
    setTimeout(updatePositions, 50)
  }, 100)

  // 监听窗口大小变化，保持居中
  window.addEventListener('resize', updatePositions)
})

// 组件卸载时移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePositions)
})
</script>

<style scoped lang="scss">
.xhs-page {
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  justify-content: space-around;




}



.canvas-wrap {
  flex: 1;
  display: flex;
  gap: 40px;
  align-items: flex-start;

  .poster {
    width: min(50vw, 850px);
    aspect-ratio: 3 / 4;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12),
      0 8px 24px rgba(0, 0, 0, 0.08),
      0 2px 8px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;



    .poster-inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      position: relative;
      z-index: 1;

      &::before {
        content: "";
        position: absolute;
        top: -50%;
        left: -30%;
        width: 160%;
        height: 200%;
        background: linear-gradient(120deg,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.2) 30%,
            rgba(255, 255, 255, 0.05) 70%,
            transparent 100%);
        transform: rotate(-25deg);
        border-radius: 50%;
        pointer-events: none;
        opacity: v-bind('showLightingEffect ? 1 : 0');
        transition: opacity 0.3s ease;
      }

      .poster-title {
        font-weight: bold;
        text-align: center;
        line-height: 1.2;
        word-wrap: break-word;
        word-break: break-all;
        max-width: 90%;
        max-height: 85%;
        z-index: 10;
        transition: transform 0.2s ease;
      }

      .poster-subtitle {
        text-align: center;
        line-height: 1.4;
        word-wrap: break-word;
        word-break: break-all;
        max-width: 90%;
        z-index: 10;
        transition: transform 0.2s ease;
      }
    }
  }

  .template-section {
    flex-shrink: 0;
  }
}

.value {
  color: var(--primary-color);
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

.secondary-block {
  position: absolute;
  z-index: 1;
}

.accent-badge {
  position: absolute;
  z-index: 3;
}

.draggable {
  cursor: move;
  touch-action: none;
  user-select: none;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.draggable:active {
  cursor: grabbing;
  opacity: 0.9;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1024px) {
  .xhs-page {
    flex-direction: column;
    padding: 16px;
  }
}
</style>
