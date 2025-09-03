<template>
  <div class="mac-frame wallpaper-content" :style="dynamicShadowStyle">
    <!-- 壁纸背景 -->
    <img v-if="wallpaperUrl" :src="wallpaperUrl" alt="background" class="background-image" />
    
    <!-- 时间和日期显示 -->
    <div class="time-display" :style="textColorStyle">
      <div class="lock-date">{{ lockDate }}</div>
      <div class="lock-time">{{ lockTime }}</div>
    </div>
    
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { useWallpaper } from '../../composables/useWallpaper';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const { imageUrl, titleSettings, shadowEffect } = useWallpaper();

// 根据壁纸颜色生成静态阴影样式
const dynamicShadowStyle = computed(() => ({
  boxShadow: shadowEffect.value.normalShadow
}));

// 使用计算属性保持响应性
const wallpaperUrl = computed(() => imageUrl.value);

const textColorStyle = computed(() => ({
  color: titleSettings.value.color,
}));

const lockTime = ref('');
const lockDate = ref('');
let timer: number;

const updateTime = () => {
  const now = dayjs();
  lockDate.value = now.format('dddd, M月D日');
  lockTime.value = now.format('HH:mm');
};

onMounted(() => {
  updateTime();
  timer = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.mac-frame {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  border-radius: 16px;
  /* 阴影效果已由动态样式提供 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: all 0.3s ease;
  /* 3D变换效果 */
  transform-style: preserve-3d;
  z-index: 20;
}

/* 悬停效果已移除，只保留静态效果 */

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  background-color: transparent; /* 确保背景透明 */
}

.time-display {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  z-index: 10;
}


.lock-time {
  font-size: 60px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  top: -20px;
}

.lock-date {
  font-size: 19px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
