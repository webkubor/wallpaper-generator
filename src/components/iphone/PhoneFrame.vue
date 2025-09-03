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
