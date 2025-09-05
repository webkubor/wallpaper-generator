<template>
  <div class="xhs-page">
    <div class="toolbar">
      <n-input v-model:value="title" placeholder="输入封面主标题（大字）" size="large" />
      <div style="display: flex; align-items: center; gap: 8px;">
        <n-input v-model:value="subtitle" placeholder="输入副标题（可选）" style="flex: 1;" />
        <n-button 
          text 
          @click="showSubtitle = !showSubtitle"
          :style="{ color: showSubtitle ? '#18a058' : '#d03050' }"
        >
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path v-if="showSubtitle" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              <path v-else d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            </svg>
          </template>
        </n-button>
      </div>
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
          <span>光照效果</span>
          <n-switch v-model:value="showLightingEffect" />
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
          <div class="poster-subtitle" v-if="subtitle && showSubtitle" :style="subtitleStyle">
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
import { NInput, NSlider, NSwitch, NColorPicker, NSelect, NButton } from 'naive-ui';
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
const showLightingEffect = ref(true);

// 副标题显示控制
const showSubtitle = ref(true);

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
  fontFamily: `'${titleFontFamily.value}', sans-serif`,
  writingMode: titleVertical.value === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
  textOrientation: titleVertical.value === 'vertical' ? 'upright' : 'mixed',
  WebkitTextStroke: titleStroke.value ? `2px ${titleStrokeColor.value}` : '',
  textShadow: titleShadow.value,
  fontFeatureSettings: 'kern',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale'
}));

// 副标题样式
const subtitleStyle = computed((): CSSProperties => ({
  fontSize: `${subtitleSize.value}em`,
  fontFamily: `'${subtitleFontFamily.value}', sans-serif`,
  color: subtitleColor.value,
  writingMode: subtitleVertical.value === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
  textOrientation: subtitleVertical.value === 'vertical' ? 'upright' : 'mixed',
  textShadow: subtitleShadow.value,
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
    width: 100%;
    max-width: 600px; /* Limit max width for better readability */
    margin: 0 auto;
    
    h3 {
      text-align: center;
      margin-bottom: 16px;
      color: var(--text-color);
    }

    .template-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr); /* Two columns on PC */
      gap: 16px;
      max-height: 60vh;
      overflow-y: auto;
      margin-bottom: 16px;
      padding: 10px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr; /* Single column on mobile */
      }
    }
  }
}

.template-card {
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  background: rgba(255, 255, 255, 0.09);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent 70%);
    top: -60px;
    right: -60px;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &.template-card-selected {
    border-color: var(--primary-color);
    background: rgba(212, 175, 55, 0.1);
    color: var(--primary-color);
    box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);
    
    &::before {
      opacity: 1;
      background: linear-gradient(135deg, rgba(255, 235, 180, 0.25), transparent 70%);
    }
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
        background: linear-gradient(
          120deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.2) 30%,
          rgba(255, 255, 255, 0.05) 70%,
          transparent 100%
        );
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
