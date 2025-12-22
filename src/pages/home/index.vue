<template>
  <div class="wallpaper-editor">
    <!-- Left: Settings Panel (Desktop only) -->
    <SettingsToolbar 
      v-if="!isMobile"
      :background-settings="backgroundSettings"
      v-model:custom-width="customWidth"
      v-model:custom-height="customHeight"
      @reset-config="handleResetConfig"
      @image-upload="wallpaperHandleImageUpload"
      @confirm-custom-size="confirmCustomSize"
      @load-template="loadTemplate"
      @open-wallpaper-library="openWallpaperLibrary"
    />

    <!-- Center: Preview Area -->
    <div ref="previewAreaRef" class="preview-area" :style="previewAreaStyle">
      <img 
        v-if="backgroundSettings.type === 'perspective' && imageUrl"
        :src="imageUrl || undefined" 
        class="perspective-bg"
        alt="Perspective Background"
      />
        <div class="preview-canvas" :style="canvasStyle">
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

    <!-- 移动端控制组件 -->
    <MobileEditorControls v-if="isMobile" />
    <MobileBottomSheet 
      v-if="isMobile" 
      :show="mobileDrawerShow"
      @update:show="mobileDrawerShow = $event"
    />

    <!-- 壁纸素材库弹窗 -->
    <WallpaperLibraryModal ref="wallpaperLibraryRef" @select="handleWallpaperSelect" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from 'vue';
import { useMobile } from '@/hooks/useMobile';
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { useWallpaper } from '@/hooks/useWallpaper';
import { analyzeHexColor } from '@/utils/colorUtils';
import { createDragHandler } from '@/utils/dragUtils';


import {
  PhoneFrame,
  TabletFrame,
  MacFrame,
  CarFrame,
  ComboDevices,
  CustomFrame,
  SettingsToolbar,
  MobileBottomSheet,
  MobileEditorControls,
  WallpaperLibraryModal,
  type UploadFileInfo
} from './components/imports.ts'


const { loadTemplate } = useWallpaper()
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
  resetConfig
} = useWallpaper();

const { handleImageUpload: wallpaperHandleImageUpload, setBackgroundImage } = useWallpaper();

const wallpaperLibraryRef = ref<InstanceType<typeof WallpaperLibraryModal>>();

const openWallpaperLibrary = () => {
  wallpaperLibraryRef.value?.open();
};

const handleWallpaperSelect = (bgUrl: string) => {
  setBackgroundImage(bgUrl);
};

const previewAreaRef = ref<HTMLElement | null>(null);

const titleRef = ref<HTMLElement | null>(null);
const watermarkRef = ref<HTMLElement | null>(null);

const titleShadow = ref('');
const titleFilter = ref('');

// 根据标题配置异步计算阴影样式
const updateTitleShadow = async () => {
  const { shadowEffect, color, shadowColor, shadowSize } = titleSettings.value;
  if (shadowEffect === 'none') {
    titleShadow.value = '';
    titleFilter.value = '';
    return;
  }

  if (shadowEffect === 'custom') {
    const size = shadowSize || 2;
    const customColor = shadowColor || 'rgba(0,0,0,0.5)';
    titleShadow.value = `0 ${size}px ${size * 2}px ${customColor}`;
    titleFilter.value = '';
    return;
  }

  const result = await analyzeHexColor(color);
  const shadowColorValue = result.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  titleShadow.value = `2px 2px 4px ${shadowColorValue}, 0 0 8px ${shadowColorValue}`;
  titleFilter.value = 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))';
};

watch(
  () => [
    titleSettings.value.shadowEffect,
    titleSettings.value.color,
    titleSettings.value.shadowColor,
    titleSettings.value.shadowSize
  ],
  () => {
    void updateTitleShadow();
  },
  { immediate: true }
);

const titleStyle = computed(() => {
  const style: any = {
    fontFamily: titleSettings.value.fontFamily,
    color: titleSettings.value.color,
    fontSize: `${titleSettings.value.fontSize}px`,
    fontWeight: 500
  };

  if (titleShadow.value) {
    style.textShadow = titleShadow.value;
  }
  if (titleFilter.value) {
    style.filter = titleFilter.value;
  }

  // 添加描边效果
  style.textStroke = '1px rgba(0,0,0,0.3)';
  style.WebkitTextStroke = '1px rgba(0,0,0,0.3)';
  style.paintOrder = 'stroke fill'; // 确保描边在填充下方
  
  // 添加描边效果（如果启用）
  if (titleSettings.value.strokeEnabled) {
    style.textStroke = `${titleSettings.value.strokeWidth}px ${titleSettings.value.strokeColor}`;
    style.WebkitTextStroke = `${titleSettings.value.strokeWidth}px ${titleSettings.value.strokeColor}`;
    style.paintOrder = 'stroke fill'; // 确保描边在填充下方
  }
  
  return style;
});

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

// 小屏判断与移动端抽屉开关（统一从 hooks 提供）
const { isMobile, mobileDrawerShow } = useMobile();


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
    filter: drop-shadow(rgba(0, 0, 0, 0.5) -10px 5px 10px);
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
.mbs-body.compact {
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
