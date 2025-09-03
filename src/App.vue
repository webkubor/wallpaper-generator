<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-global-style />
      <n-layout>
      <n-layout-header class="header">
        <div class="title-container">
          <img src="/webkubor.svg" class="logo" alt="Logo" />
          <h1>壁纸生成器</h1>
        </div>
        <n-switch v-model:value="isDark">
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
    </n-message-provider>
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
import { darkTheme, NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NSwitch, NIcon, NMessageProvider } from "naive-ui";
import { useDark } from "@vueuse/core";
import { computed } from "vue";
import { PhSun as Sun, PhMoon as Moon, PhCode as Code, PhEnvelope as Envelope } from "@phosphor-icons/vue";

const isDark = useDark();


const themeOverrides = computed(() => ({
  common: {
    primaryColor: isDark.value ? '#ffd700' : '#1a1f36',
    primaryColorHover: isDark.value ? '#ffed4e' : '#2d3348',
    primaryColorPressed: isDark.value ? '#e6c200' : '#0f1419',
    primaryColorSuppl: isDark.value ? 'rgba(255, 215, 0, 0.5)' : 'rgba(26, 31, 54, 0.5)'
  },
  Card: {
    borderRadius: '16px',
    color: isDark.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
    colorModal: isDark.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
    colorPopover: isDark.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
    boxShadow: isDark.value 
      ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)' 
      : '0 8px 32px rgba(26, 31, 54, 0.15), 0 4px 16px rgba(26, 31, 54, 0.1)'
  },
  Button: {
    borderRadius: '12px',
    colorPrimary: isDark.value 
      ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' 
      : 'linear-gradient(135deg, #1a1f36 0%, #2d3348 100%)',
    colorHoverPrimary: isDark.value 
      ? 'linear-gradient(135deg, #ffed4e 0%, #fff176 100%)' 
      : 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    colorPressedPrimary: isDark.value 
      ? 'linear-gradient(135deg, #e6c200 0%, #ffd700 100%)' 
      : 'linear-gradient(135deg, #0f1419 0%, #1a1f36 100%)'
  },
  Collapse: {
    titleFontWeight: '600'
  }
}));
</script>