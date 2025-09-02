<template>
  <svg height="30" viewBox="0 0 575 30" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
    <!-- 时间 -->
    <text x="20" y="20" font-family="Arial" font-size="16" font-weight="bold">14:30</text>
    
    <!-- 右侧状态图标 -->
    <g transform="translate(480, 0)">
      <!-- WiFi图标 -->
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M20.839 15.0666C23.306 15.0667 25.678 15.9643 27.466 17.5737C27.6 17.698 27.816 17.6964 27.948 17.5702L29.235 16.3404C29.302 16.2764 29.339 16.1897 29.339 16.0994C29.338 16.0092 29.3 15.9229 29.232 15.8597C24.54 11.6015 17.138 11.6015 12.446 15.8597C12.378 15.9229 12.34 16.0092 12.339 16.0994C12.338 16.1896 12.376 16.2763 12.443 16.3404L13.73 17.5702C13.862 17.6966 14.078 17.6981 14.212 17.5737C16 15.9641 18.373 15.0666 20.839 15.0666Z"
        />
      
      <!-- 电池图标 -->
      <rect opacity="0.35" x="40" y="12.5" width="24" height="12" rx="3" stroke="#FFFFFF" fill="transparent"></rect>
      <path opacity="0.4" d="M65.5 16.666V20.666C66.305 20.3272 66.828 19.5391 66.828 18.666C66.828 17.7929 66.305 17.0048 65.5 16.666Z"></path>
      <rect x="41.5" y="14" width="21" height="9" rx="1.33333"></rect>
    </g>
  </svg>
</template>

<script setup>
defineProps();
</script>
