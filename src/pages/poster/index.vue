<template>
  <div class="xhs-page">
    <div class="toolbar">
      <!-- Mode Switch -->
      <div class="mode-switch">
        <div class="radio-group">
          <label class="radio-btn" :class="{ active: mode === 'poster' }">
            <input type="radio" v-model="mode" value="poster" class="hidden-radio">
            大字报模式
          </label>
          <label class="radio-btn" :class="{ active: mode === 'list' }">
            <input type="radio" v-model="mode" value="list" class="hidden-radio">
            清单引导模式
          </label>
        </div>
      </div>

      <BaseInput v-model="title" placeholder="输入封面主标题（大字）" />
      
      <div style="display: flex; align-items: center; gap: 8px;">
        <BaseInput
          v-model="subtitle"
          type="textarea"
          placeholder="输入副标题（可选，支持换行）"
          style="flex: 1;"
        />
        <BaseButton size="sm" variant="text" @click="showSubtitle = !showSubtitle" :style="{ color: showSubtitle ? '#18a058' : '#d03050' }">
          <template #icon>
            <Eye v-if="showSubtitle" :size="20" />
            <EyeSlash v-else :size="20" />
          </template>
        </BaseButton>
      </div>

      <!-- 列表内容编辑区域 -->
      <div v-if="mode === 'list'" class="controls list-controls">
        <div class="control-header">
          <span>列表内容</span>
          <BaseButton size="sm" variant="primary" @click="addListItem" :disabled="listItems.length >= 6">
            + 添加
          </BaseButton>
        </div>
        <div v-for="(item, index) in listItems" :key="index" class="list-input-item">
          <span class="list-num">{{ index + 1 }}</span>
          <BaseInput v-model="listItems[index]" placeholder="输入内容" />
          <BaseButton size="sm" variant="danger" class="remove-btn" @click="removeListItem(index)" :disabled="listItems.length <= 1">
            <template #icon><Trash :size="16" /></template>
          </BaseButton>
        </div>
      </div>

      <div class="controls">
        <div class="control-item">
          <span>背景色</span>
          <BaseColorPicker v-model="mainColor" />
        </div>
      </div>
      <div class="controls">
        <div class="control-item">
          <span>主标题字体</span>
          <BaseSelect v-model="selectedFont" :options="fontOptions" style="width: 180px" />
        </div>
        <div class="control-item">
          <span>副标题字体</span>
          <BaseSelect v-model="subtitleFont" :options="fontOptions" style="width: 180px" />
        </div>
        <div class="control-item">
          <span>主标题排版</span>
          <BaseSwitch :model-value="titleVertical === 'vertical'" @update:model-value="(val) => titleVertical = val ? 'vertical' : 'horizontal'">
            <template #default>{{ titleVertical === 'vertical' ? '竖排' : '横排' }}</template>
          </BaseSwitch>
        </div>
        <div class="control-item">
          <span>副标题排版</span>
          <BaseSwitch :model-value="subtitleVertical === 'vertical'" @update:model-value="(val) => subtitleVertical = val ? 'vertical' : 'horizontal'">
            <template #default>{{ subtitleVertical === 'vertical' ? '竖排' : '横排' }}</template>
          </BaseSwitch>
        </div>
        <div class="control-item">
          <span>主标题颜色</span>
          <BaseColorPicker v-model="textColor" />
        </div>
        <div class="control-item">
          <span>副标题颜色</span>
          <BaseColorPicker v-model="subtitleColor" />
        </div>
        <div class="control-item">
          <span>光照效果</span>
          <BaseSwitch v-model="showLightingEffect" />
        </div>
        <div class="control-item">
          <span>主标题描边</span>
          <BaseSwitch v-model="titleStroke" />
        </div>
        <div class="control-item" v-if="titleStroke">
          <span>描边颜色</span>
          <BaseColorPicker v-model="titleStrokeColor" />
        </div>
        <div class="control-item">
          <span>主标题字号</span>
          <BaseSlider v-model="titleSize" :min="3" :max="12" :step="0.25" style="width: 120px" />
          <span class="value">{{ titleSize }}em</span>
        </div>
        <div class="control-item">
          <span>副标题字号</span>
          <BaseSlider v-model="subtitleSize" :min="1" :max="4" :step="0.125" style="width: 120px" />
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
import { createDragHandler } from '@/utils/dragUtils';
import { captureAndDownload } from '@/utils/captureUtils';
import { formatFileTimestamp } from '@/utils/time';
import DesignTips from './components/DesignTips.vue';
import Pretemplates from './components/templates.vue';
import posterConfig from './components/poster-templates.json';
import { PhTrash as Trash, PhEye as Eye, PhEyeSlash as EyeSlash } from "@phosphor-icons/vue";

