<template>
  <div class="phone-frame wallpaper-content" ref="phoneFrameRef">
    <div class="background-image" :style="{ backgroundImage: `url(${wallpaperUrl})` }"></div>
    <div class="notch"></div>

    <!-- 锁屏界面元素 -->
    <div class="lock-screen-overlay" :style="{ color: watermarkSettings.color }">
      <div class="top-icon">
        <PhoneTopIcon />
      </div>
            <div class="center-content">
        <div class="date-display" :style="dateStyle">
          {{ currentDate }}
        </div>
        <div class="time-display" :style="timeStyle">
          {{ currentTime }}
        </div>
              </div>
            <div class="bottom-icon">
        <PhoneFlashlightIcon />
        <PhoneCameraIcon />
      </div>
      <HomeIndicator :container-width="elementWidth" :base-width="BASE_WIDTH" />
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { useWallpaper } from '../../composables/useWallpaper';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useElementSize } from '@vueuse/core';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
import PhoneTopIcon from './PhoneTopIcon.vue';
import PhoneFlashlightIcon from './PhoneFlashlightIcon.vue';
import PhoneCameraIcon from './PhoneCameraIcon.vue';
import HomeIndicator from '../common/HomeIndicator.vue';

const props = defineProps({
  width: {
    type: String,
    default: '100%',
  },
  });

const { imageUrl, watermarkSettings } = useWallpaper();

// 使用计算属性保持响应性
const wallpaperUrl = computed(() => imageUrl.value);

const phoneFrameRef = ref(null);
const { width: elementWidth } = useElementSize(phoneFrameRef);

const BASE_WIDTH = 390; // 基准宽度

const timeStyle = computed(() => ({
  fontSize: `${(elementWidth.value / BASE_WIDTH) * 82}px`,
}));

const dateStyle = computed(() => ({
  fontSize: `${(elementWidth.value / BASE_WIDTH) * 20}px`,
}));

const topIconWidth = computed(() => `${(elementWidth.value / BASE_WIDTH) * 75}px`);
const bottomIconSize = computed(() => `${(elementWidth.value / BASE_WIDTH) * 50}px`);



// 时间显示
const currentTime = ref('');
const currentDate = ref('');
let timer: number;

const updateTime = () => {
  const now = dayjs();
  currentDate.value = now.format('dddd, M月D日');
  currentTime.value = now.format('HH:mm');
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
  color: white;
  padding: 10px 20px; /* 顶部10px，左右20px内边距 */
  box-sizing: border-box;
  z-index: 2; /* 确保覆盖层在最上层 */
}

.top-icon {
  width: 100%;
  display: flex;
  justify-content: flex-end; /* 修改为右对齐 */
  padding-right: 16px;
  box-sizing: border-box;
}

.top-icon :deep(svg) {
  width: v-bind(topIconWidth);
  height: auto;
}

.bottom-icon {
  position: absolute;
  bottom: 35px;
  width: 100%;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}

.bottom-icon :deep(svg) {
  width: v-bind(bottomIconSize);
  height: v-bind(bottomIconSize);
}


.center-content {
  position: absolute;
  top: 38.2%; /* 黄金分割点 */
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-display {
  font-weight: 500; /* 使用中等字重而非粗体 */
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 使用系统UI字体 */
  margin-top: 2px;
}

.date-display {
  font-weight: 500;
  letter-spacing: 0.5px; /* 增加字间距 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 使用系统UI字体 */
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

</style>
