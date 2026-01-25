<template>
  <div class="base-color-wrapper">
    <input 
      type="color" 
      class="base-color-input" 
      :value="modelValue" 
      @input="handleInput"
      :disabled="disabled"
    />
    <span class="base-color-value" v-if="showValue">{{ modelValue }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  disabled?: boolean;
  showValue?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: '#000000',
  showValue: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped lang="scss">
.base-color-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: var(--border-radius-sm);
  width: fit-content;
}

.base-color-input {
  width: 32px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: none;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 4px;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.base-color-value {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: monospace;
  padding-right: 4px;
}
</style>
