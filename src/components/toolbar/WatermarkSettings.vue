<template>
  <div class="settings-group">
    <div class="form-item">
      <label class="form-label">水印类型</label>
      <div class="radio-group">
        <label 
          class="radio-btn" 
          :class="{ active: watermarkSettings.type === 'text' }"
        >
          <input type="radio" v-model="watermarkSettings.type" value="text" class="hidden-radio">
          文字
        </label>
        <label 
          class="radio-btn" 
          :class="{ active: watermarkSettings.type === 'image' }"
        >
          <input type="radio" v-model="watermarkSettings.type" value="image" class="hidden-radio">
          图片
        </label>
      </div>
    </div>

    <template v-if="watermarkSettings.type === 'text'">
      <div class="form-item">
        <label class="form-label">水印文字</label>
        <BaseInput v-model="watermarkSettings.text" />
      </div>
      
      <div class="form-item">
        <label class="form-label">字体</label>
        <div class="select-wrapper">
           <select v-model="watermarkSettings.fontFamily" class="base-select">
             <option v-for="font in fontOptions" :key="font.value" :value="font.value">{{ font.label }}</option>
           </select>
        </div>
      </div>
      
      <div class="form-item">
        <label class="form-label">颜色</label>
        <div class="color-picker-wrapper">
           <input type="color" v-model="watermarkSettings.color" class="base-color-input">
           <span class="color-value">{{ watermarkSettings.color }}</span>
        </div>
      </div>

      <div class="form-item">
        <label class="form-label">大小</label>
        <BaseSlider v-model="watermarkSettings.fontSize" :min="12" :max="200" />
      </div>
    </template>

    <template v-if="watermarkSettings.type === 'image'">
       <div class="form-item">
        <label class="form-label">上传图片</label>
        <FileUploader @select="handleFileSelect" class="full-width-uploader" />
      </div>
      <div class="form-item">
        <label class="form-label">大小</label>
        <BaseSlider v-model="watermarkSettings.fontSize" :min="20" :max="800" />
      </div>
    </template>

    <div class="form-item">
      <label class="form-label">透明度</label>
      <BaseSlider v-model="watermarkSettings.opacity" :min="0" :max="1" :step="0.1" />
    </div>

    <div class="form-item">
      <label class="form-label">旋转</label>
      <BaseSlider v-model="watermarkSettings.rotation" :min="-180" :max="180" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWallpaper } from '@/composables/useWallpaper';
import FileUploader from '../common/FileUploader.vue';
import BaseInput from '../base/BaseInput.vue';
import BaseSlider from '../base/BaseSlider.vue';

// 直接使用 useWallpaper 获取响应式数据
const { watermarkSettings, fontOptions } = useWallpaper();

const handleFileSelect = ({ url }: { url: string }) => {
  watermarkSettings.value.imageUrl = url;
};
</script>

<style scoped lang="scss">
.settings-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Radio Group Styles */
.radio-group {
  display: flex;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px;
  border-radius: var(--border-radius-sm);
  gap: 4px;
}

.hidden-radio {
  display: none;
}

.radio-btn {
  flex: 1;
  text-align: center;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  color: var(--text-secondary);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  
  &.active {
    background-color: #fff;
    color: var(--color-brand-active);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    font-weight: 500;
  }
}

/* Select Styles */
.select-wrapper {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--text-secondary);
    pointer-events: none;
  }
}

.base-select {
  width: 100%;
  appearance: none;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-primary);
  background-color: rgba(0, 0, 0, 0.03);
  border: 1px solid transparent;
  border-radius: var(--border-radius-sm);
  outline: none;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:focus {
    background-color: #fff;
    border-color: var(--color-brand);
  }
}

/* Color Picker Styles */
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: var(--border-radius-sm);
}

.base-color-input {
  width: 32px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: none;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 4px;
  }
}

.color-value {
  font-size: 13px;
  color: var(--text-secondary);
  font-family: monospace;
}

:deep(.full-width-uploader) {
  width: 100%;
  
  .n-button, button {
    width: 100%;
    justify-content: center;
  }
}
</style>