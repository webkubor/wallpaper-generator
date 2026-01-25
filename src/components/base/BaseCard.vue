<template>
  <div 
    class="base-card"
    :class="{ 
      'base-card--hoverable': hoverable,
      'base-card--bordered': bordered
    }"
    :style="customStyle"
  >
    <!-- Header -->
    <div v-if="$slots.header || title" class="base-card__header">
      <div class="base-card__header-main">
        <slot name="header">
          <h3 v-if="title" class="base-card__title">{{ title }}</h3>
        </slot>
      </div>
      <div v-if="$slots.action" class="base-card__header-action">
        <slot name="action"></slot>
      </div>
    </div>

    <!-- Body -->
    <div class="base-card__body" :style="contentStyle">
      <slot></slot>
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type CSSProperties, computed } from 'vue';

interface Props {
  title?: string;
  hoverable?: boolean;
  bordered?: boolean;
  contentStyle?: string | CSSProperties;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  hoverable: false,
  bordered: true,
});

const customStyle = computed(() => {
  return {};
});
</script>

<style scoped lang="scss">
.base-card {
  background-color: var(--bg-card);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--bordered {
    border: 1px solid var(--border-color);
  }

  &--hoverable {
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: rgba(0, 0, 0, 0.08);
    }
  }

  &__header {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-color);
  }
  
  &__header-main {
    flex: 1;
    overflow: hidden;
  }

  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__body {
    flex: 1;
    padding: 16px;
    color: var(--text-primary);
  }

  &__footer {
    padding: 12px 16px;
    border-top: 1px solid var(--border-color);
    background-color: var(--bg-body); // Slightly different bg for footer
  }
}
</style>
