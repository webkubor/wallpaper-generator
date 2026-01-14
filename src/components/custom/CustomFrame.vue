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
import { useWallpaper } from '@/composables/useWallpaper';

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

const { shadowEffect } = useWallpaper();

// 根据壁纸颜色生成静态阴影样式
const dynamicShadowStyle = computed(() => ({
  boxShadow: shadowEffect.value.normalShadow
}));

const frameStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  ...dynamicShadowStyle.value
}));
</script>

<style scoped lang="scss">
.custom-frame {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  /* 阴影效果已由动态样式提供 */
  background-color: #f5f5f5;
  /* 3D变换效果 */
  transform-style: preserve-3d;
  z-index: 20;
  
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
