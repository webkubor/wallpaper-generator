<template>
  <div class="car-frame wallpaper-content">
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
  border-radius: 18px;
  /* 更具光泽感的高级灰渐变 */
  background: linear-gradient(145deg, #dcdcdc, #888888);
  /* 最终减小 padding 以获得纤细边框 */
  padding: 5px;
  /* 增强光泽感的最终阴影 */
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.6), /* 强化顶部高光 */
    inset 0 -1px 1px rgba(0, 0, 0, 0.3),    /* 深化底部阴影 */
    0 10px 20px rgba(0, 0, 0, 0.3);          /* 外部阴影 */
  overflow: hidden;
  aspect-ratio: 16/9;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 13px; /* 匹配最终的边框厚度 */
  display: block;
}
</style>