// Base Components
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import BaseColorPicker from '@/components/base/BaseColorPicker.vue';
import BaseSwitch from '@/components/base/BaseSwitch.vue';
import BaseSlider from '@/components/base/BaseSlider.vue';

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

const applyTemplate = (config: any) => {
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

// List styles computed prop was missing in original? Or implicit.
// Adding basic list style
const listStyle = computed((): CSSProperties => ({
  position: 'absolute',
  left: `${listPos.value.x}px`,
  top: `${listPos.value.y}px`,
  cursor: 'move',
  width: '80%', // Limit width
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
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
    const sanitizedTitle = title.value.replace(/[^一-龥\w]/g, '_') || 'xhs-cover';

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
  --panel-surface: var(--color-morandi-surface);
  --panel-border: var(--color-morandi-line);
  --panel-shadow: rgba(71, 61, 53, 0.16);
  --panel-shadow-soft: rgba(71, 61, 53, 0.08);
  position: relative;
  display: flex;
  gap: 28px;
  padding: 28px 32px 40px;
  min-height: 100vh;
  justify-content: center;
  align-items: flex-start;
  color: var(--color-morandi-ink);
  background:
    radial-gradient(1000px 700px at 12% -10%, rgba(198, 162, 156, 0.26), transparent 65%),
    radial-gradient(900px 680px at 88% 8%, rgba(154, 166, 173, 0.26), transparent 60%),
    linear-gradient(180deg, #f6f2ec 0%, #f1ece5 55%, #ece6dd 100%);

  /* Background pattern omitted for brevity, keeping existing */
}

/* Radio Group for Mode Switch */
.radio-group {
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 4px;
  border-radius: var(--border-radius-md);
  gap: 4px;
  width: 100%;
}

.hidden-radio {
  display: none;
}

.radio-btn {
  flex: 1;
  text-align: center;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;
  color: var(--text-secondary);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  &.active {
    background-color: #fff;
    color: var(--color-brand-active);
    box-shadow: var(--shadow-sm);
    font-weight: 600;
  }
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
        color: var(--color-morandi-ink-muted);
      }
    }
  }
}

.mode-switch {
  margin-bottom: 16px;
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
    color: var(--color-morandi-ink-muted);
    margin-bottom: 4px;
  }
  
  .list-input-item {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .list-num {
      font-size: 12px;
      color: var(--color-morandi-ink-muted);
      width: 16px;
    }
    
    .remove-btn {
      padding: 0;
      width: 28px;
      height: 28px;
    }
  }
}

.value {
  color: var(--color-morandi-sage);
  font-weight: 600;
  min-width: 40px;
  text-align: right;
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
        inset: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          105deg,
          transparent 30%,
          rgba(255, 255, 255, 0.05) 45%,
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0.05) 55%,
          transparent 70%
        );
        transform: rotate(-30deg);
        pointer-events: none;
        opacity: v-bind('showLightingEffect ? 0.9 : 0');
        transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        mix-blend-mode: soft-light;
        filter: blur(15px);
        z-index: 20;
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
      background: var(--color-morandi-ink);
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
      color: var(--color-morandi-ink);
      font-weight: 500;
      text-align: left;
    }
  }
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