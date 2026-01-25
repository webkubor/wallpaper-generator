<template>
  <div class="base-slider-container">
    <div class="base-slider-wrapper">
      <input 
        type="range"
        class="base-slider"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="handleInput"
        :style="sliderStyle"
      />
    </div>
    <div v-if="showValue" class="base-slider-value">{{ modelValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  showValue: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', parseFloat(target.value));
};

const sliderStyle = computed(() => {
  const percentage = ((props.modelValue - props.min) / (props.max - props.min)) * 100;
  return {
    background: `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${percentage}%, rgba(0,0,0,0.1) ${percentage}%, rgba(0,0,0,0.1) 100%)`
  };
});
</script>

<style scoped lang="scss">
.base-slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.base-slider-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  height: 20px; /* input height */
}

.base-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  outline: none;
  margin: 0;
  cursor: pointer;

  /* Thumb Styles - Webkit */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid var(--color-brand);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: transform 0.1s;
    margin-top: 0; /* Align with track if needed, usually auto works */
  }
  
  &:hover::-webkit-slider-thumb {
    transform: scale(1.1);
  }
  
  &:active::-webkit-slider-thumb {
    transform: scale(1.2);
    box-shadow: 0 0 0 4px rgba(244, 208, 63, 0.2);
  }

  /* Thumb Styles - Firefox */
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid var(--color-brand);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: transform 0.1s;
  }
}

.base-slider-value {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 24px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
