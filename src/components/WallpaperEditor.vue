<script setup lang="ts">
import { computed, ref } from 'vue'
import { toPng } from 'html-to-image'
import { saveAs } from 'file-saver'
import { PhDownloadSimple, PhUpload } from '@phosphor-icons/vue'
import { useWallpaper, type Device } from '../composables/useWallpaper'

// 导入自定义UI组件（已集成Button、Card和Slider）
import { Input, Select, Switch, ColorPicker } from './ui'

// Button组件定义
interface ButtonProps {
  type?: 'primary' | 'success' | 'default';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const buttonProps = (props: ButtonProps = {}) => ({
  type: props.type || 'default',
  size: props.size || 'medium',
  disabled: props.disabled || false
});

const buttonClass = (props: ButtonProps = {}) => {
  const { type, size, disabled } = buttonProps(props);
  return [
    'custom-button',
    `custom-button--${type}`,
    `custom-button--${size}`,
    { 'custom-button--disabled': disabled }
  ];
};

// Slider组件定义
interface SliderProps {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
}

// 创建滑块组件的工具函数
const createSlider = (props: SliderProps, emit: (event: 'update:modelValue', value: number) => void) => {
  const sliderValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  const percentage = computed(() => {
    const min = props.min ?? 0;
    const max = props.max ?? 100;
    return ((sliderValue.value - min) / (max - min)) * 100;
  });

  const handleSliderClick = (event: MouseEvent) => {
    const slider = event.currentTarget as HTMLDivElement;
    const rect = slider.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const min = props.min ?? 0;
    const max = props.max ?? 100;
    const step = props.step ?? 1;
    const value = min + percentage * (max - min);
    
    // 根据step调整值
    const steppedValue = Math.round(value / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    sliderValue.value = parseFloat(clampedValue.toFixed(2));
  };

  return {
    sliderValue,
    percentage,
    handleSliderClick
  };
};

// 使用抽取的配置和状态
const {
  imageUrl,
  watermarkSettings,
  previewSettings,
  selectedDeviceInfo,
  selectedDevices,
  watermarkText,
  watermarkPositionStyle,
  handleDeviceToggle,
  deviceTypes,
  fontList,
  positionOptions
} = useWallpaper()

// 添加 isMobile 辅助函数
const isMobile = () => window.innerWidth <= 768

// 计算属性
const watermarkStyle = computed(() => ({
  fontSize: `${watermarkSettings.value.fontSize}px`,
  color: watermarkSettings.value.color,
  opacity: watermarkSettings.value.opacity,
  fontFamily: watermarkSettings.value.fontFamily,
  transform: `rotate(${watermarkSettings.value.rotation}deg)`
}))



// 处理图片上传
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        imageUrl.value = result
      }
    }
    reader.readAsDataURL(file)
  }
}


const getDeviceById = (id: string): Device | undefined => {
  return deviceTypes.find(device => device.id === id)
}


// 不再需要 getPreviewScale 函数

// 生成和导出壁纸
const generateImage = async (deviceId: string) => {
  const device = getDeviceById(deviceId)
  if (!device) return
  
  const previewElement = document.getElementById(`preview-${deviceId}`)
  if (!previewElement) return
  
  try {
    const dataUrl = await toPng(previewElement, { 
      quality: 0.95,
      pixelRatio: 2,
      skipAutoScale: true,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      }
    })
    
    saveAs(dataUrl, `wallpaper-${device.name}.png`)
  } catch (error) {
    console.error('Error generating image:', error)
  }
}

const generateCombinedImage = async () => {
  const combinedPreview = document.getElementById('combined-preview')
  if (!combinedPreview) return
  
  try {
    const dataUrl = await toPng(combinedPreview, { 
      quality: 0.95,
      pixelRatio: 2
    })
    
    saveAs(dataUrl, `combined-wallpaper-${new Date().getTime()}.png`)
    console.log('组合壁纸已成功生成并下载')
  } catch (error) {
    console.error('生成组合壁纸失败:', error)
  }
}
</script>

