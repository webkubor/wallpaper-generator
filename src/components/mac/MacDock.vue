<template>
  <svg viewBox="0 0 640 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="filter-none absolute z-20"
    style="bottom: 0; left: 0; width: 100%;">
    <!-- 底部Dock背景 -->
    <rect x="170" y="0" width="300" height="50" rx="15" fill="rgba(255, 255, 255, 0.3)" filter="url(#blur)" />
    
    <!-- 应用图标占位 -->
    <rect x="190" y="5" width="40" height="40" rx="8" fill="rgba(0, 122, 255, 0.8)" />
    <rect x="240" y="5" width="40" height="40" rx="8" fill="rgba(255, 59, 48, 0.8)" />
    <rect x="290" y="5" width="40" height="40" rx="8" fill="rgba(52, 199, 89, 0.8)" />
    <rect x="340" y="5" width="40" height="40" rx="8" fill="rgba(255, 204, 0, 0.8)" />
    <rect x="390" y="5" width="40" height="40" rx="8" fill="rgba(175, 82, 222, 0.8)" />
    
    <!-- 滤镜定义 -->
    <defs>
      <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
      </filter>
    </defs>
  </svg>
</template>

<script setup>
defineProps();
</script>
