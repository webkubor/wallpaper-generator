<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const toggleSwitch = () => {
  isChecked.value = !isChecked.value;
};
</script>

<template>
  <div 
    class="custom-switch" 
    :class="{ 'custom-switch--active': isChecked }"
    @click="toggleSwitch"
  >
    <div class="custom-switch__thumb"></div>
  </div>
</template>

<style lang="scss" scoped>

.custom-switch {
  position: relative;
  width: 44px;
  height: 22px;
  border-radius: 11px;
  background-color: $color-border;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &--active {
    background-color: $color-primary;
  }
  
  &__thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: white;
    transition: transform 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    
    .custom-switch--active & {
      transform: translateX(22px);
    }
  }
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .custom-switch {
    background-color: $color-border-dark;
    
    &--active {
      background-color: $color-primary-light;
    }
    
    &__thumb {
      background-color: $color-background-light;
    }
  }
}
</style>
