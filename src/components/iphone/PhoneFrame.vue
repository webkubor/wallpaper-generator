<template>
  <div class="phone-frame">
    <!-- 壁纸背景 -->
    <img v-if="wallpaperUrl" :src="wallpaperUrl" alt="background" class="background-image" />
    <PhoneTopIcon class="phone-top-icon" />
    <PhoneLockBottom class="phone-bottom-icon" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import PhoneTopIcon from './PhoneTopIcon.vue';
import PhoneLockBottom from './PhoneLockBottom.vue';
import { useWallpaper } from '../../composables/useWallpaper';
import { computed } from 'vue';

const { imageUrl } = useWallpaper();

// 使用计算属性保持响应性
const wallpaperUrl = computed(() => imageUrl.value);
</script>

<style scoped>
.phone-frame {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #1c1c1e;
  border-radius: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15), inset 0 0 8px rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.phone-frame:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.2), inset 0 0 8px rgba(0,0,0,0.6);
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

.phone-top-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.phone-bottom-icon {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}
</style>
