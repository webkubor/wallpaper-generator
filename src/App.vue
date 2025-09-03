<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-global-style />
      <n-layout>
      <n-layout-header class="header">
        <div class="title-container">
          <img src="/webkubor.svg" class="logo" alt="Logo" />
          <h1 class="main-title">✨ 壁纸生成器</h1>
          <n-button type="warning" size="small" class="save-template-button" @click="saveAsTemplate">
            <template #icon>
              <n-icon :component="Star" />
            </template>
            保存为模板
          </n-button>
        </div>
        <div class="header-actions">
          <n-button type="info" class="save-config-button" @click="saveConfig">
            <template #icon>
              <n-icon :component="FloppyDisk" />
            </template>
            保存配置
          </n-button>
          <n-button type="primary" color="#f4d03f" class="download-button" @click="downloadWallpaper">
            <template #icon>
              <n-icon :component="Download" />
            </template>
            导出
          </n-button>
          <n-button @click="showDownloadModal = true" class="settings-button">
            <template #icon>
              <n-icon :component="Gear" />
            </template>
          </n-button>
        </div>
      </n-layout-header>
      <n-layout-content class="content">
        <WallpaperEditor ref="wallpaperEditorRef" />
      </n-layout-content>
      <Footer />
      <!-- 系统设置模态框 -->
      <SettingsModal 
        v-model:show="showDownloadModal"
        v-model:isDark="isDark"
        v-model:downloadOption="downloadOption"
        :isDownloading="isDownloading"
        @download="downloadWallpaper"
      />
    </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import WallpaperEditor from '@/components/WallpaperEditor.vue';
import Footer from '@/components/common/Footer.vue';
import SettingsModal from '@/components/common/SettingsModal.vue';
import { darkTheme, NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutContent, NIcon, NMessageProvider, NButton } from "naive-ui";
import { useDark } from "@vueuse/core";
import { computed, ref } from "vue";
import { PhDownload as Download, PhGear as Gear, PhFloppyDisk as FloppyDisk, PhStar as Star } from "@phosphor-icons/vue";
import html2canvas from 'html2canvas';
import { useWallpaper } from './composables/useWallpaper';
import { templateDB, type Template } from './utils/indexedDB';

const isDark = useDark();
const isDownloading = ref(false);
const showDownloadModal = ref(false);
const downloadOption = ref('withBackground'); // 默认包含背景
const wallpaperEditorRef = ref<{
  previewAreaRef: HTMLElement | null;
  loadTemplates?: () => Promise<void>;
} | null>(null);

// 获取壁纸配置
const { watermarkSettings, titleSettings, previewSettings } = useWallpaper();

// 保存为模板函数
const saveAsTemplate = async () => {
  if (!wallpaperEditorRef.value?.previewAreaRef) {
    console.error('预览区域未找到');
    return;
  }

  try {
    // 生成预览图片
    const previewArea = wallpaperEditorRef.value.previewAreaRef;
    const canvas = await html2canvas(previewArea, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      scale: 0.5, // 降低分辨率以节省存储空间
      logging: false
    });
    
    const previewImage = canvas.toDataURL('image/jpeg', 0.8);
    
    // 生成模板名称（可以后续改为用户输入）
    const templateName = `模板_${new Date().toLocaleString('zh-CN')}`;
    
    const template: Template = {
      id: Date.now().toString(),
      name: templateName,
      config: {
        watermarkSettings: JSON.parse(JSON.stringify(watermarkSettings.value)),
        titleSettings: JSON.parse(JSON.stringify(titleSettings.value)),
        previewSettings: JSON.parse(JSON.stringify(previewSettings.value)),
        downloadOption: downloadOption.value,
      },
      previewImage,
      timestamp: new Date().toISOString()
    };
    
    await templateDB.saveTemplate(template);
    console.log('模板保存成功！', template);
    
    // 通知 WallpaperEditor 刷新模板列表
    if (wallpaperEditorRef.value?.loadTemplates) {
      await wallpaperEditorRef.value.loadTemplates();
    }
  } catch (error) {
    console.error('保存模板时出错:', error);
  }
};

// 保存配置函数
const saveConfig = () => {
  try {
    const config = {
      watermarkSettings: watermarkSettings.value,
      titleSettings: titleSettings.value,
      previewSettings: previewSettings.value,
      downloadOption: downloadOption.value,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('wallpaper-config', JSON.stringify(config));
    console.log('配置保存成功！', config);
  } catch (error) {
    console.error('保存配置时出错:', error);
  }
};

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
    color: isDark.value ? '#1e1e1e' : '#ffffff',
    colorModal: isDark.value ? '#1e1e1e' : '#ffffff',
    colorPopover: isDark.value ? '#1e1e1e' : '#ffffff',
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