<template>
  <div class="mac-frame">
    <!-- 壁纸背景 -->
    <img v-if="wallpaperUrl" :src="wallpaperUrl" alt="background" class="background-image" />
    
    <!-- 时间和日期显示 -->
    <div class="time-display">
      <div class="lock-date">星期三，9月3日</div>
      <div class="lock-time">14:30</div>
    </div>
    
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
.mac-frame {
  position: relative;
  width: 100%;
  color: #FFFFFF;
  height: 100%;
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
