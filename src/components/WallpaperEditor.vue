<template>
    <div class="wallpaper-editor">
    <!-- Left: Settings Panel -->
    <SettingsToolbar 
      :background-settings="backgroundSettings"
      v-model:custom-width="customWidth"
      v-model:custom-height="customHeight"
      @reset-config="handleResetConfig"
      @image-upload="handleImageUpload"
      @confirm-custom-size="confirmCustomSize"
    />

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
        <div v-if="titleSettings.show" :style="titleContainerStyle">
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
</template>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue';
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { useWallpaper } from '@/composables/useWallpaper';
import { createDragHandler } from '../utils';
import { type Template } from '../utils/indexedDB';

import { 
  useMessage,
  NModal
} from 'naive-ui';

// 设备框架组件
import PhoneFrame from './iphone/PhoneFrame.vue';
import TabletFrame from './ipad/TabletFrame.vue';
import MacFrame from './mac/MacFrame.vue';
import CarFrame from './car/CarFrame.vue';
import ComboDevices from './combo/ComboDevices.vue';
import CustomFrame from './custom/CustomFrame.vue';
import PersonalTemplates from './PersonalTemplates.vue';
import SettingsToolbar from './SettingsToolbar.vue';
import type { UploadFileInfo } from 'naive-ui';

const message = useMessage();

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

const handleImageUpload = (file: UploadFileInfo) => {
  const actualFile = file.file;
  if (actualFile && actualFile.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      cropperSource.value = e.target?.result as string;
      showCropperModal.value = true;
    };
    reader.readAsDataURL(actualFile);
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

// 重置配置
const handleResetConfig = async () => {
  await resetConfig();
  message.success('配置已重置为默认值');
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




</style>
