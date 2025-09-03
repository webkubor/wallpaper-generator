<template>
  <div class="car-frame wallpaper-content" 
       :style="dynamicShadowStyle"
       @mouseenter="applyHoverEffect"
       @mouseleave="removeHoverEffect">
    <!-- 壁纸背景 -->
    <img v-if="wallpaperUrl" :src="wallpaperUrl" alt="background" class="background-image" />
    <!-- 空白车机壁纸，只有边框 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { useWallpaper } from '../../composables/useWallpaper';
import { computed, ref } from 'vue';

const { imageUrl, shadowEffect } = useWallpaper();
const isHovered = ref(false);

// 使用计算属性保持响应性
const wallpaperUrl = computed(() => imageUrl.value);

// 根据壁纸颜色和悬停状态动态生成阴影样式
const dynamicShadowStyle = computed(() => ({
  boxShadow: isHovered.value ? shadowEffect.value.hoverShadow : shadowEffect.value.normalShadow,
  transform: isHovered.value ? 'scale(1.02) translateY(-5px) translateZ(10px)' : 'none'
}));

// 悬停效果处理函数
const applyHoverEffect = () => {
  isHovered.value = true;
};

const removeHoverEffect = () => {
  isHovered.value = false;
};
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
  /* 3D变换效果 */
  transform-style: preserve-3d;
  transition: all 0.3s ease-in-out;
  z-index: 20;
  /* 阴影效果已由动态样式提供 */
  overflow: hidden;
  aspect-ratio: 16/9;
}

/* 悬停效果已通过dynamicShadowStyle动态实现 */

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 13px; /* 匹配最终的边框厚度 */
  display: block;
}
</style>
