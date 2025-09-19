<template>
  <!-- 移动端操作栏 -->
  <div class="mobile-action-bar">
    <n-tooltip placement="top" trigger="hover">
      <template #trigger>
        <n-button quaternary circle @click="openDrawer('upload')">
          <n-icon :component="UploadSimple" />
        </n-button>
      </template>
      上传
    </n-tooltip>
    <n-tooltip placement="top" trigger="hover">
      <template #trigger>
        <n-button quaternary circle @click="openDrawer('preview')">
          <n-icon :component="ImageSquare" />
        </n-button>
      </template>
      预览/设备
    </n-tooltip>
    <n-tooltip placement="top" trigger="hover">
      <template #trigger>
        <n-button quaternary circle @click="openDrawer('title')">
          <n-icon :component="TextT" />
        </n-button>
      </template>
      标题
    </n-tooltip>
    <n-tooltip placement="top" trigger="hover">
      <template #trigger>
        <n-button quaternary circle @click="openDrawer('watermark')">
          <n-icon :component="Droplets" />
        </n-button>
      </template>
      水印
    </n-tooltip>
    <n-tooltip placement="top" trigger="hover">
      <template #trigger>
        <n-button quaternary circle @click="openDrawer('background')">
          <n-icon :component="Gear" />
        </n-button>
      </template>
      背景
    </n-tooltip>
    <n-tooltip placement="top" trigger="hover">
      <template #trigger>
        <n-button quaternary circle @click="openDrawer('templates')">
          <n-icon :component="BookmarkSimple" />
        </n-button>
      </template>
      收藏
    </n-tooltip>
    <n-tooltip placement="top" trigger="hover">
      <template #trigger>
        <n-button quaternary circle @click="handleResetConfig">
          <n-icon :component="ArrowCounterClockwise" />
        </n-button>
      </template>
      重置
    </n-tooltip>
    <n-tooltip placement="top" trigger="hover">
      <template #trigger>
        <n-button quaternary circle @click="emit('open-wallpaper-library')">
          <n-icon :component="ImageSquare" />
        </n-button>
      </template>
      壁纸素材
    </n-tooltip>
    <n-tooltip placement="top" trigger="hover">
      <template #trigger>
        <n-button quaternary circle @click="openGemini">
          <n-icon :component="ChatCircle" />
        </n-button>
      </template>
      AI助手
    </n-tooltip>
  </div>

  <!-- 移动端抽屉 -->
  <MobileBottomSheet v-model:show="mobileDrawerShow" :title="mobileDrawerTitle">
    <div class="mobile-drawer-body compact">
      <!-- 上传 -->
      <template v-if="mobileActivePanel === 'upload'">
        <n-upload :custom-request="() => {}" :show-file-list="false" @change="({ file }) => handleImageUpload(file)">
          <n-button size="small" block>
            <template #icon>
              <n-icon :component="UploadSimple" />
            </template>
            选择图片
          </n-button>
        </n-upload>
      </template>

      <!-- 预览/设备 -->
      <template v-else-if="mobileActivePanel === 'preview'">
        <n-form-item label="设备" size="small">
          <n-select size="small" :value="previewSettings.selectedDevice" @update:value="(val) => previewSettings.selectedDevice = val" :options="deviceOptions" />
        </n-form-item>
        <n-form-item v-if="previewSettings.selectedDevice === 'iphone'" label="刘海 (iOS)" size="small">
          <n-switch size="small" :value="previewSettings.hasNotch" @update:value="(val) => previewSettings.hasNotch = val" />
        </n-form-item>
        <div v-if="previewSettings.selectedDevice === 'custom'" class="custom-size-inputs">
          <n-form-item label="宽度" size="small">
            <n-input-number size="small" v-model:value="customWidth" :min="100" :max="3000" placeholder="宽度" />
          </n-form-item>
          <n-form-item label="高度" size="small">
            <n-input-number size="small" v-model:value="customHeight" :min="100" :max="3000" placeholder="高度" />
          </n-form-item>
          <n-button type="primary" size="small" color="#f4d03f" @click="confirmCustomSize">确定</n-button>
        </div>
      </template>

      <!-- 其他面板内容保持不变 -->
    </div>
  </MobileBottomSheet>
</template>

<script setup lang="ts">
import { useWallpaper } from '@/hooks/useWallpaper';
import { useMobile } from '@/hooks/useMobile';
import { 
  NButton, NTooltip, NIcon, NUpload, 
  NFormItem, NSelect, NSwitch, NInputNumber 
} from 'naive-ui';
import { 
  PhUploadSimple as UploadSimple, 
  PhImage as ImageSquare,
  PhTextT as TextT,
  PhDrop as Droplets,
  PhGear as Gear,
  PhBookmarkSimple as BookmarkSimple,
  PhArrowCounterClockwise as ArrowCounterClockwise,
  PhChatCircle as ChatCircle
} from '@phosphor-icons/vue';
import MobileBottomSheet from './common/MobileBottomSheet.vue';
import { computed, ref, type CSSProperties } from 'vue';

const { 
  previewSettings,
  customWidth,
  customHeight,
  deviceOptions,
  resetConfig
} = useWallpaper();

const { isMobile, mobileDrawerShow } = useMobile();

type MobilePanel = 'upload' | 'preview' | 'title' | 'watermark' | 'background' | 'templates';
const mobileActivePanel = ref<MobilePanel>('upload');
const mobileDrawerTitle = computed(() => {
  const map: Record<MobilePanel, string> = {
    upload: '上传背景',
    preview: '预览与设备',
    title: '标题设置',
    watermark: '水印设置',
    background: '背景设置',
    templates: '个人收藏'
  };
  return map[mobileActivePanel.value];
});

const openDrawer = (panel: MobilePanel) => {
  if (!isMobile.value) return;
  mobileActivePanel.value = panel;
  mobileDrawerShow.value = true;
};

const confirmCustomSize = () => {
  if (previewSettings.value.selectedDevice === 'custom') {
    const customDeviceIndex = previewSettings.value.devices.findIndex((device: any) => device.id === 'custom');
    if (customDeviceIndex !== -1) {
      previewSettings.value.devices[customDeviceIndex].width = customWidth.value;
      previewSettings.value.devices[customDeviceIndex].height = customHeight.value;
    }
  }
};

const { handleImageUpload } = useWallpaper();

const handleResetConfig = async () => {
  await resetConfig();
};

const emit = defineEmits(['open-wallpaper-library']);

const openGemini = () => {
  window.location.hash = '/gemini';
};
</script>

<style scoped>
/* 移动端操作栏样式 */
.mobile-action-bar {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 16px;
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  border-radius: 999px;
  padding: 6px 8px;
  display: flex;
  gap: 6px;
  z-index: 2000;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* 移动端抽屉紧凑样式 */
.mobile-drawer-body.compact {
  display: grid;
  gap: 8px;
}

/* 缩小表单项的垂直间距 */
:deep(.n-form-item) {
  margin-bottom: 8px;
}

/* 缩小 label 字号与内边距 */
:deep(.n-form-item .n-form-item-label) {
  font-size: 12px;
  padding-bottom: 4px;
}

/* 选择器与数字输入宽度拉满 */
:deep(.n-select),
:deep(.n-input-number) {
  width: 100%;
}

/* 自定义尺寸区域布局更紧凑 */
.custom-size-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  align-items: center;
}
</style>