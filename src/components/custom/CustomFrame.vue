<template>
  <div class="custom-frame wallpaper-content" :style="frameStyle">
    <div class="custom-content">
      <img 
        v-if="imageUrl" 
        :src="imageUrl" 
        class="custom-background" 
        alt="Custom Background"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 400
  },
  imageUrl: {
    type: String,
    default: '',
    required: false
  }
});

const frameStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
}));
</script>

<style scoped lang="scss">
.custom-frame {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #f5f5f5;
  
  .custom-content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    
    .custom-background {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
