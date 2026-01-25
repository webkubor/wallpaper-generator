<template>
  <div class="settings-group">
    <div class="form-item">
      <label class="form-label">背景类型</label>
      <div class="radio-group">
        <label 
          class="radio-btn" 
          :class="{ active: backgroundSettings.type === 'perspective' }"
        >
          <input type="radio" v-model="backgroundSettings.type" value="perspective" class="hidden-radio">
          透视
        </label>
        <label 
          class="radio-btn" 
          :class="{ active: backgroundSettings.type === 'color' }"
        >
          <input type="radio" v-model="backgroundSettings.type" value="color" class="hidden-radio">
          纯色
        </label>
      </div>
    </div>

    <div v-if="backgroundSettings.type === 'color'" class="form-item">
      <label class="form-label">背景颜色</label>
      <div class="color-picker-wrapper">
         <input type="color" v-model="backgroundSettings.color" class="base-color-input">
         <span class="color-value">{{ backgroundSettings.color }}</span>
      </div>
    </div>

    <div class="form-item">
      <label class="form-label">字体颜色</label>
      <div class="color-picker-wrapper">
         <input type="color" v-model="backgroundSettings.fontColor" class="base-color-input">
         <span class="color-value">{{ backgroundSettings.fontColor }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  backgroundSettings: any;
}

defineProps<Props>();
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
</style>