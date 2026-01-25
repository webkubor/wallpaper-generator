<template>
  <div class="settings-group">
    <div class="form-item">
      <label class="form-label">标题内容</label>
      <BaseInput v-model="titleSettings.text" />
    </div>
    
    <div class="form-item">
      <label class="form-label">字体</label>
      <div class="select-wrapper">
         <select v-model="titleSettings.fontFamily" class="base-select">
           <option v-for="font in fontOptions" :key="font.value" :value="font.value">{{ font.label }}</option>
         </select>
      </div>
    </div>
    
    <div class="form-item">
      <label class="form-label">颜色</label>
      <div class="color-picker-wrapper">
         <input type="color" v-model="titleSettings.color" class="base-color-input">
         <span class="color-value">{{ titleSettings.color }}</span>
      </div>
    </div>
    
    <div class="form-item">
      <label class="form-label">字体大小</label>
      <div class="slider-with-input">
        <BaseSlider v-model="titleSettings.fontSize" :min="12" :max="200" />
        <BaseInput type="number" v-model="titleSettings.fontSize" style="width: 60px" />
      </div>
    </div>
    
    <div class="form-item">
      <label class="form-label">排列方式</label>
      <div class="radio-group">
        <label 
          class="radio-btn" 
          :class="{ active: titleSettings.direction === 'horizontal' }"
        >
          <input type="radio" v-model="titleSettings.direction" value="horizontal" class="hidden-radio">
          横排
        </label>
        <label 
          class="radio-btn" 
          :class="{ active: titleSettings.direction === 'vertical' }"
        >
          <input type="radio" v-model="titleSettings.direction" value="vertical" class="hidden-radio">
          竖排
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWallpaper } from '@/composables/useWallpaper';
import BaseInput from '../base/BaseInput.vue';
import BaseSlider from '../base/BaseSlider.vue';

// 直接使用 useWallpaper 获取响应式数据
const { titleSettings, fontOptions } = useWallpaper();
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

/* Reusing Styles (Should be extracted to common css but for now scoped) */
/* Select */
.select-wrapper {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
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
  &:focus { background-color: #fff; border-color: var(--color-brand); }
}

/* Color Picker */
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: var(--border-radius-sm);
}
.base-color-input {
  width: 32px; height: 24px; padding: 0; border: none; background: none; cursor: pointer;
  &::-webkit-color-swatch-wrapper { padding: 0; }
  &::-webkit-color-swatch { border: 1px solid rgba(0,0,0,0.1); border-radius: 4px; }
}
.color-value { font-size: 13px; color: var(--text-secondary); font-family: monospace; }

/* Radio Group */
.radio-group {
  display: flex;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px;
  border-radius: var(--border-radius-sm);
  gap: 4px;
}
.hidden-radio { display: none; }
.radio-btn {
  flex: 1; text-align: center; padding: 6px 12px; font-size: 13px; cursor: pointer; border-radius: 4px; transition: all 0.2s; color: var(--text-secondary);
  &:hover { background-color: rgba(0, 0, 0, 0.03); }
  &.active { background-color: #fff; color: var(--color-brand-active); box-shadow: 0 1px 2px rgba(0,0,0,0.1); font-weight: 500; }
}

.slider-with-input {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>