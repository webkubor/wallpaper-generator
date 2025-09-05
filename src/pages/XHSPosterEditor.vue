<template>
  <div class="xhs-page">
    <div class="toolbar">
      <n-input v-model:value="title" placeholder="输入封面主标题（大字）" size="large" />
      <n-input v-model:value="subtitle" placeholder="输入副标题（可选）" />
      <div class="controls">
        <div class="control-item">
          <span>背景色</span>
          <n-color-picker v-model:value="mainColor" :modes="['hex']" size="small"/>
        </div>
      </div>
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
          <div class="poster-title" v-if="title" :style="titleStyle">
            {{ title }}
          </div>
          <div class="poster-subtitle" v-if="subtitle" :style="subtitleStyle">
            {{ subtitle }}
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
import { ref, computed, onMounted } from 'vue';
import type { CSSProperties } from 'vue';
import { NInput, NSlider, NSwitch, NColorPicker, NSelect } from 'naive-ui';
import { captureAndDownload } from '@/utils/captureUtils';
import { formatFileTimestamp } from '@/utils/time';
import DesignTips from '@/components/common/DesignTips.vue';
import posterConfig from './poster-templates.json';
import type { Template } from './types';


const title = ref('江湖秘辛');
const subtitle = ref('金庸笔下最隐秘的伏笔');
const textColor = ref('#000000');
const mainColor = ref('#1A1A1A');
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
const titleStrokeColor = ref('#DC143C');
const subtitleColor = ref('#FFFFFF');

// 文字阴影
const titleShadow = ref('0 3px 15px rgba(0,0,0,0.8)');
const subtitleShadow = ref('0 2px 8px rgba(0,0,0,0.6)');

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
  titleVertical.value = config.titleVertical ? 'vertical' : 'horizontal';
  subtitleVertical.value = config.subtitleVertical ? 'vertical' : 'horizontal';
  titleStroke.value = config.titleStroke;
  titleStrokeColor.value = config.titleStrokeColor;
  subtitleColor.value = config.subtitleColor;
  titleShadow.value = config.titleShadow;
  subtitleShadow.value = config.subtitleShadow;
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
const titleStyle = computed((): CSSProperties => ({
  color: textColor.value,
  fontSize: `${titleSize.value}em`,
  fontFamily: titleFontFamily.value,
  writingMode: titleVertical.value === 'vertical' ? 'vertical-lr' : 'horizontal-tb',
  textOrientation: titleVertical.value === 'vertical' ? 'upright' : 'mixed',
  WebkitTextStroke: titleStroke.value ? `2px ${titleStrokeColor.value}` : '',
  textShadow: titleShadow.value
}));

// 副标题样式
const subtitleStyle = computed((): CSSProperties => ({
  fontSize: `${subtitleSize.value}em`,
  fontFamily: subtitleFontFamily.value,
  color: subtitleColor.value,
  writingMode: subtitleVertical.value === 'vertical' ? 'vertical-lr' : 'horizontal-tb',
  textOrientation: subtitleVertical.value === 'vertical' ? 'upright' : 'mixed',
  textShadow: subtitleShadow.value
}));

const posterRef = ref<HTMLElement | null>(null);

// 海报样式，仅设置背景色
const posterStyle = computed(() => ({
  backgroundColor: mainColor.value,
}));



onMounted(() => {
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

  .template-section {
    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      max-height: 60vh;
      overflow-y: auto;
      margin-bottom: 16px;
      padding: 10px;
    }
  }
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
      border-color: var(--primary-color);
    }
    
    :deep(.n-card-header) {
      color: var(--primary-color);
    }
  }
}

.template-preview {
  width: 100%;
  height: 120px;
  border-radius: 6px;
  border: 1px solid var(--n-border-color);
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  position: relative;
  overflow: hidden;

  .template-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 2px;
  }

  .template-subtitle {
    font-size: 9px;
    opacity: 0.7;
  }
}

.template-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .template-name {
    font-weight: 600;
    font-size: 13px;
  }

  .template-desc {
    font-size: 11px;
    opacity: 0.6;
  }
}

.canvas-wrap {
  flex: 1;
  display: flex;
  gap: 40px;
  align-items: flex-start;
  
  .poster {
    width: min(50vw, 550px);
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

      .poster-title {
        font-weight: bold;
        text-align: center;
        line-height: 1.2;
        margin-bottom: 16px;
        word-wrap: break-word;
        word-break: break-all;
        max-width: 90%;
      }

      .poster-subtitle {
        text-align: center;
        line-height: 1.4;
        word-wrap: break-word;
        word-break: break-all;
        max-width: 90%;
      }
    }
  }

  .template-section {
    width: 300px;
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
