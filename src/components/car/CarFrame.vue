<template>
  <div class="car-frame">
    <!-- 车机时间显示 -->
    <div class="car-screen-info">
      <div class="car-date">星期三，9月3日</div>
      <div class="car-time">14:30</div>
    </div>
    
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 车机壁纸组件
</script>

<style scoped>
.car-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 12px solid #555555;
  border-radius: 8px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.3);
  background-clip: padding-box;
  overflow: hidden;
  aspect-ratio: 16/9;
  color: #FFFFFF;
}

.car-screen-info {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  z-index: 10;
}

.car-time {
  font-size: 60px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.car-date {
  font-size: 19px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  margin-bottom: 5px;
}
</style>
