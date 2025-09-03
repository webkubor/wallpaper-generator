<template>
  <div class="phone-frame">
    <div class="background-image" :style="{ backgroundImage: `url(${wallpaperUrl})` }"></div>
    <div class="notch"></div>

    <!-- 锁屏界面元素 -->
    <div class="lock-screen-overlay" :style="{ color: watermarkSettings.color }">
      <div class="top-icon">
        <PhoneTopIcon />
      </div>
      <div class="time-display">
        {{ currentTime }}
      </div>
      <div class="bottom-icon">
        <PhoneLockBottom />
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { useWallpaper } from '../../composables/useWallpaper';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import PhoneTopIcon from './PhoneTopIcon.vue';
import PhoneLockBottom from './PhoneLockBottom.vue';

const props = defineProps({
  width: {
    type: String,
    default: '100%',
  },
});

const { imageUrl, watermarkSettings } = useWallpaper();

// 使用计算属性保持响应性
const wallpaperUrl = computed(() => imageUrl.value);

// 时间显示
const currentTime = ref('');
let timer: number;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
.phone-frame {
  position: relative;
  width: v-bind('props.width');
  height: 100%;
  background-color: #1c1c1e;
  border-radius: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15), inset 0 0 8px rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  background-size: cover;
  background-position: center;
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
  border-radius: 12px;
  background-size: cover;
  background-position: center;
}

.lock-screen-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* 恢复空间分布布局 */
  color: white;
  padding: 10px 20px; /* 顶部10px，左右20px内边距 */
  box-sizing: border-box;
  z-index: 2; /* 确保覆盖层在最上层 */
}

.top-icon {
  width: 100%;
  display: flex;
  justify-content: flex-end; /* 修改为右对齐 */
}

.bottom-icon {
  width: 100%;
  display: flex;
  justify-content: center;
}

.time-display {
  font-size: 64px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
