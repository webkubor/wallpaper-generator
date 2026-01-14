<template>
  <div class="xhs-page">
    <div class="toolbar">
      <div class="mode-switch">
        <n-radio-group v-model:value="mode" name="mode" size="large" style="width: 100%">
          <n-radio-button value="poster" style="width: 50%; text-align: center">
            大字报模式
          </n-radio-button>
          <n-radio-button value="list" style="width: 50%; text-align: center">
            清单引导模式
          </n-radio-button>
        </n-radio-group>
      </div>

      <n-input v-model:value="title" placeholder="输入封面主标题（大字）" size="large" />
      
      <div style="display: flex; align-items: center; gap: 8px;">
        <n-input
          v-model:value="subtitle"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          placeholder="输入副标题（可选，支持换行）"
          style="flex: 1;"
        />
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

      <!-- 列表内容编辑区域 -->
      <div v-if="mode === 'list'" class="controls list-controls">
        <div class="control-header">
          <span>列表内容</span>
          <n-button size="tiny" secondary type="primary" @click="addListItem" :disabled="listItems.length >= 6">
            + 添加
          </n-button>
        </div>
        <div v-for="(item, index) in listItems" :key="index" class="list-input-item">
          <span class="list-num">{{ index + 1 }}</span>
          <n-input v-model:value="listItems[index]" placeholder="输入内容" size="small" />
          <n-button text type="error" @click="removeListItem(index)" :disabled="listItems.length <= 1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </n-button>
        </div>
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
          <div class="poster-subtitle draggable" 
             v-if="subtitle && showSubtitle" 
             :style="subtitleStyle"
             @mousedown="subtitleDragHandler.onMouseDown" 
             v-html="formatSubtitle">
          </div>
          
          <!-- 清单列表容器 -->
          <div class="poster-list-container draggable"
             v-if="mode === 'list'"
             :style="listStyle"
             @mousedown="listDragHandler.onMouseDown">
            <div v-for="(item, index) in listItems" :key="index" class="list-item">
              <div class="item-num" :style="{ backgroundColor: textColor }">{{ index + 1 }}</div>
              <div class="item-content" :style="{ fontFamily: subtitleFontFamily, color: textColor }">
                {{ item }}
              </div>
            </div>
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { NInput, NSlider, NSwitch, NColorPicker, NSelect, NButton, NRadioGroup, NRadioButton } from 'naive-ui';
import { createDragHandler } from '@/utils/dragUtils';
import { captureAndDownload } from '@/utils/captureUtils';
import { formatFileTimestamp } from '@/utils/time';
import DesignTips from './components/DesignTips.vue';
import Pretemplates from './components/templates.vue';
import posterConfig from './components/poster-templates.json';
import type { Template } from './components/types';

// 模式定义
type PosterMode = 'poster' | 'list';
const mode = ref<PosterMode>('poster');
const listItems = ref([
  '第一步：确立核心主题',
  '第二步：提炼关键信息',
  '第三步：注重排版美感'
]);

const title = ref('江湖秘辛');
const subtitle = ref('金庸笔下最隐秘的伏笔');
const textColor = ref('#3f3a36');
const mainColor = ref('#c9c0b5');
const titleSize = ref(7.5);
const subtitleSize = ref(1.75);

// 字体选择
const selectedFont = ref('drizzle');
const customFont = ref('');
const subtitleFont = ref('SimSun');

// 文字排版
const titleVertical = ref('vertical');
const subtitleVertical = ref('horizontal');

// 文字描边
const titleStroke = ref(true);
const titleStrokeColor = ref('#b9968d');
const subtitleColor = ref('#f8f4ee');
const showLightingEffect = ref(true);

// 副标题显示控制
const showSubtitle = ref(true);
const formatSubtitle = computed(() => {
  return subtitle.value ? subtitle.value.replace(/\n/g, '<br>') : '';
});

// 列表项操作
const addListItem = () => {
  if (listItems.value.length < 6) {
    listItems.value.push('新增列表项内容');
    nextTick(updatePositions);
  }
};

