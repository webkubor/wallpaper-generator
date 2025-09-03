  <template>
  <div class="tablet-frame">
    <!-- 壁纸背景 -->
    <img v-if="wallpaperUrl" :src="wallpaperUrl" alt="background" class="background-image" />
    
    <!-- 锁屏时间和日期 -->
    <div class="lock-screen-info" :style="textColorStyle">
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

const { imageUrl, titleSettings } = useWallpaper();

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
.tablet-frame {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15), inset 0 0 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

.tablet-frame:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.2), inset 0 0 10px rgba(0,0,0,0.1);
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

.lock-screen-info {
  position: absolute;
  top: 25%;
  left: 0;
  width: 100%;
  text-align: center;
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
