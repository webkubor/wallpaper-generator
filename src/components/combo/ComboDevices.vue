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
}

.mac-row {
  flex: 1;
  width: 100%;
  padding-bottom: 10px;
}

.mobile-row {
  flex: 1;
  width: 100%;
  display: flex;
}

.mac-device {
  width: 100%;
  height: 100%;
}

.tablet-device {
  flex: 2;
  height: 100%;
  margin-right: 10px;
}

.phone-device {
  flex: 1;
  height: 100%;
}
</style>
