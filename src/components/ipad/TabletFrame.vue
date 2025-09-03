  <template>
  <div class="tablet-frame">
    <!-- 壁纸背景 -->
    <img v-if="wallpaperUrl" :src="wallpaperUrl" alt="background" class="background-image" />
    
    <!-- 锁屏时间和日期 -->
    <div class="lock-screen-info">
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
.tablet-frame {
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

.lock-screen-info {
  position: absolute;
  top: 25%;
  left: 0;
  width: 100%;
  text-align: center;
  color: #FFFFFF;
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
