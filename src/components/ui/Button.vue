<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type?: 'primary' | 'success' | 'default';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false
});

const buttonClass = computed(() => {
  return [
    'custom-button',
    `custom-button--${props.type}`,
    `custom-button--${props.size}`,
    { 'custom-button--disabled': props.disabled }
  ];
});
</script>

<template>
  <button 
    :class="buttonClass" 
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span class="custom-button__icon" v-if="$slots.icon">
      <slot name="icon"></slot>
    </span>
    <span class="custom-button__content">
      <slot></slot>
    </span>
  </button>
</template>

<style lang="scss" scoped>
@use 'sass:color';

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
    background: linear-gradient(45deg, $color-primary, color.adjust($color-primary, $lightness: 10%));
    color: white;
    
    &:hover {
      background: linear-gradient(45deg, color.adjust($color-primary, $lightness: -5%), color.adjust($color-primary, $lightness: 5%));
      box-shadow: 0 4px 8px rgba($color-primary, 0.3);
    }
    
    &:active {
      background: linear-gradient(45deg, color.adjust($color-primary, $lightness: -10%), $color-primary);
    }
  }
  
  &--success {
    background: linear-gradient(45deg, $color-success, color.adjust($color-success, $lightness: 10%));
    color: white;
    
    &:hover {
      background: linear-gradient(45deg, color.adjust($color-success, $lightness: -5%), color.adjust($color-success, $lightness: 5%));
      box-shadow: 0 4px 8px rgba($color-success, 0.3);
    }
    
    &:active {
      background: linear-gradient(45deg, color.adjust($color-success, $lightness: -10%), $color-success);
    }
  }
  
  &--default {
    background: linear-gradient(to bottom, $color-background-light, color.adjust($color-background-light, $lightness: -3%));
    color: $color-text-primary;
    border: 1px solid $color-border;
    
    &:hover {
      background: linear-gradient(to bottom, color.adjust($color-background-light, $lightness: -2%), color.adjust($color-background-light, $lightness: -5%));
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    &:active {
      background: linear-gradient(to bottom, color.adjust($color-background-light, $lightness: -5%), color.adjust($color-background-light, $lightness: -2%));
    }
  }
  
  &--small {
    height: 32px;
    font-size: $font-size-sm;
    border-radius: $border-radius-sm;
  }
  
  &--medium {
    height: 40px;
    font-size: $font-size-md;
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

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .custom-button {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    &::before {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    &--primary {
      background: linear-gradient(45deg, $color-primary-light, color.adjust($color-primary-light, $lightness: 10%));
      
      &:hover {
        background: linear-gradient(45deg, color.adjust($color-primary-light, $lightness: -5%), color.adjust($color-primary-light, $lightness: 5%));
        box-shadow: 0 4px 12px rgba($color-primary-light, 0.4);
      }
      
      &:active {
        background: linear-gradient(45deg, color.adjust($color-primary-light, $lightness: -10%), $color-primary-light);
      }
    }
    
    &--success {
      background: linear-gradient(45deg, $color-success, color.adjust($color-success, $lightness: 5%));
      
      &:hover {
        background: linear-gradient(45deg, color.adjust($color-success, $lightness: -5%), color.adjust($color-success, $lightness: 0%));
        box-shadow: 0 4px 12px rgba($color-success, 0.4);
      }
    }
    
    &--default {
      background: linear-gradient(to bottom, $color-background-dark, color.adjust($color-background-dark, $lightness: 3%));
      color: $color-text-primary-dark;
      border-color: $color-border-dark;
      
      &:hover {
        background: linear-gradient(to bottom, color.adjust($color-background-dark, $lightness: 5%), color.adjust($color-background-dark, $lightness: 2%));
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      &:active {
        background: linear-gradient(to bottom, color.adjust($color-background-dark, $lightness: 7%), color.adjust($color-background-dark, $lightness: 3%));
      }
    }
  }
}
</style>
