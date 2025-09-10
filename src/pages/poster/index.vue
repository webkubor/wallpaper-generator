<template>
  <div class="xhs-page">
    <div class="toolbar">
      <n-input v-model:value="title" placeholder="输入封面主标题（大字）" size="large" />
      <div style="display: flex; align-items: center; gap: 8px;">
        <n-input v-model:value="subtitle" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }"
          placeholder="输入副标题（可选，支持换行）" style="flex: 1;" />
        <n-button text @click="showSubtitle = !showSubtitle" :style="{ color: showSubtitle ? '#18a058' : '#d03050' }">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path v-if="showSubtitle"
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              <path v-else
                d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
            </svg>
          </template>
        </n-button>
      </div>
      <div class="controls">
        <div class="control-item">
          <span>背景色</span>
          <n-color-picker v-model:value="mainColor" :modes="['hex']" size="small" />
        </div>
      </div>
      <div class="controls">
        <div class="control-item">
          <span>主标题字体</span>
          <n-select v-model:value="selectedFont" :options="fontOptions" style="width: 180px" />
        </div>
        <div class="control-item">
          <span>副标题字体</span>
          <n-select v-model:value="subtitleFont" :options="fontOptions" style="width: 180px" />
        </div>
        <div class="control-item">
          <span>主标题排版</span>
          <n-switch v-model:value="titleVertical" checked-value="vertical" unchecked-value="horizontal">
            <template #checked>竖排</template>
            <template #unchecked>横排</template>
          </n-switch>
        </div>
        <div class="control-item">
          <span>副标题排版</span>
          <n-switch v-model:value="subtitleVertical" checked-value="vertical" unchecked-value="horizontal">
            <template #checked>竖排</template>
            <template #unchecked>横排</template>
          </n-switch>
        </div>
        <div class="control-item">
          <span>主标题颜色</span>
          <n-color-picker v-model:value="textColor" :modes="['hex']" size="small" />
        </div>
        <div class="control-item">
          <span>副标题颜色</span>
          <n-color-picker v-model:value="subtitleColor" :modes="['hex']" size="small" />
        </div>
        <div class="control-item">
          <span>光照效果</span>
          <n-switch v-model:value="showLightingEffect" />
        </div>
        <div class="control-item">
          <span>主标题描边</span>
          <n-switch v-model:value="titleStroke" />
        </div>
        <div class="control-item" v-if="titleStroke">
          <span>描边颜色</span>
          <n-color-picker v-model:value="titleStrokeColor" :modes="['hex']" size="small" />
        </div>
        <div class="control-item">
          <span>主标题字号</span>
          <n-slider v-model:value="titleSize" :min="3" :max="12" :step="0.25" style="width: 180px" />
          <span class="value">{{ titleSize }}em</span>
        </div>
        <div class="control-item">
          <span>副标题字号</span>
          <n-slider v-model:value="subtitleSize" :min="1" :max="4" :step="0.125" style="width: 180px" />
          <span class="value">{{ subtitleSize }}em</span>
        </div>
      </div>


    </div>


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
import { NInput, NSlider, NSwitch, NColorPicker, NSelect, NButton } from 'naive-ui'
import { usePoster } from '@/hooks/usePoster'
import DesignTips from './components/DesignTips.vue'
import Pretemplates from './components/templates.vue'

const {
  // 基础状态
  title,
  subtitle,
  showSubtitle,
  formatSubtitle,
  
  // 颜色配置
  textColor,
  mainColor,
  subtitleColor,
  titleStrokeColor,
  
  // 字体配置
  titleSize,
  subtitleSize,
  selectedFont,
  subtitleFont,
  fontOptions,
  
  // 排版配置
  titleVertical,
  subtitleVertical,
  
  // 效果配置
  titleStroke,
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

  .toolbar {
    width: max(30vw, 350px);
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    height: fit-content;

    .controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
      align-items: start;

      .control-item {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        min-height: 36px;

        span:first-child {
          min-width: 80px;
          font-weight: 500;
        }

        &.area-indicator {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 4px !important;
        }
      }
    }
  }


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

  .toolbar {
    width: 100%;
    padding: 16px;
  }

  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
