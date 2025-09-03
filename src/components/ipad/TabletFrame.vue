  <template>
  <div class="tablet-frame">
    <!-- 锁屏时间和日期 -->
    <div class="lock-screen-info">
      <div class="lock-date">星期三，9月3日</div>
      <div class="lock-time">14:30</div>
    </div>
    
    <!-- 底部Dock -->
    <TabletDock />
    
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import TabletDock from './TabletDock.vue';
</script>

<style scoped>
.tablet-frame {
  position: relative;
  width: 100%;
  height: 100%;
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
