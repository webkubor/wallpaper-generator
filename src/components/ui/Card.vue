<script setup lang="ts">
// 无需props
</script>

<template>
  <div class="custom-card">
    <div class="custom-card__header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="custom-card__body">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

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

// 暗黑模式
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
</style>
