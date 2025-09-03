<template>
  <div class="phone-frame wallpaper-content" 
       ref="phoneFrameRef" 
       :style="dynamicShadowStyle">
    <div class="background-image" :style="backgroundImageStyle"></div>
    <div v-if="hasNotch" class="notch">
      <div class="notch-camera"></div>
    </div>

    <!-- 锁屏界面元素 -->
    <div class="lock-screen-overlay" :style="lockScreenOverlayStyle">
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
  hasNotch: {
    type: Boolean,
    default: true,
  },
});

const { imageUrl, watermarkSettings, shadowEffect } = useWallpaper();

// 根据壁纸颜色生成静态阴影样式
const dynamicShadowStyle = computed(() => ({
  boxShadow: shadowEffect.value.normalShadow
}));

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

// 根据刘海开关动态计算顶部内边距
const topPadding = computed(() => props.hasNotch ? '35px' : '10px');

// 动态背景图像样式
const backgroundImageStyle = computed(() => ({
  backgroundImage: `url(${wallpaperUrl.value})`,
  paddingTop: topPadding.value,
}));

// 动态锁屏覆盖层样式
const lockScreenOverlayStyle = computed(() => ({
  color: watermarkSettings.value.color,
  paddingTop: topPadding.value,
}));



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
  width: v-bind(width);
  height: auto;
  aspect-ratio: 390 / 844;
  border-radius: 25px;
  background-color: #000;
  padding: 15px;
  /* 阴影效果已由动态样式提供 */
  overflow: hidden;
  box-sizing: border-box;
  /* 3D变换效果 */
  transform-style: preserve-3d;
  transition: all 0.3s ease-in-out;
  z-index: 20;
}

.notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 35%;
  height: 35px;
  background-color: #000;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  z-index: 20; /* 提高z-index使其在最上层 */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
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
  box-sizing: border-box;
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
  padding: 10px 20px 10px 20px; /* 基础内边距，顶部内边距由计算属性控制 */
  box-sizing: border-box;
  z-index: 3; /* 确保覆盖层在背景之上，但在刘海之下 */
}

.top-icon {
  width: 100%;
  display: flex;
  justify-content: flex-end; /* 修改为右对齐 */
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

.notch-camera {
  position: absolute;
  top: 8px;
  right: 30%;
  width: 8px;
  height: 8px;
  background-color: #1a1a1a;
  border-radius: 50%;
  box-shadow: inset 0 0 2px rgba(255,255,255,0.2);
}

</style>
