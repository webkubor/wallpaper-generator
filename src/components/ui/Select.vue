<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

interface Option {
  label: string;
  value: any;
}

interface Props {
  modelValue: any;
  options: Option[];
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择'
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const selectRef = ref<HTMLDivElement | null>(null);

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue);
});

const handleSelect = (value: any) => {
  emit('update:modelValue', value);
  isOpen.value = false;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="custom-select" ref="selectRef">
    <div 
      class="custom-select__trigger"
      :class="{ 'custom-select__trigger--active': isOpen }"
      @click="toggleDropdown"
    >
      <span v-if="selectedOption">{{ selectedOption.label }}</span>
      <span v-else class="custom-select__placeholder">{{ placeholder }}</span>
      <span class="custom-select__arrow" :class="{ 'custom-select__arrow--open': isOpen }">
        ▼
      </span>
    </div>
    
    <div class="custom-select__dropdown" v-if="isOpen">
      <div 
        v-for="option in options" 
        :key="option.value"
        class="custom-select__option"
        :class="{ 'custom-select__option--selected': option.value === modelValue }"
        @click="handleSelect(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.custom-select {
  position: relative;
  width: 100%;
  
  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 $spacing-md;
    border: 1px solid $color-border;
    border-radius: $border-radius-md;
    background-color: $color-background-light;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: $color-primary;
    }
    
    &--active {
      border-color: $color-primary;
      box-shadow: 0 0 0 2px rgba($color-primary, 0.2);
    }
  }
  
  &__placeholder {
    color: $color-text-placeholder;
  }
  
  &__arrow {
    font-size: 10px;
    color: $color-text-secondary;
    transition: transform 0.3s ease;
    
    &--open {
      transform: rotate(180deg);
    }
  }
  
  &__dropdown {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background-color: $color-background-light;
    border: 1px solid $color-border;
    border-radius: $border-radius-md;
    box-shadow: $shadow-medium;
    z-index: 10;
  }
  
  &__option {
    padding: $spacing-sm $spacing-md;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba($color-primary, 0.1);
    }
    
    &--selected {
      background-color: rgba($color-primary, 0.2);
      color: $color-primary;
      font-weight: 500;
    }
  }
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .custom-select {
    &__trigger {
      background-color: $color-background-dark;
      border-color: $color-border-dark;
      color: $color-text-primary-dark;
      
      &:hover {
        border-color: $color-primary-light;
      }
      
      &--active {
        border-color: $color-primary-light;
        box-shadow: 0 0 0 2px rgba($color-primary-light, 0.2);
      }
    }
    
    &__placeholder {
      color: $color-text-placeholder-dark;
    }
    
    &__arrow {
      color: $color-text-secondary-dark;
    }
    
    &__dropdown {
      background-color: $color-background-dark;
      border-color: $color-border-dark;
    }
    
    &__option {
      color: $color-text-primary-dark;
      
      &:hover {
        background-color: rgba($color-primary-light, 0.1);
      }
      
      &--selected {
        background-color: rgba($color-primary-light, 0.2);
        color: $color-primary-light;
      }
    }
  }
}
</style>
