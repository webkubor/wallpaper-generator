<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-global-style />
      <n-layout>
      <Header 
        @save-template="saveAsTemplate"
        @save-config="saveConfig"
        @download="downloadWallpaper"
        @open-settings="showDownloadModal = true"
      />
      <n-layout-content class="content">
        <WallpaperEditor ref="wallpaperEditorRef" />
      </n-layout-content>
      <Footer />
      <!-- 系统设置模态框 -->
      <SettingsModal 
        v-model:show="showDownloadModal"
        v-model:isDark="isDark"
        v-model:downloadOption="downloadOption"
        v-model:fileNamePrefix="fileNamePrefix"
        v-model:fileNameMode="fileNameMode"
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
import Header from '@/components/common/Header.vue';
import { darkTheme, NConfigProvider, NGlobalStyle, NLayout, NLayoutContent, NMessageProvider } from "naive-ui";
import { useDark } from "@vueuse/core";
import { computed, ref } from "vue";
import html2canvas from 'html2canvas';
import { useWallpaper } from './composables/useWallpaper';
import { templateDB, type Template } from './utils/indexedDB';

const isDark = useDark();
const isDownloading = ref(false);
const showDownloadModal = ref(false);
const downloadOption = ref('withBackground'); // 默认包含背景
const fileNamePrefix = ref('wallpaper'); // 文件名前缀
const fileNameMode = ref('timestamp'); // 命名模式：timestamp 或 imageName
const wallpaperEditorRef = ref<{
  previewAreaRef: HTMLElement | null;
  loadTemplates?: () => Promise<void>;
} | null>(null);

// 获取壁纸配置
const { watermarkSettings, titleSettings, previewSettings, imageUrl } = useWallpaper();

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

// 生成文件名函数
const generateFileName = () => {
  const prefix = fileNamePrefix.value || 'wallpaper';
  
  if (fileNameMode.value === 'imageName' && imageUrl.value) {
    // 从图片URL中提取文件名（不包含扩展名）
    const urlParts = imageUrl.value.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const nameWithoutExt = fileName.split('.')[0];
    return `${prefix}_${nameWithoutExt}.png`;
  } else {
    // 使用时间戳
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `${prefix}_${timestamp}.png`;
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
      link.download = generateFileName();
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


</style>