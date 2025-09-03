<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-global-style />
      <n-layout>
      <n-layout-header class="header">
        <div class="title-container">
          <img src="/webkubor.svg" class="logo" alt="Logo" />
          <h1 class="main-title">✨ 壁纸生成器</h1>
        </div>
        <div class="header-actions">
          <n-button type="primary" color="#f4d03f" class="download-button" @click="downloadWallpaper">
            <template #icon>
              <n-icon :component="Download" />
            </template>
            下载壁纸
          </n-button>
          <n-button @click="showDownloadModal = true" class="settings-button">
            <template #icon>
              <n-icon :component="Gear" />
            </template>
            下载设置
          </n-button>
          <n-switch v-model:value="isDark">
            <template #checked-icon>
              <n-icon :component="Moon" />
            </template>
            <template #unchecked-icon>
              <n-icon :component="Sun" />
            </template>
          </n-switch>
        </div>
      </n-layout-header>
      <n-layout-content class="content">
        <WallpaperEditor ref="wallpaperEditorRef" />
      </n-layout-content>
      <n-layout-footer class="footer" bordered>
        <div class="footer-content">
          <div class="footer-left">
            <p class="footer-text"><n-icon :component="Code" class="footer-icon" /> Designed & Developed by <span class="highlight">webkubor</span></p>
          </div>
          <div class="footer-right">
            <p class="footer-text"><n-icon :component="Envelope" class="footer-icon" /> <a href="mailto:webkubor@163.com">webkubor@163.com</a></p>
          </div>
        </div>
      </n-layout-footer>
      
      <!-- 下载设置模态框 -->
      <n-modal v-model:show="showDownloadModal" preset="card" style="width: 400px" title="下载设置">
        <n-space vertical>
          <n-form-item label="下载选项">
            <n-radio-group v-model:value="downloadOption">
              <n-space vertical>
                <n-radio value="withBackground">包含背景（下载整个预览区）</n-radio>
                <n-radio value="withoutBackground">不包含背景（仅下载壁纸区域）</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          
          <n-space justify="end">
            <n-button @click="showDownloadModal = false">取消</n-button>
            <n-button type="primary" :loading="isDownloading" @click="downloadWallpaper">下载</n-button>
          </n-space>
        </n-space>
      </n-modal>
    </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import WallpaperEditor from '@/components/WallpaperEditor.vue';
import { darkTheme, NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NSwitch, NIcon, NMessageProvider, NButton, NModal, NSpace, NFormItem, NRadio, NRadioGroup } from "naive-ui";
import { useDark } from "@vueuse/core";
import { computed, ref } from "vue";
import { PhSun as Sun, PhMoon as Moon, PhCode as Code, PhEnvelope as Envelope, PhDownload as Download, PhGear as Gear } from "@phosphor-icons/vue";
import html2canvas from 'html2canvas';

const isDark = useDark();
const isDownloading = ref(false);
const showDownloadModal = ref(false);
const downloadOption = ref('withBackground'); // 默认包含背景
const wallpaperEditorRef = ref<{
  previewAreaRef: HTMLElement | null
} | null>(null);

// 下载壁纸函数
const downloadWallpaper = () => {
  if (wallpaperEditorRef.value && wallpaperEditorRef.value.previewAreaRef) {
    isDownloading.value = true;
    const previewArea = wallpaperEditorRef.value.previewAreaRef;
    
    // 根据选项决定下载整个预览区还是仅壁纸区域
    const targetElement = downloadOption.value === 'withBackground' 
      ? previewArea // 整个预览区（包含背景）
      : previewArea.querySelector('.wallpaper-content') || previewArea.querySelector('.preview-canvas') || previewArea; // 仅壁纸区域
    
    html2canvas(targetElement as HTMLElement, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      scale: 2,
      logging: false
    }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'wallpaper.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).finally(() => {
      isDownloading.value = false;
    });
  }
};


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

<style scoped lang="scss">
.content {
  flex: 1;
  overflow-y: auto;
}

.footer {
  padding: 12px 24px;
  color: var(--n-text-color);
  font-size: 14px;
  min-height: 50px;
  background-color: var(--n-color-modal);
  border-top: 1px solid var(--n-border-color);
  backdrop-filter: blur(10px);
  font-family: 'AlimamaFangYuanTiVF-Thin', system-ui, sans-serif;
  
  .footer-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .footer-left, .footer-right {
    display: flex;
    align-items: center;
  }
  
  .footer-text {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 0.5px;
  }
  
  .highlight {
    color: var(--n-primary-color);
    font-weight: 600;
    letter-spacing: 1px;
  }

  a {
    color: var(--n-primary-color);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    padding-bottom: 2px;
    
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: 0;
      left: 0;
      background-color: var(--n-primary-color-hover);
      transition: width 0.3s ease;
    }

    &:hover {
      color: var(--n-primary-color-hover);
      
      &:after {
        width: 100%;
      }
    }
  }
  
  .footer-icon {
    color: var(--n-primary-color);
    font-size: 16px;
  }
}

.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .download-button {
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(244, 208, 63, 0.3);
      }
    }
    
    .settings-button {
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  .title-container {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .logo {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
    
    .main-title {
      font-size: 24px;
      font-weight: 800;
      margin: 0;
      font-family: 'AlimamaFangYuanTiVF-Thin', system-ui, sans-serif;
      color: var(--n-text-color);
    }
  }
}
</style>