const removeListItem = (index: number) => {
  if (listItems.value.length > 1) {
    listItems.value.splice(index, 1);
    nextTick(updatePositions);
  }
};

// 监听模式变化
watch(mode, (newMode) => {
  if (newMode === 'list') {
    // 切换到列表模式时的默认调整
    if (titleVertical.value === 'vertical') titleVertical.value = 'horizontal';
    if (titleSize.value > 5) titleSize.value = 4;
    if (subtitleSize.value > 2) subtitleSize.value = 1.5;
    // 重置位置
    nextTick(updatePositions);
  } else {
    // 切换回大字报模式
    titleSize.value = 7.5;
    nextTick(updatePositions);
  }
});

// 监听副标题显示状态变化
watch(showSubtitle, () => {
  nextTick(updatePositions);
});

// 文字阴影
const titleShadow = ref('0 10px 28px rgba(58, 50, 44, 0.28)');
const subtitleShadow = ref('0 6px 18px rgba(58, 50, 44, 0.22)');



// 预设模板

const fontOptions = ref<Array<{ label: string, value: string }>>(posterConfig.fontOptions);

const applyTemplate = (config) => {
  title.value = config.title;
  subtitle.value = config.subtitle;
  // 如果模板有副标题，确保显示状态为true
  showSubtitle.value = config.subtitle ? true : false;
  textColor.value = config.textColor;
  mainColor.value = config.mainColor;
  titleSize.value = config.titleSize;
  subtitleSize.value = config.subtitleSize;
  selectedFont.value = config.selectedFont;
  subtitleFont.value = config.subtitleFont;
  titleVertical.value = config.titleVertical ? 'vertical' : 'horizontal';
  subtitleVertical.value = config.subtitleVertical ? 'vertical' : 'horizontal';
  titleStroke.value = config.titleStroke;
  titleStrokeColor.value = config.titleStrokeColor;
  subtitleColor.value = config.subtitleColor;
  titleShadow.value = config.titleShadow;
  subtitleShadow.value = config.subtitleShadow;

  // 更新位置
  nextTick(() => {
    updatePositions();
    // 确保所有样式应用完成后再更新一次位置
    setTimeout(updatePositions, 50);
  });
};

// 计算主标题字体
const titleFontFamily = computed(() => {
  if (selectedFont.value === 'custom' && customFont.value) {
    return customFont.value;
  } else if (selectedFont.value === 'system') {
    return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  } else {
    return selectedFont.value;
  }
});

// 计算副标题字体
const subtitleFontFamily = computed(() => {
  if (subtitleFont.value === 'custom' && customFont.value) {
    return customFont.value;
  } else if (subtitleFont.value === 'system') {
    return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  } else {
    return subtitleFont.value;
  }
});

// 标题位置状态
const titlePos = ref({ x: 0, y: 0 });
const subtitlePos = ref({ x: 0, y: 0 });
const listPos = ref({ x: 0, y: 0 });


// 更新位置为居中
const updatePositions = () => {
  nextTick(() => {
    const poster = posterRef.value;
    if (!poster) return;

    const titleEl = document.querySelector('.poster-title') as HTMLElement;
    const subtitleEl = document.querySelector('.poster-subtitle') as HTMLElement;
    const listEl = document.querySelector('.poster-list-container') as HTMLElement;
    const posterRect = poster.getBoundingClientRect();

    if (mode.value === 'poster') {
      // 大字报模式：经典居中逻辑
      if (titleEl) {
        const titleRect = titleEl.getBoundingClientRect();
        titlePos.value = {
          x: (posterRect.width - titleRect.width) / 2,
          y: (posterRect.height - titleRect.height) / 3
        };
      }
      if (subtitleEl && showSubtitle.value) {
        const subtitleRect = subtitleEl.getBoundingClientRect();
        let newY = (posterRect.height - subtitleRect.height) * 2 / 3;
        if (titleEl) {
          const titleBottom = titlePos.value.y + titleEl.offsetHeight;
          const spacing = 30;
          newY = Math.max(newY, titleBottom + spacing);
        }
        subtitlePos.value = {
          x: (posterRect.width - subtitleRect.width) / 2,
          y: newY
        };
      }
    } else {
      // 清单模式：上中下布局
      let currentY = 60; // 顶部留白
      
      if (titleEl) {
        const titleRect = titleEl.getBoundingClientRect();
        titlePos.value = {
          x: (posterRect.width - titleRect.width) / 2,
          y: currentY
        };
        currentY += titleRect.height + 20;
      }
      
      if (subtitleEl && showSubtitle.value) {
        const subtitleRect = subtitleEl.getBoundingClientRect();
        subtitlePos.value = {
          x: (posterRect.width - subtitleRect.width) / 2,
          y: currentY
        };
        currentY += subtitleRect.height + 30;
      }

      if (listEl) {
         const listRect = listEl.getBoundingClientRect();
         listPos.value = {
           x: (posterRect.width - listRect.width) / 2,
           y: currentY
         };
      }
    }
  });
};