<template>
  <div class="wallpaper-editor">
    <div class="wallpaper-editor__row">
      <!-- 左侧控制面板 -->
      <div class="wallpaper-editor__col wallpaper-editor__col--control">
        <div class="custom-card settings-card">
          <div class="custom-card__header" v-if="true">
            <h3>壁纸设置</h3>
          </div>
          <div class="custom-card__body">
            <div class="card-header">
              <h3>图片上传</h3>
            </div>
          
            <div class="upload-container">
              <div class="image-uploader">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="file-input"
                />
                <label for="image-upload">
                  <button 
                    :class="buttonClass({type: 'primary', size: 'large'})" 
                  >
                    <span class="custom-button__icon">
                      <PhUpload />
                    </span>
                    <span class="custom-button__content">
                      选择图片
                    </span>
                  </button>
                </label>
              </div>
            </div>
          
            <div class="settings-section">
              <h3>水印设置</h3>
              
              <div class="form">
                <div class="form-item">
                  <label>水印文字</label>
                  <Input v-model="watermarkSettings.text" placeholder="输入水印文字" />
                </div>
                
                <div class="form-item">
                  <label>字体</label>
                  <Select 
                    v-model="watermarkSettings.fontFamily" 
                    placeholder="选择字体" 
                    class="full-width"
                    :options="fontList.map(font => ({
                      label: font.name,
                      value: font.value,
                      style: { fontFamily: font.value }
                    }))"
                  />
                </div>
                
                <div class="form-item">
                  <label>字体大小</label>
                  <Slider v-model="watermarkSettings.fontSize" :min="12" :max="72" />
                </div>
                
                <div class="form-item">
                  <label>颜色</label>
                  <ColorPicker v-model="watermarkSettings.color" />
                </div>
                
                <div class="form-item">
                  <label>透明度</label>
                  <Slider v-model="watermarkSettings.opacity" :min="0" :max="1" :step="0.1" />
                </div>
                
                <div class="form-item">
                  <label>位置</label>
                  <Select 
                    v-model="watermarkSettings.position" 
                    placeholder="选择位置" 
                    class="full-width"
                    :options="positionOptions" 
                  />
                </div>
                
                <div class="form-item">
                  <label>旋转角度</label>
                  <Slider v-model="watermarkSettings.rotation" :min="-45" :max="45" />
                </div>
                
                <div class="form-item">
                  <label>边距</label>
                  <Slider v-model="watermarkSettings.padding" :min="0" :max="50" />
                </div>
              </div>
            </div>
          
            <div class="settings-section">
              <h3>预览设置</h3>
              
              <div class="form">
                <div class="form-item">
                  <label>设备类型</label>
                  <div class="device-radio-group">
                    <div 
                      v-for="device in deviceTypes"
                      :key="device.id"
                      class="radio-item"
                      :class="{ 'radio-item--selected': previewSettings.selectedDevice === device.id }"
                      @click="previewSettings.selectedDevice = device.id"
                    >
                      {{ device.name }}
                    </div>
                  </div>
                </div>
                
                <div class="form-item">
                  <label>背景颜色</label>
                  <ColorPicker v-model="previewSettings.backgroundColor" />
                </div>
                
                <div class="form-item">
                  <label>显示设备边框</label>
                  <Switch v-model="previewSettings.showDeviceBorder" />
                </div>
                
                <div class="form-item">
                  <label>组合预览设备</label>
                  <div class="device-checkbox-group">
                    <div
                      v-for="device in previewSettings.devices"
                      :key="device.id"
                      class="checkbox-item"
                      :class="{ 'checkbox-item--selected': device.selected }"
                      @click="handleDeviceToggle(device)"
                    >
                      {{ device.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧预览区域 -->
      <div class="wallpaper-editor__col wallpaper-editor__col--preview">
        <div class="custom-card preview-card">
          <div class="custom-card__header" v-if="true">
            <div class="card-header">
              <h3>预览效果</h3>
              <button 
                :class="buttonClass({type: 'success', disabled: !imageUrl})" 
                @click="generateImage(previewSettings.selectedDevice)"
                :disabled="!imageUrl"
              >
                <span class="custom-button__icon">
                  <PhDownloadSimple />
                </span>
                <span class="custom-button__content">
                  生成壁纸
                </span>
              </button>
            </div>
          </div>
          
          <div class="custom-card__body">
            <div v-if="!previewSettings.showCombined" class="preview-container" id="preview-container">
              <div
                :id="`preview-${selectedDeviceInfo.id}`"
                class="device-preview"
                :style="{
                  width: isMobile() ? `${selectedDeviceInfo.width / 5}px` : `${selectedDeviceInfo.width / 4}px`,
                  height: isMobile() ? `${selectedDeviceInfo.height / 5}px` : `${selectedDeviceInfo.height / 4}px`,
                  backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }"
              >
                <div
                  v-if="imageUrl && watermarkText"
                  class="watermark"
                  :style="{ ...watermarkStyle, ...watermarkPositionStyle }"
                >
                  {{ watermarkText }}
                </div>
              </div>
              <div class="device-info">
                {{ selectedDeviceInfo.name }} ({{ selectedDeviceInfo.width }} x {{ selectedDeviceInfo.height }})
              </div>
            </div>
            
            <div v-else class="combined-preview" id="combined-preview">
              <template v-if="selectedDevices.length > 0">
                <div
                  v-for="device in selectedDevices"
                  :key="device.id"
                  class="device-preview-combined"
                >
                  <div
                    :id="`preview-${device.id}`"
                    class="device-preview"
                    :style="{
                      width: isMobile() ? `${device.width / 6}px` : `${device.width / 4}px`,
                      height: isMobile() ? `${device.height / 6}px` : `${device.height / 4}px`,
                      backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }"
                  >
                    <div
                      v-if="imageUrl && watermarkText"
                      class="watermark"
                      :style="{ ...watermarkStyle, ...watermarkPositionStyle }"
                    >
                      {{ watermarkText }}
                    </div>
                  </div>
                  <div class="device-info">
                    {{ device.name }} ({{ device.width }} x {{ device.height }})
                  </div>
                </div>
              </template>
              
              <div v-if="selectedDevices.length === 0" class="no-devices-selected">
                请在左侧选择至少一个设备进行组合预览
              </div>
              
              <div v-if="selectedDevices.length > 0" class="generate-combined">
                <button 
                  :class="buttonClass({type: 'success', disabled: !imageUrl})" 
                  @click="generateCombinedImage"
                  :disabled="!imageUrl"
                >
                  <span class="custom-button__icon">
                    <PhDownloadSimple />
                  </span>
                  <span class="custom-button__content">
                    生成组合壁纸
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use 'sass:color';

