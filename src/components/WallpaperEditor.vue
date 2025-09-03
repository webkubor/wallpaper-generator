<template>
  <div class="editor-container">
    <div class="wallpaper-editor">
    <!-- Left: Settings Panel -->
    <n-card class="settings-panel" hoverable bordered content-style="padding: 10px; height: 100%; overflow: auto;">
      <template #header>
        <div class="settings-header">
          <span>设置</span>
          <n-button type="warning" size="small" @click="resetConfig">
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
            <TitleSettings v-model:settings="titleSettings" />
            <WatermarkSettings v-model:settings="watermarkSettings" />

            <BackgroundSettings v-model:settings="backgroundSettings" />
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
              <n-select v-model:value="previewSettings.selectedDevice" :options="deviceOptions" />
            </n-form-item>
            
            <!-- iPhone 刘海开关 -->
            <n-form-item v-if="previewSettings.selectedDevice === 'iphone'" label="刘海 (iOS)" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-switch v-model:value="previewSettings.hasNotch" />
            </n-form-item>
            
            <!-- 自定义尺寸输入 -->
            <div v-if="previewSettings.selectedDevice === 'custom'" class="custom-size-inputs">
              <n-form-item label="宽度" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
                <n-input-number v-model:value="customWidth" :min="100" :max="3000" placeholder="宽度" />
              </n-form-item>
              <n-form-item label="高度" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
                <n-input-number v-model:value="customHeight" :min="100" :max="3000" placeholder="高度" />
              </n-form-item>
              <n-button type="primary" size="small" color="#f4d03f" @click="confirmCustomSize">确定</n-button>
            </div>
          </n-space>
        </n-collapse-item>
      </n-collapse>
    </n-card>

    <!-- Center: Preview Area -->
    <div ref="previewAreaRef" class="preview-area" :style="previewAreaStyle">
      <img 
        v-if="backgroundSettings.type === 'perspective' && imageUrl"
        :src="imageUrl" 
        class="perspective-bg"
        alt="Perspective Background"
      />
        <div ref="previewCanvasRef" class="preview-canvas" :style="canvasStyle">
          <!-- 设备框架 -->
          <PhoneFrame v-if="currentDevice?.id === 'iphone' && currentDevice?.hasFrame" :has-notch="previewSettings.hasNotch" />
          <TabletFrame v-if="currentDevice?.id === 'ipad' && currentDevice?.hasFrame" />
          <MacFrame v-if="currentDevice?.id === 'mac' && currentDevice?.hasFrame" />
          <CarFrame v-if="currentDevice?.id === 'car' && currentDevice?.hasFrame" />
          <ComboDevices v-if="currentDevice?.id === 'combo' && currentDevice?.hasFrame" />
          <CustomFrame 
            v-if="currentDevice?.id === 'custom'"
            :width="customWidth"
            :height="customHeight"
            :imageUrl="imageUrl || ''"
          />
          
          <!-- 壁纸背景已移至各设备框架内部 -->
          
          <!-- Cropper Modal -->
          <n-modal v-model:show="showCropperModal" preset="card" style="width: 80vw; height: 80vh;" title="裁剪图片">
            <div class="cropper-container">
              <VueCropper
                ref="cropperRef"
                :img="cropperSource"
                :auto-crop="true"
                :fixed-box="false"
                :fixed="false"
                :center-box="true"
                :auto-crop-width="currentDevice.width"
                :auto-crop-height="currentDevice.height"
                :aspect-ratio="currentDevice.width / currentDevice.height"
                output-type="png"
              />
            </div>
            <template #footer>
              <n-space justify="end">
                <n-button @click="showCropperModal = false">取消</n-button>
                <n-button type="primary" @click="confirmCrop">确认</n-button>
              </n-space>
            </template>
          </n-modal>
        </div>

        <!-- 标题 -->
        <div :style="titleContainerStyle">
          <div ref="titleRef" class="title-display draggable" :style="titleDragStyle" @mousedown="titleDragHandler.onMouseDown">
            <span :style="titleStyle">{{ titleSettings.text }}</span>
          </div>
        </div>

        <!-- 水印 -->
        <div ref="watermarkRef" class="watermark draggable" :style="watermarkPositionStyle" @mousedown="watermarkDragHandler.onMouseDown">
          <img v-if="watermarkImageUrl" :src="watermarkImageUrl" class="watermark-image" />
          <span v-if="watermarkSettings.text" :style="watermarkStyle">{{ watermarkSettings.text }}</span>
        </div>
      </div>
      
      <!-- 个人模板列表 -->
      <PersonalTemplates 
        ref="personalTemplatesRef"
        @load-template="loadTemplate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue';
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { useWallpaper, defaultWatermarkSettings, defaultTitleSettings, defaultPreviewSettings } from '../composables/useWallpaper';
import { createDragHandler } from '../utils';
import { type Template } from '../utils/indexedDB';