// 创建拖拽处理器
const titleDragHandler = createDragHandler(
  (x, y) => {
    titlePos.value = { x, y };
  },
  () => titlePos.value
);

const subtitleDragHandler = createDragHandler(
  (x, y) => {
    subtitlePos.value = { x, y };
  },
  () => subtitlePos.value
);

const listDragHandler = createDragHandler(
  (x, y) => {
    listPos.value = { x, y };
  },
  () => listPos.value
);

// 主标题样式
const titleStyle = computed((): CSSProperties => ({
  color: textColor.value,
  fontSize: `${titleSize.value}em`,
  fontFamily: titleFontFamily.value,
  writingMode: titleVertical.value === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
  textOrientation: titleVertical.value === 'vertical' ? 'upright' : 'mixed',
  WebkitTextStroke: titleStroke.value ? `2px ${titleStrokeColor.value}` : '',
  textShadow: titleShadow.value,
  position: 'absolute',
  left: `${titlePos.value.x}px`,
  top: `${titlePos.value.y}px`,
  cursor: 'move',
  userSelect: 'none',
  fontFeatureSettings: 'kern',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale'
}));

// 副标题样式
const subtitleStyle = computed((): CSSProperties => ({
  fontSize: `${subtitleSize.value}em`,
  fontFamily: subtitleFontFamily.value,
  color: subtitleColor.value,
  writingMode: subtitleVertical.value === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
  textOrientation: subtitleVertical.value === 'vertical' ? 'upright' : 'mixed',
  textShadow: subtitleShadow.value,
  position: 'absolute',
  left: `${subtitlePos.value.x}px`,
  top: `${subtitlePos.value.y}px`,
  cursor: 'move',
  userSelect: 'none',
  fontFeatureSettings: 'kern',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale'
}));

const posterRef = ref<HTMLElement | null>(null);

// 海报样式，仅设置背景色
const posterStyle = computed(() => ({
  backgroundColor: mainColor.value,
}));



onMounted(() => {
  // 监听来自Header的下载事件
  window.addEventListener('downloadPoster', downloadPoster);

  // 初始位置更新
  updatePositions();

  // 添加一个小的延迟，确保DOM完全渲染
  setTimeout(() => {
    updatePositions();
    // 再次更新位置，确保所有样式应用完成
    setTimeout(updatePositions, 50);
  }, 100);

  // 监听窗口大小变化，保持居中
  window.addEventListener('resize', updatePositions);
});

// 组件卸载时移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePositions);
});

const downloadPoster = async () => {
  if (!posterRef.value) return;
  try {
    // 使用主标题作为文件名，清理特殊字符
    const sanitizedTitle = title.value.replace(/[^\w\u4e00-\u9fa5]/g, '_') || 'xhs-cover';

    await captureAndDownload(posterRef.value, `${sanitizedTitle}-${formatFileTimestamp()}.png`, {
      backgroundColor: mainColor.value,
      scale: 2,
      useCORS: true
    });
    window.$message?.success('封面已下载');
  } catch (e) {
    console.error(e);
    window.$message?.error('下载失败');
  }
};
</script>

