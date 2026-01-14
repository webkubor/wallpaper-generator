<template>
  <div class="home-indicator" :style="indicatorStyle"></div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = defineProps({
  containerWidth: {
    type: Number,
    required: true,
  },
  baseWidth: {
    type: Number,
    required: true,
  },
});

const { containerWidth, baseWidth } = toRefs(props);

const indicatorStyle = computed(() => {
  if (containerWidth.value === 0) return {};

  const scale = containerWidth.value / baseWidth.value;

  return {
    width: `${scale * 134}px`,
    height: `${scale * 5}px`,
    bottom: `${scale * 8}px`,
    left: '50%',
    transform: 'translateX(-50%)',
  };
});
</script>

<style scoped>
.home-indicator {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 100px;
  z-index: 10;
}
</style>
