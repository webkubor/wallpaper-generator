<template>
  <div class="combo-devices">
    <!-- Mac 在第一排 -->
    <div class="mac-row">
      <MacFrame class="mac-device" />
    </div>
    
    <!-- iPad 和 iPhone 在第二排 -->
    <div class="mobile-row">
      <TabletFrame class="tablet-device" />
      <PhoneFrame class="phone-device" />
    </div>
    
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import MacFrame from '../mac/MacFrame.vue';
import TabletFrame from '../ipad/TabletFrame.vue';
import PhoneFrame from '../iphone/PhoneFrame.vue';
</script>

<style scoped>
.combo-devices {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 确保子元素的圆角生效 */
  background-color: transparent !important; /* 强制背景透明 */

  /* 强制所有子元素背景透明 */
  * {
    background-color: transparent !important;
  }
}

/* 覆盖子组件的样式，移除它们的独立背景和边框 */
.mac-device,
.tablet-device,
.phone-device {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important; /* 移除子组件的圆角 */
}

.mac-row {
  flex: 1;
  width: 100%;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  background-color: transparent; /* 显式设置背景透明 */
}

.mobile-row {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
  background-color: transparent; /* 显式设置背景透明 */
}

.mac-device {
  width: 100%;
  height: 100%;
}

.tablet-device {
  flex: 2;
  height: 100%;
}

.phone-device {
  flex: 1;
  height: 100%;
}
</style>
