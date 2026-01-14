<template>
  <div class="wallpaper-editor">
    <!-- Left: Settings Panel (Desktop only) -->
    <SettingsToolbar 
      v-if="!isMobile"
      :background-settings="backgroundSettings"
      v-model:custom-width="customWidth"
      v-model:custom-height="customHeight"
      @reset-config="handleResetConfig"
      @image-upload="handleImageUpload"
      @confirm-custom-size="confirmCustomSize"
      @load-template="loadTemplate"
      @save-config="emit('save-config')"
      @save-template="emit('save-template')"
      @open-settings="emit('open-settings')"
    />

    <!-- Center: Preview Area -->
    <div ref="previewAreaRef" class="preview-area" :style="previewAreaStyle">
      <img 
        v-if="backgroundSettings.type === 'perspective' && imageUrl"
        :src="imageUrl || undefined" 
        class="perspective-bg"
        alt="Perspective Background"
      />
      
      <!-- Export Preview UI -->
      <div 
        class="export-container" 
        :class="{ 'preview-mode': showExportPreview }"
        :style="exportContainerStyle"
      >
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
                <n-button type="primary" color="#f4d03f" @click="confirmCrop">确认</n-button>
              </n-space>
            </template>
          </n-modal>
        </div>

        <!-- 标题 -->
        <div v-if="titleSettings.show" :style="titleContainerStyle">
          <div ref="titleRef" class="title-display draggable" :style="titleDragStyle" @mousedown="titleDragHandler.onMouseDown">
            <span :style="titleStyle">{{ titleSettings.text }}</span>
          </div>
        </div>

        <!-- 水印 -->
        <div ref="watermarkRef" class="watermark draggable" :style="watermarkPositionStyle" @mousedown="watermarkDragHandler.onMouseDown">
          <img v-if="watermarkImageUrl" :src="(watermarkImageUrl as string)" class="watermark-image" />
          <span v-if="watermarkSettings.text" :style="watermarkStyle">{{ watermarkSettings.text }}</span>
        </div>
      </div>
    </div>

    <!-- Mobile action bar and drawer -->
    <div v-if="isMobile" class="mobile-action-bar">
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
    </div>

    <MobileBottomSheet v-if="isMobile" v-model:show="mobileDrawerShow" :title="mobileDrawerTitle">
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

          <!-- 标题设置 -->
          <template v-else-if="mobileActivePanel === 'title'">
            <n-form-item label="显示标题" size="small">
              <n-switch size="small" :value="titleSettings.show" @update:value="(val) => titleSettings.show = val" />
            </n-form-item>
            <TitleSettings v-if="titleSettings.show" />
          </template>

          <!-- 水印设置 -->
          <template v-else-if="mobileActivePanel === 'watermark'">
            <WatermarkSettings />
          </template>

          <!-- 背景设置 -->
          <template v-else-if="mobileActivePanel === 'background'">
            <BackgroundSettings :background-settings="backgroundSettings" />
          </template>

          <!-- 个人收藏 -->
          <template v-else-if="mobileActivePanel === 'templates'">
            <PersonalTemplates ref="personalTemplatesRef" @load-template="loadTemplate" />
          </template>
      </div>
    </MobileBottomSheet>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, type CSSProperties } from 'vue';
// 尺寸与移动端判定从自定义 hooks 获取
import { useMobile } from '@/hooks/useMobile';
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { useWallpaper } from '@/composables/useWallpaper';
import { createDragHandler } from '../utils/dragUtils';
import { type Template } from '../utils/indexedDB';

import { 
  NModal,
  NButton,
  NTooltip,
  NIcon,
  NUpload,
  NFormItem,
  NSelect,
  NSwitch,
  NInputNumber,
  NSpace
} from 'naive-ui';

// 设备框架组件
import PhoneFrame from './iphone/PhoneFrame.vue';
import TabletFrame from './ipad/TabletFrame.vue';
import MacFrame from './mac/MacFrame.vue';
import CarFrame from './car/CarFrame.vue';
import ComboDevices from './combo/ComboDevices.vue';
import CustomFrame from './custom/CustomFrame.vue';
import SettingsToolbar from './SettingsToolbar.vue';
import WatermarkSettings from './toolbar/WatermarkSettings.vue';
import TitleSettings from './toolbar/TitleSettings.vue';
import BackgroundSettings from './toolbar/BackgroundSettings.vue';
import PersonalTemplates from './PersonalTemplates.vue';
import type { UploadFileInfo } from 'naive-ui';
import { PhUploadSimple as UploadSimple, PhImage as ImageSquare, PhTextT as TextT, PhDrop as Droplets, PhGear as Gear, PhBookmarkSimple as BookmarkSimple, PhArrowCounterClockwise as ArrowCounterClockwise, PhEye as Eye, PhEyeSlash as EyeSlash } from '@phosphor-icons/vue';
import MobileBottomSheet from './common/MobileBottomSheet.vue';


const { 
  imageUrl, 
  watermarkImageUrl,
  watermarkSettings,
  titleSettings,
  previewSettings,
  currentDevice,
  watermarkPositionStyle,
  backgroundSettings,
  customWidth,
  customHeight,
  resetConfig,
  showExportPreview
} = useWallpaper();

const emit = defineEmits<{
  'save-config': [];
  'save-template': [];
  'open-settings': [];
}>();

const previewAreaRef = ref<HTMLElement | null>(null);
const previewAreaSize = ref({ width: 0, height: 0 });

const previewCanvasRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const watermarkRef = ref<HTMLElement | null>(null);
// 下载状态已移至App.vue

