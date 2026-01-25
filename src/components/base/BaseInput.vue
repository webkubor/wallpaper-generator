<template>
  <div class="base-input-wrapper">
    <label v-if="label" class="base-input-label">{{ label }}</label>
    <div class="base-input-container">
      <textarea
        v-if="type === 'textarea'"
        ref="textareaRef"
        class="base-input base-textarea"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        v-bind="$attrs"
      ></textarea>
      <input
        v-else
        ref="inputRef"
        class="base-input"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        v-bind="$attrs"
      />
      <div v-if="$slots.suffix" class="base-input-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const handleInput = (event: Event) => {
  const target = event.target as (HTMLInputElement | HTMLTextAreaElement);
  emit('update:modelValue', target.value);
};

defineExpose({
  focus: () => {
    inputRef.value?.focus();
    textareaRef.value?.focus();
  },
  blur: () => {
    inputRef.value?.blur();
    textareaRef.value?.blur();
  }
});
</script>

<style scoped lang="scss">
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.base-input-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.base-input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.base-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: rgba(0, 0, 0, 0.03);
  border: 1px solid transparent;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  outline: none;
  font-family: inherit;

  &:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:focus:not(:disabled) {
    background-color: #fff;
    border-color: var(--color-brand);
    box-shadow: 0 0 0 2px rgba(244, 208, 63, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: rgba(0, 0, 0, 0.02);
  }
}

.base-textarea {
  min-height: 80px;
  resize: vertical;
}

.base-input-suffix {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}
</style>