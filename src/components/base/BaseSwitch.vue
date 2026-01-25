<template>
  <label class="base-switch" :class="{ 'base-switch--disabled': disabled }">
    <input 
      type="checkbox" 
      class="base-switch__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
    >
    <span class="base-switch__track">
      <span class="base-switch__thumb"></span>
    </span>
    <span v-if="label || $slots.default" class="base-switch__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

<style scoped lang="scss">
.base-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  user-select: none;
  font-size: 14px;
  color: var(--text-primary);

  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;

    &:checked + .base-switch__track {
      background-color: var(--color-brand);
      
      .base-switch__thumb {
        transform: translateX(18px);
        border-color: #fff;
      }
    }
  }

  &__track {
    position: relative;
    width: 40px;
    height: 22px;
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 999px;
    transition: background-color 0.2s;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  }

  &__thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background-color: #fff;
    border-radius: 50%;
    transition: transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
}
</style>