<style scoped lang="scss">
.xhs-page {
  --panel-surface: var(--morandi-surface);
  --panel-border: var(--morandi-line);
  --panel-shadow: rgba(71, 61, 53, 0.16);
  --panel-shadow-soft: rgba(71, 61, 53, 0.08);
  position: relative;
  display: flex;
  gap: 28px;
  padding: 28px 32px 40px;
  min-height: 100vh;
  justify-content: center;
  align-items: flex-start;
  color: var(--morandi-ink);
  background:
    radial-gradient(1000px 700px at 12% -10%, rgba(198, 162, 156, 0.26), transparent 65%),
    radial-gradient(900px 680px at 88% 8%, rgba(154, 166, 173, 0.26), transparent 60%),
    linear-gradient(180deg, #f6f2ec 0%, #f1ece5 55%, #ece6dd 100%);

  &::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image:
      repeating-linear-gradient(90deg, rgba(131, 120, 109, 0.08) 0 1px, transparent 1px 26px),
      repeating-linear-gradient(0deg, rgba(131, 120, 109, 0.06) 0 1px, transparent 1px 26px);
    opacity: 0.35;
    mix-blend-mode: multiply;
  }

  &::after {
    content: "";
    position: fixed;
    width: 420px;
    height: 420px;
    right: -140px;
    bottom: -160px;
    background: radial-gradient(circle, rgba(196, 178, 163, 0.45) 0%, rgba(196, 178, 163, 0) 70%);
    pointer-events: none;
    opacity: 0.75;
  }

  .toolbar {
    width: max(30vw, 360px);
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 22px;
    height: fit-content;
    background: linear-gradient(180deg, rgba(251, 247, 241, 0.96) 0%, rgba(247, 242, 235, 0.98) 100%);
    border-radius: 20px;
    border: 1px solid var(--panel-border);
    box-shadow: 0 24px 60px var(--panel-shadow), 0 8px 22px var(--panel-shadow-soft);
    backdrop-filter: blur(14px);
    position: sticky;
    top: 24px;
    z-index: 2;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 20px;
      background: radial-gradient(180px 120px at 20% 0%, rgba(154, 167, 161, 0.22), transparent 60%);
      pointer-events: none;
    }

    > * {
      position: relative;
      z-index: 1;
    }

    .controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 10px;
      align-items: start;
      padding: 10px 12px;
      border-radius: 14px;
      background: rgba(248, 244, 238, 0.72);
      border: 1px dashed rgba(163, 149, 138, 0.35);

      .control-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        min-height: 40px;
        padding: 8px 10px;
        border-radius: 12px;
        background: rgba(252, 249, 244, 0.9);
        border: 1px solid rgba(227, 219, 210, 0.9);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);

        span:first-child {
          min-width: 72px;
          font-weight: 600;
          color: var(--morandi-ink-muted);
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
  gap: 32px;
  align-items: flex-start;
  position: relative;
  z-index: 1;

  .poster {
    width: min(52vw, 860px);
    aspect-ratio: 3 / 4;
    border-radius: 18px;
    border: 1px solid rgba(122, 112, 103, 0.28);
    box-shadow: 0 32px 80px rgba(73, 63, 55, 0.22),
      0 12px 26px rgba(73, 63, 55, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
    background-image:
      radial-gradient(120% 120% at 10% 0%, rgba(255, 255, 255, 0.2), transparent 55%),
      radial-gradient(130% 130% at 90% 100%, rgba(255, 255, 255, 0.16), transparent 60%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image:
        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.06) 0 2px, transparent 2px 6px),
        repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.03) 0 1px, transparent 1px 5px);
      opacity: 0.3;
      pointer-events: none;
    }

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
            rgba(255, 255, 255, 0.35) 0%,
            rgba(255, 255, 255, 0.18) 30%,
            rgba(255, 255, 255, 0.06) 70%,
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
        letter-spacing: 0.02em;
      }

      .poster-subtitle {
        text-align: center;
        line-height: 1.4;
        word-wrap: break-word;
        word-break: break-all;
        max-width: 90%;
        z-index: 10;
        transition: transform 0.2s ease;
        letter-spacing: 0.03em;
      }
    }
  }

  .template-section {
    flex-shrink: 0;
  }
}

