<template>
  <div class="mac-frame">
    <!-- 时间和日期显示 -->
    <div class="time-display">
      <div class="lock-date">星期三，9月3日</div>
      <div class="lock-time">14:30</div>
    </div>
    
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 显示时间和日期
</script>

<style scoped>
.mac-frame {
  position: relative;
  width: 100%;
  color: #FFFFFF;
  height: 100%;
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
