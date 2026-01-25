<template>
  <div class="base-select-wrapper">
    <select 
      class="base-select" 
      :value="modelValue" 
      @change="handleChange"
      :disabled="disabled"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string;
  value: string | number;
}

interface Props {
  modelValue?: string | number;
  options?: Option[];
  disabled?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped lang="scss">
.base-select-wrapper {
  position: relative;
  width: 100%;
  
  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--text-secondary);
    pointer-events: none;
  }
}

.base-select {
  width: 100%;
  appearance: none;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-primary);
  background-color: rgba(0, 0, 0, 0.03);
  border: 1px solid transparent;
  border-radius: var(--border-radius-sm);
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  
  &:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:focus:not(:disabled) {
    background-color: #fff;
    border-color: var(--color-brand);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
