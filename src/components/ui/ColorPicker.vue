<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

interface Props {
  modelValue: string;
  showAlpha?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showAlpha: false
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const colorPickerRef = ref<HTMLDivElement | null>(null);

const currentColor = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const toggleColorPicker = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (colorPickerRef.value && !colorPickerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const handleColorChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  currentColor.value = input.value;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="custom-color-picker" ref="colorPickerRef">
    <div 
      class="custom-color-picker__trigger"
      @click="toggleColorPicker"
    >
      <div 
        class="custom-color-picker__preview" 
        :style="{ backgroundColor: currentColor }"
      ></div>
      <span class="custom-color-picker__value">{{ currentColor }}</span>
    </div>
    
    <div class="custom-color-picker__dropdown" v-if="isOpen">
      <input 
        type="color" 
        class="custom-color-picker__input" 
        :value="currentColor"
        @input="handleColorChange"
      />
      <div class="custom-color-picker__recent">
        <div 
          class="custom-color-picker__swatch"
          v-for="color in ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff']"
          :key="color"
          :style="{ backgroundColor: color }"
          @click="currentColor = color"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.custom-color-picker {
  position: relative;
  width: 100%;
  
  &__trigger {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
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
  }
  
  &__preview {
    width: 20px;
    height: 20px;
    border-radius: $border-radius-sm;
    border: 1px solid $color-border;
  }
  
  &__value {
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }
  
  &__dropdown {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 100%;
    background-color: $color-background-light;
    border: 1px solid $color-border;
    border-radius: $border-radius-md;
    box-shadow: $shadow-medium;
    padding: $spacing-md;
    z-index: 10;
  }
  
  &__input {
    width: 100%;
    height: 40px;
    margin-bottom: $spacing-md;
    cursor: pointer;
  }
  
  &__recent {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }
  
  &__swatch {
    width: 24px;
    height: 24px;
    border-radius: $border-radius-sm;
    border: 1px solid $color-border;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .custom-color-picker {
    &__trigger {
      background-color: $color-background-dark;
      border-color: $color-border-dark;
      
      &:hover {
        border-color: $color-primary-light;
      }
    }
    
    &__preview {
      border-color: $color-border-dark;
    }
    
    &__value {
      color: $color-text-secondary-dark;
    }
    
    &__dropdown {
      background-color: $color-background-dark;
      border-color: $color-border-dark;
    }
    
    &__swatch {
      border-color: $color-border-dark;
    }
  }
}
</style>