// 计算预览缩放比例，确保设备完整显示且不压扁
const previewScale = computed(() => {
  if (!previewAreaSize.value.width || !previewAreaSize.value.height) return 1;
  
  const padding = 60; // 预览区域留白
  const availableWidth = previewAreaSize.value.width - padding;
  const availableHeight = previewAreaSize.value.height - padding;
  
  const deviceWidth = currentDevice.value.width;
  const deviceHeight = currentDevice.value.height;
  
  const scaleX = availableWidth / deviceWidth;
  const scaleY = availableHeight / deviceHeight;
  
  return Math.min(scaleX, scaleY, 1); // 最大缩放比例为 1
});

const updatePreviewSize = () => {
  if (previewAreaRef.value) {
    previewAreaSize.value = {
      width: previewAreaRef.value.clientWidth,
      height: previewAreaRef.value.clientHeight
    };
  }
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updatePreviewSize();
  if (previewAreaRef.value) {
    resizeObserver = new ResizeObserver(updatePreviewSize);
    resizeObserver.observe(previewAreaRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const exportContainerStyle = computed((): CSSProperties => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
  padding: '10px',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: `scale(${previewScale.value})`,
  transformOrigin: 'center center',
  width: `${currentDevice.value.width}px`,
  height: `${currentDevice.value.height}px`,
}));
const titleStyle = computed(() => ({
  fontFamily: titleSettings.value.fontFamily,
  color: titleSettings.value.color,
  fontSize: `${titleSettings.value.fontSize}px`,
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

// 设备下拉选项
const deviceOptions = computed(() => {
  try {
    return previewSettings.value.devices.map((d: any) => ({ label: d.name, value: d.id }));
  } catch {
    return [] as Array<{ label: string; value: string }>; 
  }
});
const showCropperModal = ref(false);
const cropperSource = ref('');
const cropperRef = ref<any>(null);

// 小屏判断与移动端抽屉开关（统一从 hooks 提供）
const { isMobile, mobileDrawerShow } = useMobile();

// 移动端抽屉
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
  // 桌面端不打开移动端弹窗
  if (!isMobile.value) return;
  mobileActivePanel.value = panel;
  mobileDrawerShow.value = true;
};


// 确认自定义尺寸
const confirmCustomSize = () => {
  if (previewSettings.value.selectedDevice === 'custom') {
    // 找到自定义尺寸设备并更新其尺寸
    const customDeviceIndex = previewSettings.value.devices.findIndex((device: any) => device.id === 'custom');
    if (customDeviceIndex !== -1) {
      previewSettings.value.devices[customDeviceIndex].width = customWidth.value;
      previewSettings.value.devices[customDeviceIndex].height = customHeight.value;
    }
  }
};

const handleImageUpload = async (file: UploadFileInfo) => {
  const actualFile = file.file;
  if (actualFile && actualFile.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      await img.decode();
      
      // 计算图片和设备比例是否一致
      const imgAspect = img.width / img.height;
      const deviceAspect = currentDevice.value.width / currentDevice.value.height;
      
      if (Math.abs(imgAspect - deviceAspect) < 0.01) {
        // 比例一致，直接使用图片
        imageUrl.value = img.src;
        window.$message.success('图片已自动适配设备尺寸');
      } else {
        // 比例不一致，显示裁剪界面
        cropperSource.value = img.src;
        showCropperModal.value = true;
      }
    };
    reader.readAsDataURL(actualFile);
  } else {
    window.$message.error('请上传图片文件');
  }
};

const confirmCrop = () => {
  cropperRef.value.getCropData((data: string) => {
    imageUrl.value = data;
    showCropperModal.value = false;
    window.$message.success('背景图片上传成功');
  });
};


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
    // 仅应用字体颜色，避免影响 PC 端背景设置
    if (template.config.backgroundSettings?.fontColor) {
      backgroundSettings.value.fontColor = template.config.backgroundSettings.fontColor;
    }
    window.$message.success(`已加载模板: ${template.name}`);
  } catch (error) {
    console.error('加载模板失败:', error);
    window.$message.error('加载模板失败');
  }
};

// 暴露函数给父组件
defineExpose({
  previewAreaRef,
  loadTemplates: () => personalTemplatesRef.value?.loadTemplates()
});

// 重置配置
const handleResetConfig = async () => {
  await resetConfig();
  window.$message.success('配置已重置为默认值');
};


</script>

<style scoped lang="scss">
.wallpaper-editor {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  height: calc(100vh - 150px); /* 减去头部(64px)和底部(40px)的高度以及一些间距 */
  padding: 10px;
  box-sizing: border-box;
  margin: 0 auto;
  overflow: hidden;
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

.preview-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.export-container {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  border-radius: 8px;
  
  &.preview-mode {
    border-color: #f4d03f;
    animation: border-blink 1.5s infinite;
    box-shadow: 0 0 20px rgba(244, 208, 63, 0.3);
  }
}

@keyframes border-blink {
  0% { border-color: rgba(244, 208, 63, 1); }
  50% { border-color: rgba(244, 208, 63, 0.2); }
  100% { border-color: rgba(244, 208, 63, 1); }
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

/* 响应式布局 */
@media (max-width: 1200px) {
  .wallpaper-editor {
    flex-direction: column;
    gap: 16px;
  }
  
  .preview-area {
    height: calc(100vh - 400px);
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .preview-area {
    height: calc(100vh - 220px);
    min-height: 320px;
  }
}

/* 移动端底部工具栏 */
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

/* 拖拽状态样式 */
.dragging {
  cursor: grabbing !important;
  user-select: none;
  z-index: 1000;
}

.draggable:hover {
  cursor: grab;
  opacity: 0.8;
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