.value {
  color: var(--morandi-sage);
  font-weight: 600;
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
  opacity: 0.92;
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(73, 63, 55, 0.18);
}

.xhs-page :deep(.n-input) {
  background: rgba(251, 247, 241, 0.9);
  border-radius: 12px;
}

.xhs-page :deep(.n-input .n-input__border),
.xhs-page :deep(.n-input .n-input__state-border) {
  border-color: var(--morandi-line);
}

.xhs-page :deep(.n-input .n-input__state-border) {
  box-shadow: 0 0 0 1px rgba(154, 167, 161, 0.28);
}

.xhs-page :deep(.n-input .n-input__input-el),
.xhs-page :deep(.n-input .n-input__textarea-el) {
  color: var(--morandi-ink);
}

.xhs-page :deep(.n-input .n-input__placeholder),
.xhs-page :deep(.n-input .n-input__placeholder--show) {
  color: var(--morandi-ink-muted);
}

.xhs-page :deep(.n-base-selection) {
  border-radius: 12px;
  background: rgba(251, 247, 241, 0.9);
}

.xhs-page :deep(.n-base-selection .n-base-selection__border),
.xhs-page :deep(.n-base-selection .n-base-selection__state-border) {
  border-color: var(--morandi-line);
}

.xhs-page :deep(.n-base-selection .n-base-selection__state-border) {
  box-shadow: 0 0 0 1px rgba(154, 167, 161, 0.26);
}

.xhs-page :deep(.n-base-selection-label) {
  color: var(--morandi-ink);
}

.xhs-page :deep(.n-base-selection-placeholder) {
  color: var(--morandi-ink-muted);
}

.xhs-page :deep(.n-color-picker .n-color-picker-trigger) {
  border-radius: 12px;
  border-color: var(--morandi-line);
}

.xhs-page :deep(.n-switch__rail) {
  background: #e4ddd3;
}

.xhs-page :deep(.n-switch--active .n-switch__rail) {
  background: #9aa7a1;
}

.xhs-page :deep(.n-switch__button) {
  box-shadow: 0 2px 6px rgba(73, 63, 55, 0.18);
}

.xhs-page :deep(.n-slider-rail) {
  background: #e8e0d6;
}

.xhs-page :deep(.n-slider-fill) {
  background: #9aa7a1;
}

.xhs-page :deep(.n-slider-handle) {
  border-color: #9aa7a1;
  box-shadow: 0 0 0 4px rgba(154, 167, 161, 0.15);
}

.xhs-page :deep(.n-button--text) {
  border-radius: 999px;
  padding: 6px 12px;
  border: 1px solid var(--morandi-line);
  background: rgba(248, 244, 238, 0.7);
  color: var(--morandi-ink-muted);
}

.xhs-page :deep(.n-button--text:hover) {
  background: rgba(233, 226, 217, 0.9);
  color: var(--morandi-ink);
}

.poster-list-container {
  .list-item {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid rgba(255,255,255,0.4);
    
    .item-num {
      background: var(--morandi-ink);
      color: #fff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      flex-shrink: 0;
      margin-top: 2px;
    }
    
    .item-content {
      flex: 1;
      font-size: 1.4em;
      line-height: 1.4;
      color: var(--morandi-ink);
      font-weight: 500;
      text-align: left;
    }
  }
}

.mode-switch {
  margin-bottom: 16px;
  background: rgba(255,255,255,0.5);
  border-radius: 8px;
  padding: 4px;
}

.list-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .control-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    color: var(--morandi-ink-muted);
    margin-bottom: 4px;
  }
  
  .list-input-item {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .list-num {
      font-size: 12px;
      color: var(--morandi-ink-muted);
      width: 16px;
    }
  }
}

@media (max-width: 1024px) {
  .xhs-page {
    flex-direction: column;
    padding: 20px 18px 32px;
  }

  .toolbar {
    width: 100%;
    padding: 18px;
    position: static;
  }

  .controls {
    grid-template-columns: 1fr;
  }

  .canvas-wrap {
    flex-direction: column;
    align-items: center;
  }

  .poster {
    width: min(90vw, 720px);
  }
}
</style>
