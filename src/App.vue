<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-layout>
      <n-layout-header class="header">
        <div class="title-container">
          <img src="/webkubor.svg" class="logo" alt="Logo" />
          <h1>壁纸生成器</h1>
        </div>
        <n-switch v-model:value="isDark" @update:value="toggleTheme">
          <template #checked-icon>
            <n-icon :component="Moon" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="Sun" />
          </template>
        </n-switch>
      </n-layout-header>
      <n-layout-content class="content">
        <WallpaperEditor />
      </n-layout-content>
      <n-layout-footer class="footer" bordered>
        <p><n-icon :component="Code" class="footer-icon" /> Designed & Developed by webkubor</p>
        <p><n-icon :component="Envelope" class="footer-icon" /> <a href="mailto:webkubor@163.com">webkubor@163.com</a></p>
      </n-layout-footer>
    </n-layout>
  </n-config-provider>
</template>

<style scoped lang="scss">
.content {
  flex: 1;
  overflow-y: auto;
}

.footer {
  text-align: center;
  padding: 10px 0;
  color: var(--n-text-color);
  font-size: 13px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: var(--n-color-modal);
  border-top: 1px solid var(--n-border-color);

  a {
    color: var(--n-primary-color);
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: var(--n-primary-color-hover);
      text-decoration: underline;
    }
  }

  p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .footer-icon {
    margin-right: 2px;
    color: var(--n-primary-color);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
}

.title-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

</style>

<script setup lang="ts">
import WallpaperEditor from '@/components/WallpaperEditor.vue';
import { darkTheme, NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NSwitch, NIcon } from "naive-ui";
import { useDark } from "@vueuse/core";
import { computed } from "vue";
import { PhSun as Sun, PhMoon as Moon, PhCode as Code, PhEnvelope as Envelope } from "@phosphor-icons/vue";

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