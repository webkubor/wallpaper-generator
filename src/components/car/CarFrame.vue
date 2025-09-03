<template>
  <div class="car-frame">
    <!-- 壁纸背景 -->
    <img v-if="wallpaperUrl" :src="wallpaperUrl" alt="background" class="background-image" />
    <!-- 空白车机壁纸，只有边框 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { useWallpaper } from '../../composables/useWallpaper';
import { computed } from 'vue';

const { imageUrl } = useWallpaper();

// 使用计算属性保持响应性
const wallpaperUrl = computed(() => imageUrl.value);
</script>

<style scoped>
.car-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 12px solid #555555;
  border-radius: 8px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.3);
  background-clip: padding-box;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}
</style>