// 集成的Slider组件样式
.custom-slider {
  width: 100%;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-xs 0;
  
  &__track {
    position: relative;
    height: 8px;
    flex-grow: 1;
    background-color: rgba($color-border, 0.5);
    border-radius: $border-radius-lg;
    cursor: pointer;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  &__progress {
    position: absolute;
    height: 100%;
    background: linear-gradient(90deg, $color-primary, color.adjust($color-primary, $lightness: 15%));
    border-radius: $border-radius-lg;
    box-shadow: 0 0 4px rgba($color-primary, 0.4);
  }
  
  &__thumb {
    position: absolute;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, white, #f0f0f0);
    border: 2px solid $color-primary;
    border-radius: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: grab;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    z-index: 2;
    
    &:hover {
      box-shadow: 0 0 0 5px rgba($color-primary, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3);
      transform: translate(-50%, -50%) scale(1.1);
    }
    
    &:active {
      cursor: grabbing;
      transform: translate(-50%, -50%) scale(1.15);
      box-shadow: 0 0 0 6px rgba($color-primary, 0.3), 0 1px 4px rgba(0, 0, 0, 0.4);
    }
  }
  
  &__value {
    min-width: 40px;
    text-align: right;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    font-weight: 500;
    background-color: rgba($color-background-light, 0.8);
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
}

// 暗黑模式 Slider 样式
@media (prefers-color-scheme: dark) {
  .custom-slider {
    &__track {
      background-color: rgba($color-border-dark, 0.5);
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    
    &__progress {
      background: linear-gradient(90deg, $color-primary-light, color.adjust($color-primary-light, $lightness: 15%));
      box-shadow: 0 0 4px rgba($color-primary-light, 0.4);
    }
    
    &__thumb {
      background: linear-gradient(135deg, $color-background-dark, color.adjust($color-background-dark, $lightness: 5%));
      border-color: $color-primary-light;
      
      &:hover {
        box-shadow: 0 0 0 5px rgba($color-primary-light, 0.2), 0 1px 3px rgba(0, 0, 0, 0.4);
      }
      
      &:active {
        box-shadow: 0 0 0 6px rgba($color-primary-light, 0.3), 0 1px 4px rgba(0, 0, 0, 0.5);
      }
    }
    
    &__value {
      color: $color-text-secondary-dark;
      background-color: rgba($color-background-dark, 0.8);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  }
}

// 集成的Button组件样式
.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: $border-radius-md;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0 $spacing-lg;
  gap: $spacing-sm;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: translateX(0);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  &__icon {
    display: flex;
    align-items: center;
    font-size: 1.2em;
  }
  
  &--primary {
    background: linear-gradient(45deg, $primary-color, color.adjust($primary-color, $lightness: 10%));
    color: white;
    
    &:hover {
      background: linear-gradient(45deg, color.adjust($primary-color, $lightness: -5%), color.adjust($primary-color, $lightness: 5%));
      box-shadow: 0 4px 8px rgba($primary-color, 0.3);
    }
    
    &:active {
      background: linear-gradient(45deg, color.adjust($primary-color, $lightness: -10%), $primary-color);
    }
  }
  
  &--success {
    background: linear-gradient(45deg, $success-color, color.adjust($success-color, $lightness: 10%));
    color: white;
    
    &:hover {
      background: linear-gradient(45deg, color.adjust($success-color, $lightness: -5%), color.adjust($success-color, $lightness: 5%));
      box-shadow: 0 4px 8px rgba($success-color, 0.3);
    }
    
    &:active {
      background: linear-gradient(45deg, color.adjust($success-color, $lightness: -10%), $success-color);
    }
  }
  
  &--default {
    background: linear-gradient(to bottom, $background-color-light, color.adjust($background-color-light, $lightness: -3%));
    color: $text-primary;
    border: 1px solid $border-color;
    
    &:hover {
      background: linear-gradient(to bottom, color.adjust($background-color-light, $lightness: -2%), color.adjust($background-color-light, $lightness: -5%));
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    &:active {
      background: linear-gradient(to bottom, color.adjust($background-color-light, $lightness: -5%), color.adjust($background-color-light, $lightness: -2%));
    }
  }
  
  &--small {
    height: 32px;
    font-size: $font-size-sm;
    border-radius: $border-radius-sm;
  }
  
  &--medium {
    height: 40px;
    font-size: $font-size-base;
  }
  
  &--large {
    height: 48px;
    font-size: $font-size-lg;
    border-radius: $border-radius-lg;
    letter-spacing: 0.5px;
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
  }
}

// 暗黑模式Button样式
@media (prefers-color-scheme: dark) {
  .custom-button {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    &::before {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    &--primary {
      background: linear-gradient(45deg, $primary-color-dark, color.adjust($primary-color-dark, $lightness: 10%));
      
      &:hover {
        background: linear-gradient(45deg, color.adjust($primary-color-dark, $lightness: -5%), color.adjust($primary-color-dark, $lightness: 5%));
        box-shadow: 0 4px 12px rgba($primary-color-dark, 0.4);
      }
      
      &:active {
        background: linear-gradient(45deg, color.adjust($primary-color-dark, $lightness: -10%), $primary-color-dark);
      }
    }
    
    &--success {
      background: linear-gradient(45deg, $success-color, color.adjust($success-color, $lightness: 5%));
      
      &:hover {
        background: linear-gradient(45deg, color.adjust($success-color, $lightness: -5%), color.adjust($success-color, $lightness: 0%));
        box-shadow: 0 4px 12px rgba($success-color, 0.4);
      }
    }
    
    &--default {
      background: linear-gradient(to bottom, $background-color-dark, color.adjust($background-color-dark, $lightness: 3%));
      color: $text-primary-dark;
      border-color: $border-color-dark;
      
      &:hover {
        background: linear-gradient(to bottom, color.adjust($background-color-dark, $lightness: 5%), color.adjust($background-color-dark, $lightness: 2%));
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      &:active {
        background: linear-gradient(to bottom, color.adjust($background-color-dark, $lightness: 7%), color.adjust($background-color-dark, $lightness: 3%));
      }
    }
  }
}

// 集成的Card组件样式
.custom-card {
  background-color: $color-background-light;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-light;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba($color-border, 0.1);
  
  &:hover {
    box-shadow: $shadow-medium;
    transform: translateY(-2px);
  }
  
  &__header {
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $color-border;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, 
        rgba($color-primary, 0.7), 
        rgba($color-primary, 0.1), 
        transparent 70%);
    }
  }
  
  &__body {
    padding: $spacing-lg;
  }
}

// 暗黑模式Card样式
@media (prefers-color-scheme: dark) {
  .custom-card {
    background-color: $color-background-dark;
    box-shadow: $shadow-dark;
    border-color: rgba($color-border-dark, 0.2);
    
    &:hover {
      box-shadow: $shadow-dark-hover;
    }
    
    &__header {
      border-bottom-color: $color-border-dark;
      
      &::after {
        background: linear-gradient(90deg, 
          rgba($color-primary-light, 0.7), 
          rgba($color-primary-light, 0.1), 
          transparent 70%);
      }
    }
  }
}

.wallpaper-editor {
  padding: $spacing-lg 0;
  
  &__row {
    display: flex;
    gap: $spacing-lg;
    
    @media (max-width: $breakpoint-md) {
      flex-direction: column;
    }
  }
  
  &__col {
    &--control {
      flex: 1;
    }
    
    &--preview {
      flex: 1.5;
    }
  }
  
  .control-panel {
    margin-bottom: $spacing-md;
    border-radius: $border-radius-lg;
    overflow: hidden;
    
    @media (max-width: $breakpoint-md) {
      margin-bottom: $spacing-lg;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md 0;
    
    h3 {
      margin: 0;
      font-size: $font-size-lg;
      font-weight: 600;
      color: $color-primary;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 40px;
        height: 3px;
        background: linear-gradient(90deg, $color-primary, color.adjust($color-primary, $lightness: 15%));
        border-radius: $border-radius-sm;
      }
    }
  }
  
  .upload-container {
    display: flex;
    justify-content: center;
    margin: $spacing-lg 0;
    
    .image-uploader {
      width: 100%;
      
      .file-input {
        display: none;
      }
      
      label {
        display: block;
        width: 100%;
        cursor: pointer;
      }
    }
  }
  
  .settings-section {
    margin-bottom: $spacing-lg;
    padding: $spacing-md;
    background-color: color.adjust($color-background-light, $lightness: -2%);
    border-radius: $border-radius-md;
    
    h3 {
      margin-bottom: $spacing-md;
      padding-bottom: $spacing-sm;
      border-bottom: 1px solid $color-border;
      font-size: $font-size-md;
      color: $color-text-primary;
      font-weight: 600;
    }
  }
  
  .form {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }
  
  .form-item {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    
    label {
      font-size: $font-size-sm;
      font-weight: 500;
      color: $color-text-secondary;
    }
  }
  
  .full-width {
    width: 100%;
  }
  
  .device-radio-group,
  .device-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    
    .radio-item,
    .checkbox-item {
      padding: $spacing-xs $spacing-sm;
      border: 1px solid $color-border;
      border-radius: $border-radius-sm;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: $font-size-sm;
      
      &--selected {
        background: linear-gradient(45deg, $color-primary, color.adjust($color-primary, $lightness: 15%));
        color: white;
        border-color: transparent;
        box-shadow: 0 2px 8px rgba($color-primary, 0.4);
        transform: translateY(-1px);
      }
      
      &:hover:not(.radio-item--selected):not(.checkbox-item--selected) {
        border-color: $color-primary;
        background-color: rgba($color-primary, 0.05);
      }
    }
    
    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
    }
  }
  
  .preview-card {
    height: 100%;
    border-radius: $border-radius-lg;
    overflow: hidden;
    
    @media (max-width: $breakpoint-md) {
      margin-top: $spacing-md;
    }
  }
  
  .preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-lg;
    min-height: 400px;
    background-color: color.adjust($color-background-light, $lightness: -2%);
    border-radius: $border-radius-md;
    
    @media (max-width: $breakpoint-sm) {
      padding: $spacing-md;
      min-height: 300px;
    }
  }
  
  .device-preview {
    position: relative;
    border: 1px solid $color-border;
    border-radius: $border-radius-md;
    overflow: hidden;
    box-shadow: $shadow-light;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: $shadow-medium;
      transform: scale(1.02);
    }
  }
  
  .device-info {
    margin-top: $spacing-sm;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    font-weight: 500;
  }
  
  .watermark {
    position: absolute;
    white-space: pre-wrap;
    word-break: break-word;
    max-width: 80%;
    text-align: center;
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .combined-preview {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    background-color: color.adjust($color-background-light, $lightness: -2%);
    border-radius: $border-radius-md;
    
    @media (max-width: $breakpoint-sm) {
      gap: $spacing-sm;
      padding: $spacing-md;
    }
  }
  
  .device-preview-combined {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: $spacing-md;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
  
  .no-devices-selected {
    padding: $spacing-xl;
    text-align: center;
    color: $color-text-secondary;
    font-size: $font-size-md;
    background-color: rgba($color-border, 0.1);
    border-radius: $border-radius-md;
    border: 1px dashed $color-border;
    
    @media (max-width: $breakpoint-sm) {
      padding: $spacing-lg;
    }
  }
  
  .generate-combined {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: $spacing-lg;
  }
}

// 暗黑模式样式增强
@media (prefers-color-scheme: dark) {
  .wallpaper-editor {
    .card-header h3 {
      color: $color-primary-light;
      
      &::after {
        background: linear-gradient(90deg, $color-primary-light, color.adjust($color-primary-light, $lightness: 15%));
      }
    }
    
    .settings-section {
      background-color: color.adjust($color-background-dark, $lightness: 3%);
      
      h3 {
        border-bottom-color: $color-border-dark;
        color: $color-text-primary-dark;
      }
    }
    
    .form-item label {
      color: $color-text-secondary-dark;
    }
    
    .preview-container,
    .combined-preview {
      background-color: color.adjust($color-background-dark, $lightness: 3%);
    }
    
    .device-preview {
      border-color: $color-border-dark;
      box-shadow: $shadow-dark;
      
      &:hover {
        box-shadow: $shadow-dark-hover;
      }
    }
    
    .device-info {
      color: $color-text-secondary-dark;
    }
    
    .no-devices-selected {
      color: $color-text-secondary-dark;
      background-color: rgba($color-border-dark, 0.1);
      border-color: $color-border-dark;
    }
    
    .radio-item,
    .checkbox-item {
      &--selected {
        background: linear-gradient(45deg, $color-primary-light, color.adjust($color-primary-light, $lightness: 15%));
        box-shadow: 0 2px 8px rgba($color-primary-light, 0.4);
      }
      
      &:hover:not(.radio-item--selected):not(.checkbox-item--selected) {
        border-color: $color-primary-light;
        background-color: rgba($color-primary-light, 0.05);
      }
    }
  }
}
</style>
