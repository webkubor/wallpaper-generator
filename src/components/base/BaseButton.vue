<template>
  <button 
    class="base-btn" 
    :class="[
      `base-btn--${variant}`, 
      `base-btn--${size}`,
      { 'base-btn--block': block },
      { 'base-btn--circle': circle },
      { 'base-btn--icon-only': $slots.icon && !$slots.default },
      { 'base-btn--loading': loading }
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <!-- Loading Spinner -->
    <svg v-if="loading" class="base-btn__spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="32" stroke-linecap="round" />
    </svg>
    
    <!-- Icon Slot -->
    <span v-if="$slots.icon && !loading" class="base-btn__icon">
      <slot name="icon"></slot>
    </span>

    <!-- Content Slot -->
    <span v-if="$slots.default" class="base-btn__content">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  circle?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'md',
  block: false,
  circle: false,
  disabled: false,
  loading: false
});
</script>

<style scoped lang="scss">
.base-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  vertical-align: middle;
  border: 1px solid transparent;
  outline: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  gap: 6px;

  /* Sizes */
  &--sm {
    height: 28px;
    padding: 0 10px;
    font-size: 13px;
    
    &.base-btn--circle {
      width: 28px;
      padding: 0;
      border-radius: 50%;
    }
  }

  &--md {
    height: 34px;
    padding: 0 14px;
    font-size: 14px;

    &.base-btn--circle {
      width: 34px;
      padding: 0;
      border-radius: 50%;
    }
  }

  &--lg {
    height: 44px;
    padding: 0 20px;
    font-size: 16px;
    border-radius: var(--border-radius-md);

    &.base-btn--circle {
      width: 44px;
      padding: 0;
      border-radius: 50%;
    }
  }

  &--block {
    display: flex;
    width: 100%;
  }

  /* Variants */
  &--primary {
    background-color: var(--color-brand);
    color: var(--color-brand-text);
    border-color: var(--color-brand);

    &:hover:not(:disabled) {
      background-color: var(--color-brand-hover);
      border-color: var(--color-brand-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    &:active:not(:disabled) {
      background-color: var(--color-brand-active);
      border-color: var(--color-brand-active);
      transform: translateY(0);
    }
  }

  &--secondary {
    background-color: rgba(0, 0, 0, 0.04);
    color: var(--text-primary);
    border-color: transparent;

    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.08);
      color: var(--text-primary);
    }

    &:active:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.12);
    }
    
    // Dark mode compatible fallback
    @media (prefers-color-scheme: dark) {
       background-color: rgba(255, 255, 255, 0.1);
       &:hover:not(:disabled) { background-color: rgba(255, 255, 255, 0.15); }
       &:active:not(:disabled) { background-color: rgba(255, 255, 255, 0.2); }
    }
  }

  &--outline {
    background-color: transparent;
    border-color: var(--border-color);
    color: var(--text-primary);

    &:hover:not(:disabled) {
      border-color: var(--color-brand);
      color: var(--color-brand-active);
    }

    &:active:not(:disabled) {
      background-color: rgba(244, 208, 63, 0.05); // Brand tint
    }
  }

  &--ghost {
    background-color: transparent;
    color: var(--text-secondary);
    border-color: transparent;

    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.04);
      color: var(--text-primary);
    }

    &:active:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
  
  &--danger {
    background-color: transparent;
    color: var(--color-error);
    border: 1px solid var(--color-error);
    
    &:hover:not(:disabled) {
      background-color: var(--color-error);
      color: white;
    }
  }

  /* States */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(0.2);
  }

  &__spinner {
    width: 1.2em;
    height: 1.2em;
    animation: spin 1s linear infinite;
  }
  
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
