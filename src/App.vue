<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
      <n-global-style />
      <PWAPrompt />
      <n-layout>
      <Header 
        :hide-actions="isXHS"
        @download="downloadWallpaper"
        @download-poster="downloadPoster"
      />
      <n-layout-content class="content">
        <router-view v-slot="{ Component }">
          <component :is="Component" v-if="isXHS" />
        </router-view>
        <WallpaperEditor 
          v-if="!isXHS" 
          ref="wallpaperEditorRef" 
          @save-template="saveAsTemplate"
          @save-config="saveConfig"
          @open-settings="showDownloadModal = true"
        />
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
      
      <!-- 分享卡片弹窗 -->
      <ShareCard 
        v-model:show="showShareCard"
        :wallpaper-image="currentWallpaperImage"
      />
    </n-layout>
  </n-config-provider>
</template>
<script setup lang="ts">
import WallpaperEditor from '@/components/WallpaperEditor.vue';
import Footer from '@/components/common/Footer.vue';
import SettingsModal from '@/components/common/SettingsModal.vue';
import Header from '@/components/common/Header.vue';
import ShareCard from '@/components/common/ShareCard.vue';
import PWAPrompt from '@/components/PWAPrompt.vue';
import { darkTheme, NConfigProvider, NGlobalStyle, NLayout, NLayoutContent } from "naive-ui";
import { useDark } from "@vueuse/core";
import { computed, ref } from "vue";
import { useRoute } from 'vue-router';
import { useWallpaper } from './composables/useWallpaper';
import { templateDB, type Template } from './utils/indexedDB';
import { captureWallpaper } from './utils/captureUtils';
import { formatFileTimestamp } from './utils/time';

const isDark = useDark();
const route = useRoute();
const isXHS = computed(() => route.path === '/xhs');
const isDownloading = ref(false);
const showDownloadModal = ref(false);
const showShareCard = ref(false);
const currentWallpaperImage = ref('');
const downloadOption = ref('withoutBackground'); // 默认不包含背景，仅导出设备和装饰
const fileNamePrefix = ref('wallpaper'); // 文件名前缀
const fileNameMode = ref('timestamp'); // 命名模式：timestamp 或 imageName
const wallpaperEditorRef = ref<{
  previewAreaRef: HTMLElement | null;
  loadTemplates?: () => Promise<void>;
} | null>(null);

// 获取壁纸配置
const { watermarkSettings, titleSettings, previewSettings, backgroundSettings, imageUrl } = useWallpaper();

// 保存为模板函数
const saveAsTemplate = async () => {
  if (!wallpaperEditorRef.value?.previewAreaRef) {
    console.error('预览区域未找到');
    return;
  }

  try {
    // 生成预览图片
    const previewArea = wallpaperEditorRef.value.previewAreaRef;
    const { captureElement } = await import('./utils/captureUtils');
    const canvas = await captureElement(previewArea, {
      backgroundColor: null,
      useCORS: true,
      scale: 1
    });
    
    const previewImage = canvas.toDataURL('image/jpeg', 0.8);
    
    // 生成模板名称（默认不带时间，时间存入 timestamp 字段，避免影响后续重命名）
    const templateName = '个人模板';
    
    const template: Template = {
      id: Date.now().toString(),
      name: templateName,
      config: {
        watermarkSettings: JSON.parse(JSON.stringify(watermarkSettings.value)),
        titleSettings: JSON.parse(JSON.stringify(titleSettings.value)),
        previewSettings: JSON.parse(JSON.stringify(previewSettings.value)),
        backgroundSettings: JSON.parse(JSON.stringify(backgroundSettings.value)),
        downloadOption: downloadOption.value,
      },
      previewImage,
      timestamp: new Date().toISOString()
    };
    
    await templateDB.saveTemplate(template);
    console.log('模板保存成功！', template);
    if (window && (window as any).$message) {
      (window as any).$message.success('模板保存成功');
    }
    
    // 通知 WallpaperEditor 刷新模板列表
    if (wallpaperEditorRef.value?.loadTemplates) {
      await wallpaperEditorRef.value.loadTemplates();
    }
  } catch (error) {
    console.error('保存模板时出错:', error);
    if (window && (window as any).$message) {
      ;(window as any).$message.error('模板保存失败');
    }
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
    if (window && (window as any).$message) {
      (window as any).$message.success('配置已保存');
    }
  } catch (error) {
    console.error('保存配置时出错:', error);
    if (window && (window as any).$message) {
      ;(window as any).$message.error('配置保存失败');
    }
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
    const timestamp = formatFileTimestamp();
    return `${prefix}_${timestamp}.png`;
  }
};

// 下载壁纸函数
const downloadWallpaper = async () => {
  if (wallpaperEditorRef.value && wallpaperEditorRef.value.previewAreaRef) {
    isDownloading.value = true;
    
    try {
      await captureWallpaper(
        wallpaperEditorRef.value.previewAreaRef,
        downloadOption.value as 'withBackground' | 'withoutBackground',
        generateFileName()
      );
      
      // 导出成功后显示分享卡片
      currentWallpaperImage.value = imageUrl.value || '';
      showShareCard.value = true;
    } catch (error) {
      console.error('导出失败:', error);
    } finally {
      isDownloading.value = false;
    }
  }
};

// 下载海报函数
const downloadPoster = () => {
  // 触发海报页面的下载事件
  window.dispatchEvent(new CustomEvent('downloadPoster'));
};


const themeOverrides = computed(() => ({
  common: {
    primaryColor: isDark.value ? '#9aa7a1' : '#9aa7a1',
    primaryColorHover: isDark.value ? '#a7b3ac' : '#8a968f',
    primaryColorPressed: isDark.value ? '#7d8b84' : '#7d8b84',
    primaryColorSuppl: isDark.value ? 'rgba(154, 167, 161, 0.5)' : 'rgba(154, 167, 161, 0.35)'
  },
  Card: {
    borderRadius: '16px',
    color: isDark.value ? '#2f2e2b' : '#fbf7f1',
    colorModal: isDark.value ? '#2f2e2b' : '#fbf7f1',
    colorPopover: isDark.value ? '#2f2e2b' : '#fbf7f1',
    boxShadow: isDark.value 
      ? '0 10px 34px rgba(0, 0, 0, 0.35), 0 6px 18px rgba(0, 0, 0, 0.2)' 
      : '0 16px 40px rgba(74, 63, 55, 0.12), 0 6px 18px rgba(74, 63, 55, 0.08)'
  },
  Button: {
    borderRadius: '12px',
    colorPrimary: isDark.value ? '#9aa7a1' : '#c7b5a5',
    colorHoverPrimary: isDark.value ? '#a7b3ac' : '#cdbbad',
    colorPressedPrimary: isDark.value ? '#7d8b84' : '#b5a08f'
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
