<template>
  <div class="combo-devices">
    <div class="mac-row">
      <MacFrame class="mac-device" />
    </div>
    
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
  overflow: hidden;
  background-color: transparent;
}

.mac-row {
  flex: 1;
  width: 100%;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent; /* 显式设置背景透明 */
}

.mobile-row {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  background-color: transparent; /* 显式设置背景透明 */
}

.mac-device {
  width: 100%;
  height: 100%;
}

.tablet-device {
 flex: 3;
}

.phone-device {
  flex: 1;
}
</style>
