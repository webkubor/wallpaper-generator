<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-button @click="toggleTheme" class="theme-toggle-button">切换主题</n-button>
    <WallpaperEditor />
  </n-config-provider>
</template>

<style scoped lang="scss">
:global(body, #app) {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.theme-toggle-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>

<script setup lang="ts">
import WallpaperEditor from '@/components/WallpaperEditor.vue';
import { darkTheme } from "naive-ui";
import { useDark } from "@vueuse/core";
import { computed } from "vue";

const isDark = useDark();

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const themeOverrides = computed(() => {
  if (isDark.value) {
    // 深色模式下的组件主题色
    return {
      common: {
        primaryColor: '#66b1ff',
        primaryColorHover: '#8cc5ff',
        primaryColorPressed: '#5299e0',
        primaryColorSuppl: 'rgba(102, 177, 255, 0.5)'
      }
    };
  } else {
    // 浅色模式下的组件主题色
    return {
      common: {
        primaryColor: '#325BFD',
        primaryColorHover: '#0033E5',
        primaryColorPressed: '#0023C0',
        primaryColorSuppl: 'rgba(0, 51, 229, 0.5)'
      }
    };
  }
});
</script>