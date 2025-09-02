<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1
});

const emit = defineEmits(['update:modelValue']);

const sliderValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const percentage = computed(() => {
  return ((sliderValue.value - props.min) / (props.max - props.min)) * 100;
});

const handleSliderClick = (event: MouseEvent) => {
  const slider = event.currentTarget as HTMLDivElement;
  const rect = slider.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const percentage = offsetX / rect.width;
  const value = props.min + percentage * (props.max - props.min);
  
  // 根据step调整值
  const steppedValue = Math.round(value / props.step) * props.step;
  const clampedValue = Math.max(props.min, Math.min(props.max, steppedValue));
  
  sliderValue.value = parseFloat(clampedValue.toFixed(2));
};
</script>

<template>
  <div class="custom-slider">
    <div class="custom-slider__track" @click="handleSliderClick">
      <div 
        class="custom-slider__progress" 
        :style="{ width: `${percentage}%` }"
      ></div>
      <div 
        class="custom-slider__thumb" 
        :style="{ left: `${percentage}%` }"
      ></div>
    </div>
    <div class="custom-slider__value">{{ sliderValue }}</div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

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

// 暗黑模式
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
</style>
