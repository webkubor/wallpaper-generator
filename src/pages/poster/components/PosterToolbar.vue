<template>
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
          <span>背景设置</span>
          <n-select v-model:value="backgroundType" :options="backgroundTypeOptions" style="width: 120px" />
        </div>
        <div class="control-item" v-if="backgroundType === 'solid'">
          <span>背景色</span>
          <n-color-picker v-model:value="mainColor" :modes="['hex']" size="small" />
        </div>
        <div class="control-item" v-if="backgroundType === 'gradient'">
          <span>渐变起始</span>
          <n-color-picker v-model:value="gradientStart" :modes="['hex']" size="small" />
        </div>
        <div class="control-item" v-if="backgroundType === 'gradient'">
          <span>渐变结束</span>
          <n-color-picker v-model:value="gradientEnd" :modes="['hex']" size="small" />
        </div>
        <div class="control-item" v-if="backgroundType === 'gradient'">
          <span>渐变角度</span>
          <n-slider v-model:value="gradientAngle" :min="0" :max="360" :step="15" style="width: 120px" />
          <span class="value">{{ gradientAngle }}°</span>
        </div>
        <div class="control-item" v-if="backgroundType === 'image'">
          <span>背景图片</span>
          <n-upload
            :show-file-list="false"
            accept="image/*"
            @change="handleBackgroundUpload"
          >
            <n-button size="small">上传图片</n-button>
          </n-upload>
        </div>
        <div class="control-item" v-if="backgroundType === 'image' && backgroundImage">
          <span>图片模式</span>
          <n-select v-model:value="backgroundSize" :options="backgroundSizeOptions" style="width: 120px" />
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
</template>

<script setup lang="ts">
import { NInput, NSlider, NSwitch, NColorPicker, NSelect, NButton, NUpload } from 'naive-ui'
import { usePoster } from '@/hooks/usePoster'

const {
  // 基础状态
  title,
  subtitle,
  showSubtitle,
  
  // 背景配置
  backgroundType,
  mainColor,
  gradientStart,
  gradientEnd,
  gradientAngle,
  backgroundImage,
  backgroundSize,
  backgroundTypeOptions,
  backgroundSizeOptions,
  handleBackgroundUpload,
  
  // 颜色配置
  textColor,
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
} = usePoster()
</script>

<style scoped lang="scss">
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

.value {
  color: var(--primary-color);
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

@media (max-width: 1024px) {
  .toolbar {
    width: 100%;
    padding: 16px;
  }

  .controls {
    grid-template-columns: 1fr;
  }
}
</style>