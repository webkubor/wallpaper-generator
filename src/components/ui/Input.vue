<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  type: 'text'
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<template>
  <div class="custom-input">
    <input
      :type="type"
      v-model="inputValue"
      :placeholder="placeholder"
      class="custom-input__field"
    />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.custom-input {
  width: 100%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, $color-primary, color.adjust($color-primary, $lightness: 15%));
    transition: all 0.3s ease;
    transform: translateX(-50%);
    border-radius: $border-radius-sm;
    opacity: 0;
  }
  
  &:focus-within::after {
    width: 100%;
    opacity: 1;
  }
  
  &__field {
    width: 100%;
    height: 42px;
    padding: 0 $spacing-lg;
    border: 1px solid $color-border;
    border-radius: $border-radius-md;
    font-size: $font-size-md;
    color: $color-text-primary;
    background-color: $color-background-light;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    
    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 4px 8px rgba($color-primary, 0.1);
      transform: translateY(-1px);
    }
    
    &:hover:not(:focus) {
      border-color: color.adjust($color-border, $lightness: -10%);
    }
    
    &::placeholder {
      color: $color-text-placeholder;
      font-style: italic;
      opacity: 0.7;
    }
  }
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .custom-input {
    &::after {
      background: linear-gradient(90deg, $color-primary-light, color.adjust($color-primary-light, $lightness: 15%));
    }
    
    &__field {
      background-color: color.adjust($color-background-dark, $lightness: 3%);
      border-color: $color-border-dark;
      color: $color-text-primary-dark;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      &::placeholder {
        color: $color-text-placeholder-dark;
      }
      
      &:focus {
        border-color: $color-primary-light;
        box-shadow: 0 4px 8px rgba($color-primary-light, 0.15);
      }
      
      &:hover:not(:focus) {
        border-color: color.adjust($color-border-dark, $lightness: 10%);
      }
    }
  }
}
</style>