import { 
  useMessage,
  NCard, NCollapse, NCollapseItem, NSpace, NFormItem, NIcon, NButton, NUpload, NModal, NInputNumber,
  NSelect, NSwitch
} from 'naive-ui';

import { PhImageSquare as ImageSquare, PhUploadSimple as UploadSimple, PhTextT as TextT, PhGear as Gear, PhArrowCounterClockwise as ArrowCounterClockwise } from "@phosphor-icons/vue";

// 设备框架组件
import PhoneFrame from './iphone/PhoneFrame.vue';
import TabletFrame from './ipad/TabletFrame.vue';
import MacFrame from './mac/MacFrame.vue';
import CarFrame from './car/CarFrame.vue';
import ComboDevices from './combo/ComboDevices.vue';
import CustomFrame from './custom/CustomFrame.vue';
import WatermarkSettings from './WatermarkSettings.vue';
import TitleSettings from './TitleSettings.vue';
import PersonalTemplates from './PersonalTemplates.vue';
import BackgroundSettings from '@/components/BackgroundSettings.vue';
import type { UploadFileInfo } from 'naive-ui';

const message = useMessage();

const { 
  imageUrl, 
  watermarkImageUrl,
  watermarkSettings,
  titleSettings,
  previewSettings,
  deviceOptions,
  currentDevice,
  watermarkPositionStyle
} = useWallpaper();

const backgroundSettings = ref({
  type: 'perspective',
  color: '#7D6A6A5E', // 更新纯色背景的默认值
});

const previewAreaRef = ref<HTMLElement | null>(null);

const previewCanvasRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const watermarkRef = ref<HTMLElement | null>(null);
// 下载状态已移至App.vue

const titleStyle = computed(() => ({
  fontFamily: titleSettings.value.fontFamily,
  color: titleSettings.value.color,
  fontSize: '24px',
  fontWeight: 500,
  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
}));

const titleContainerStyle = computed((): CSSProperties => ({
  position: 'absolute',
  top: '50%',
  left: '30px',
  transform: 'translateY(-50%)',
  zIndex: 2,
}));

const titleDragStyle = computed((): CSSProperties => {
  const { direction, offsetX, offsetY } = titleSettings.value;
  return {
    transform: `translate(${offsetX}px, ${offsetY}px)`,
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    writingMode: direction === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };
});
const showCropperModal = ref(false);
const cropperSource = ref('');
const cropperRef = ref<any>(null);

// 自定义尺寸相关
const customWidth = ref(400);
const customHeight = ref(400);

// 确认自定义尺寸
const confirmCustomSize = () => {
  if (previewSettings.value.selectedDevice === 'custom') {
    // 找到自定义尺寸设备并更新其尺寸
    const customDeviceIndex = previewSettings.value.devices.findIndex(device => device.id === 'custom');
    if (customDeviceIndex !== -1) {
      previewSettings.value.devices[customDeviceIndex].width = customWidth.value;
      previewSettings.value.devices[customDeviceIndex].height = customHeight.value;
    }
  }
};

const handleImageUpload = (options: { file: UploadFileInfo }) => {
  const file = options.file.file;
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      cropperSource.value = e.target?.result as string;
      showCropperModal.value = true;
    };
    reader.readAsDataURL(file);
  } else {
    message.error('请上传图片文件');
  }
};

const confirmCrop = () => {
  cropperRef.value.getCropData((data: string) => {
    imageUrl.value = data;
    showCropperModal.value = false;
    message.success('背景图片上传成功');
  });
};


// 下载功能已移至App.vue

// 水印样式 - 字体、颜色等基本样式
const watermarkStyle = computed(() => ({
  fontFamily: watermarkSettings.value.fontFamily,
  fontSize: `${watermarkSettings.value.fontSize}px`,
  color: watermarkSettings.value.color,
  opacity: Math.min(watermarkSettings.value.opacity + 0.2, 1), // 增加基础透明度
  fontWeight: 800,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.6), 0 0 8px rgba(255, 255, 255, 0.5)', // 增强文字阴影效果
  letterSpacing: '1px', // 增加字间距
  textStroke: '1px rgba(0, 0, 0, 0.3)', // 添加文字描边
  WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)', // 兼容 Webkit 浏览器
}));


