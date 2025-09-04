<template>
  <n-card class="settings-panel" hoverable bordered content-style="padding: 10px; height: 100%; overflow: auto;">
    <template #header>
      <div class="settings-header">
        <span>设置</span>
        <n-button  quaternary size="small" @click="$emit('resetConfig')">
          <template #icon>
            <n-icon :component="ArrowCounterClockwise" />
          </template>
          重置
        </n-button>
      </div>
    </template>
    <n-collapse default-expanded-names="1,3" style="height: 100%; overflow: auto;">
      <n-collapse-item name="1">
        <template #header>
          <div class="collapse-header">
            <n-icon :component="ImageSquare" class="header-icon" />
            <span>基础设置</span>
          </div>
        </template>
        <n-space vertical size="small">
          <n-form-item label="上传背景" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
            <n-upload :custom-request="() => {}" :show-file-list="false" @change="handleImageUpload">
              <n-button>
                <template #icon>
                  <n-icon :component="UploadSimple" />
                </template>
                选择图片
              </n-button>
            </n-upload>
          </n-form-item>
        </n-space>
      </n-collapse-item>

      <n-collapse-item name="2">
        <template #header>
          <div class="collapse-header">
            <n-icon :component="TextT" class="header-icon" />
            <span>定制设置</span>
          </div>
        </template>
        <n-space vertical size="small">
          <n-form-item label="显示标题" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
            <n-switch :value="titleSettings.show" @update:value="(val) => titleSettings.show = val" />
          </n-form-item>
          <TitleSettings v-if="titleSettings.show" />
          <WatermarkSettings />
          <BackgroundSettings :background-settings="backgroundSettings" />
        </n-space>
      </n-collapse-item>

      <n-collapse-item name="3">
        <template #header>
          <div class="collapse-header">
            <n-icon :component="Gear" class="header-icon" />
            <span>预览</span>
          </div>
        </template>
        <n-space vertical size="small">
          <n-form-item label="设备" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
            <n-select :value="previewSettings.selectedDevice" @update:value="(val) => previewSettings.selectedDevice = val" :options="deviceOptions" />
          </n-form-item>
          
          <!-- iPhone 刘海开关 -->
          <n-form-item v-if="previewSettings.selectedDevice === 'iphone'" label="刘海 (iOS)" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
            <n-switch :value="previewSettings.hasNotch" @update:value="(val) => previewSettings.hasNotch = val" />
          </n-form-item>
          
          <!-- 自定义尺寸输入 -->
          <div v-if="previewSettings.selectedDevice === 'custom'" class="custom-size-inputs">
            <n-form-item label="宽度" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-input-number :value="customWidth" @update:value="(val) => $emit('update:customWidth', val || 400)" :min="100" :max="3000" placeholder="宽度" />
            </n-form-item>
            <n-form-item label="高度" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-input-number :value="customHeight" @update:value="(val) => $emit('update:customHeight', val || 400)" :min="100" :max="3000" placeholder="高度" />
            </n-form-item>
            <n-button type="primary" size="small" color="#f4d03f" @click="confirmCustomSize">确定</n-button>
          </div>
        </n-space>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup lang="ts">
import { 
  NCard, NCollapse, NCollapseItem, NSpace, NFormItem, NIcon, NButton, NUpload,
  NSelect, NSwitch, NInputNumber
} from 'naive-ui';
import { PhImageSquare as ImageSquare, PhUploadSimple as UploadSimple, PhTextT as TextT, PhGear as Gear, PhArrowCounterClockwise as ArrowCounterClockwise } from "@phosphor-icons/vue";
import WatermarkSettings from './toolbar/WatermarkSettings.vue';
import TitleSettings from './toolbar/TitleSettings.vue';
import BackgroundSettings from './toolbar/BackgroundSettings.vue';
import { useWallpaper } from '@/composables/useWallpaper';
import type { UploadFileInfo } from 'naive-ui';

interface Props {
  backgroundSettings: any;
  customWidth: number;
  customHeight: number;
}

defineProps<Props>();

const emit = defineEmits<{
  resetConfig: [];
  imageUpload: [file: UploadFileInfo];
  confirmCustomSize: [];
  'update:customWidth': [value: number];
  'update:customHeight': [value: number];
}>();

// 直接使用 useWallpaper 获取数据
const { 
  previewSettings,
  deviceOptions,
  titleSettings
} = useWallpaper();

const handleImageUpload = (options: { file: UploadFileInfo }) => {
  emit('imageUpload', options.file);
};

const confirmCustomSize = () => {
  emit('confirmCustomSize');
};
</script>

<style scoped lang="scss">
.settings-panel {
  width: 380px;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.settings-panel:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.collapse-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  color: var(--n-primary-color);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  span {
    font-weight: 600;
    font-size: 16px;
  }
}

.custom-size-inputs {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  .n-form-item {
    flex: 1;
    margin-bottom: 0;
  }
}
</style>
