<template>
  <div class="xhs-page">
    <div class="toolbar">
      <n-input v-model:value="title" placeholder="输入封面主标题（大字）" size="large" />
      <n-input v-model:value="subtitle" placeholder="输入副标题（可选）" />

      <n-divider title-placement="left">背景</n-divider>
      <div class="controls">
        <div class="control-item">
          <span>背景色</span>
          <n-color-picker v-model:value="mainColor" :modes="['hex']" size="small"/>
        </div>
        <div class="control-item">
          <span>自动限制≤30%</span>
          <n-switch v-model:value="autoLimitText" />
        </div>
      </div>

      <n-divider title-placement="left">排版</n-divider>
      <div class="controls">
        <div class="control-item">
          <span>主标题字体</span>
          <n-select v-model:value="selectedFont" :options="fontOptions" style="width: 180px" />
        </div>
        <div class="control-item" v-if="selectedFont === 'custom'">
          <span>自定义字体</span>
          <n-input v-model:value="customFont" placeholder="输入字体名称" style="width: 160px" />
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
          <n-color-picker v-model:value="textColor" :modes="['hex']" size="small"/>
        </div>
        <div class="control-item">
          <span>副标题颜色</span>
          <n-color-picker v-model:value="subtitleColor" :modes="['hex']" size="small"/>
        </div>
        <div class="control-item">
          <span>主标题描边</span>
          <n-switch v-model:value="titleStroke" />
        </div>
        <div class="control-item" v-if="titleStroke">
          <span>描边颜色</span>
          <n-color-picker v-model:value="titleStrokeColor" :modes="['hex']" size="small"/>
        </div>
        <div class="control-item">
          <span>主标题字号</span>
          <n-slider v-model:value="titleSize" :min="60" :max="180" :step="2" style="width: 180px" />
          <span class="value">{{ titleSize }}px</span>
        </div>
        <div class="control-item">
          <span>副标题字号</span>
          <n-slider v-model:value="subtitleSize" :min="18" :max="60" :step="1" style="width: 180px" />
          <span class="value">{{ subtitleSize }}px</span>
        </div>
        <div class="control-item">
          <n-alert :type="textAreaPercent > 30 ? 'warning' : 'info'" :show-icon="false">
            文字占比：{{ textAreaPercent.toFixed(1) }}%
            <template v-if="textAreaPercent > 30">（建议≤30%，避免触发限流）</template>
          </n-alert>
        </div>
      </div>


    </div>

    
    <div class="canvas-wrap">
      <div class="preview-section">
        <div class="poster" ref="posterRef" :style="posterStyle">
          <div class="poster-inner">
            <div ref="titleRef" class="poster-title" v-if="title" :style="titleStyle">
              {{ title }}
            </div>
            <div ref="subtitleRef" class="poster-subtitle" v-if="subtitle" :style="subtitleStyle">
              {{ subtitle }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="template-section">
        <h3>预设模板</h3>
        <div class="template-grid">
          <div 
            v-for="template in templates" 
            :key="template.id"
            class="template-card"
            :class="{ 'template-card-selected': selectedTemplateId === template.id }"
            @click="applyTemplate(template)"
          >
            <div class="template-preview">
              <div class="template-title" :style="{ fontFamily: template.config.selectedFont }">
                {{ template.config.title }}
              </div>
              <div class="template-subtitle" :style="{ fontFamily: template.config.subtitleFont }">
                {{ template.config.subtitle }}
              </div>
            </div>
            <div class="template-info">
              <span class="template-name">{{ template.name }}</span>
              <span class="template-desc">{{ template.description }}</span>
            </div>
          </div>
        </div>
    <DesignTips />
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import type { CSSProperties } from 'vue';
import { NInput, NSlider, NSwitch, NColorPicker, NDivider, NSelect, NAlert } from 'naive-ui';
import { captureAndDownload } from '@/utils/captureUtils';
import { formatFileTimestamp } from '@/utils/time';
import DesignTips from '@/components/common/DesignTips.vue';
import posterConfig from './poster-templates.json';
import type { Template } from './types';


const title = ref('江湖秘辛');
const subtitle = ref('金庸笔下最隐秘的伏笔');
const textColor = ref('#000000');
const mainColor = ref('#1A1A1A');
const autoLimitText = ref(true);
const titleSize = ref(120);
const subtitleSize = ref(28);

// 字体选择
const selectedFont = ref('drizzle');
const customFont = ref('');
const subtitleFont = ref('SimSun');

// 文字排版
const titleVertical = ref(true);
const subtitleVertical = ref(false);

// 文字描边
const titleStroke = ref(true);
const titleStrokeColor = ref('#DC143C');
const subtitleColor = ref('#FFFFFF');

// 当前选中的模板
const selectedTemplateId = ref('wuxia');

// 预设模板

const templates = ref<Template[]>(posterConfig.templates);
const fontOptions = ref<Array<{label: string, value: string}>>(posterConfig.fontOptions);

const applyTemplate = (template: Template) => {
  const config = template.config;
  selectedTemplateId.value = template.id;
  title.value = config.title;
  subtitle.value = config.subtitle;
  textColor.value = config.textColor;
  mainColor.value = config.mainColor;
  titleSize.value = config.titleSize;
  subtitleSize.value = config.subtitleSize;
  selectedFont.value = config.selectedFont;
  subtitleFont.value = config.subtitleFont;
  titleVertical.value = config.titleVertical;
  subtitleVertical.value = config.subtitleVertical;
  titleStroke.value = config.titleStroke;
  titleStrokeColor.value = config.titleStrokeColor;
  subtitleColor.value = config.subtitleColor;
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

// 主标题样式
const titleStyle = computed((): CSSProperties => {
  const style: CSSProperties = {
    fontSize: titleSize.value + 'px',
    fontFamily: titleFontFamily.value,
    color: textColor.value,
    writingMode: titleVertical.value ? 'vertical-rl' : 'horizontal-tb',
    textOrientation: titleVertical.value ? 'upright' : 'mixed'
  };
  
  if (titleStroke.value) {
    style.textShadow = `2px 2px 0 ${titleStrokeColor.value}, -2px -2px 0 ${titleStrokeColor.value}, 2px -2px 0 ${titleStrokeColor.value}, -2px 2px 0 ${titleStrokeColor.value}`;
  }
  
  return style;
});

// 副标题样式
const subtitleStyle = computed((): CSSProperties => ({
  fontSize: subtitleSize.value + 'px',
  fontFamily: subtitleFontFamily.value,
  color: subtitleColor.value,
  writingMode: subtitleVertical.value ? 'vertical-rl' : 'horizontal-tb',
  textOrientation: subtitleVertical.value ? 'upright' : 'mixed'
}));

const posterRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const subtitleRef = ref<HTMLElement | null>(null);

// 海报样式，仅设置背景色
const posterStyle = computed(() => ({
  backgroundColor: mainColor.value,
  width: '100%',
  height: '100vh',
  overflow: 'auto',
}));

// 计算文字占比
const textAreaPercent = ref(0);
const calcTextArea = () => {
  if (!posterRef.value) return;
  const posterRect = posterRef.value.getBoundingClientRect();
  let area = 0;
  if (titleRef.value) {
    const r = titleRef.value.getBoundingClientRect();
    area += r.width * r.height;
  }
  if (subtitleRef.value) {
    const r = subtitleRef.value.getBoundingClientRect();
    area += r.width * r.height;
  }
  const percent = (area / (posterRect.width * posterRect.height)) * 100;
  textAreaPercent.value = percent;
  if (autoLimitText.value && percent > 30) {
    // 按比例缩小标题字号以回到阈值附近（粗略近似）
    const ratio = Math.sqrt(30 / percent);
    titleSize.value = Math.max(60, Math.floor(titleSize.value * ratio));
    subtitleSize.value = Math.max(18, Math.floor(subtitleSize.value * ratio));
    nextTick(() => calcTextArea());
  }
};

watch([
  title, subtitle, textColor, mainColor,
  titleSize, subtitleSize, selectedFont, customFont
], () => nextTick(calcTextArea));

onMounted(() => {
  nextTick(calcTextArea);
  
  // 监听来自Header的下载事件
  window.addEventListener('downloadPoster', downloadPoster);
});

const downloadPoster = async () => {
  if (!posterRef.value) return;
  try {
    await captureAndDownload(posterRef.value, `xhs-cover-${formatFileTimestamp()}.png`, {
      backgroundColor: null,
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
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
}
.toolbar {
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  height: fit-content;
}
.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  align-items: start;
}
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
}

.area-indicator {
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 4px !important;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  max-height: 60vh;
  overflow-y: auto;
  margin-bottom: 16px;
  padding:10px;
}

.template-card {
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;
  flex-shrink: 0;
  
  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.template-card-selected {
    border-color: var(--primary-color);
    background: rgba(212, 175, 55, 0.1);
    color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color);
    
    .template-preview {
      background-color: rgba(212, 175, 55, 0.05);
    }
    
    .template-name {
      color: var(--primary-color);
      font-weight: 700;
    }
    
    .template-desc {
      color: var(--primary-color);
      opacity: 0.8;
    }
  }
}

.template-preview {
  height: 60px;
  background: var(--n-card-color);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.template-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 2px;
}

.template-subtitle {
  font-size: 9px;
  opacity: 0.7;
}

.template-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.template-name {
  font-weight: 600;
  font-size: 13px;
}

.template-desc {
  font-size: 11px;
  opacity: 0.6;
}
.canvas-wrap {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}
.preview-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 0 0 auto;
}

.poster {
  height: min(60vh, 400px);
  min-height: 300px;
  aspect-ratio: 3 / 4;
  border-radius: 16px;
  border: 3px solid var(--primary-color);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 
              0 4px 16px rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  margin: 0 auto;
}

.template-section {
  flex: 1;
  min-width: 300px;
  
  h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
  }
}
.poster-inner {
  position: relative;
  z-index: 2;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.poster-title {
  font-size: 120px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: 2px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
}
.poster-subtitle {
  margin-top: 12px;
  font-size: 28px;
  opacity: 0.9;
  text-shadow: 0 1px 8px rgba(0,0,0,0.35);
}
.secondary-block {
  position: absolute;
  z-index: 1;
}
.accent-badge {
  position: absolute;
  z-index: 3;
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