const previewAreaStyle = computed(() => {
  if (backgroundSettings.value.type === 'color') {
    return { background: backgroundSettings.value.color };
  }
  return {};
});

// 拖拽功能
const titleDragHandler = createDragHandler(
  (x, y) => {
    titleSettings.value.offsetX = x;
    titleSettings.value.offsetY = y;
  },
  () => ({ x: titleSettings.value.offsetX, y: titleSettings.value.offsetY })
);

const watermarkDragHandler = createDragHandler(
  (x, y) => {
    watermarkSettings.value.offsetX = x;
    watermarkSettings.value.offsetY = y;
  },
  () => ({ x: watermarkSettings.value.offsetX, y: watermarkSettings.value.offsetY })
);

const canvasStyle = computed(() => ({
  width: `${currentDevice.value.width}px`,
  height: `${currentDevice.value.height}px`,
}));

// 个人模板组件引用
const personalTemplatesRef = ref<{ loadTemplates: () => Promise<void> } | null>(null);

// 加载模板配置
const loadTemplate = (template: Template) => {
  try {
    Object.assign(watermarkSettings.value, template.config.watermarkSettings);
    Object.assign(titleSettings.value, template.config.titleSettings);
    Object.assign(previewSettings.value, template.config.previewSettings);
    message.success(`已加载模板: ${template.name}`);
  } catch (error) {
    console.error('加载模板失败:', error);
    message.error('加载模板失败');
  }
};

// 暴露函数给父组件
defineExpose({
  previewAreaRef,
  loadTemplates: () => personalTemplatesRef.value?.loadTemplates()
});

// 重置配置函数
const resetConfig = () => {
  // 重置所有设置为默认值
  Object.assign(watermarkSettings.value, JSON.parse(JSON.stringify(defaultWatermarkSettings)));
  Object.assign(titleSettings.value, JSON.parse(JSON.stringify(defaultTitleSettings)));
  Object.assign(previewSettings.value, JSON.parse(JSON.stringify(defaultPreviewSettings)));
  
  backgroundSettings.value = {
    type: 'perspective',
    color: '#7D6A6A5E',
  };
  customWidth.value = 400;
  customHeight.value = 400;
  
  message.success('配置已重置为默认值');
};


</script>

<style scoped lang="scss">
.editor-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: calc(100vh - 110px); /* 减去头部(64px)和底部(40px)的高度以及一些间距 */
  box-sizing: border-box;
  margin: 0 auto;
  overflow: hidden;
}

.wallpaper-editor {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

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

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 8px;
  z-index: 1;
  color: var(--n-text-color-disabled);
}

.input-with-icon-field {
  width: 100%;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-icon {
  color: var(--n-primary-color);
}

.download-button {
  margin-top: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-area {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  z-index: 1;
  background: var(--n-body-color);
  width: 100%;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.perspective-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px) brightness(0.8); /* 降低模糊度，提高亮度 */
  transform: scale(1.1);
  z-index: 0;
}

.preview-container {
  padding: 10px;
  overflow: hidden;
  background-color: var(--n-body-color);
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.preview-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.cropper-container {
  width: 100%;
  height: 100%;
}

.preview-canvas {
  position: relative;
  display: flex;
  transition: all 0.3s ease;
  flex-shrink: 0;
  max-width: 100%;
  max-height: 100%;
  z-index: 1;
  transform-origin: center center;
  background-color: transparent; /* 确保背景透明 */
}


.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent; /* 确保备用背景透明 */
}

.draggable {
  cursor: move;
  touch-action: none; /* 禁用触摸滚动，优化拖拽体验 */
}

.watermark {
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 100; /* 增加z-index确保水印层级高于其他元素 */
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: pulse 2s infinite ease-in-out; /* 添加脉冲动画效果 */
}

.phone-top-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.phone-bottom-icon {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.tablet-top-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.tablet-dock {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.mac-top-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.mac-dock {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.title-display {
  transition: all 0.3s ease;
  z-index: 100; /* 增加z-index与水印层级一致 */
}

.title-display[style*="vertical-rl"] {
  letter-spacing: 0.1em;
}

@keyframes pulse {
  0% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.9;
  }
}

.watermark-image {
  height: 30px;
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

</style>
