<template>
  <div class="phone-frame">
    <PhoneTopIcon class="phone-top-icon" />
    <PhoneLockBottom class="phone-bottom-icon" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import PhoneTopIcon from './PhoneTopIcon.vue';
import PhoneLockBottom from './PhoneLockBottom.vue';
</script>

<style scoped>
.phone-frame {
  position: relative;
  width: 100%;
  height: 100%;
}

.phone-top-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.phone-bottom-icon {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}
</style>
