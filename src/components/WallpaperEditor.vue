<template>
  <div class="editor-container">
    <div class="wallpaper-editor">
    <!-- Left: Settings Panel -->
    <n-card title="设置" class="settings-panel" hoverable bordered content-style="padding: 10px; height: 100%; overflow: auto;">
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
              <span>水印与文字</span>
            </div>
          </template>
          <n-space vertical size="small">
            <n-form-item label="水印文字" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-input v-model:value="watermarkSettings.text" placeholder="输入水印文字">
                <template #prefix>
                  <n-icon :component="TextT" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item label="图片水印" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-upload list-type="image-card" :max="1" @change="handleWatermarkUpload">
                <span>点击上传</span>
              </n-upload>
            </n-form-item>
            <n-form-item label="水印字体" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
                <n-select v-model:value="watermarkSettings.fontFamily" :options="fontOptions as any" class="input-with-icon-field" />
            </n-form-item>
            <n-form-item label="颜色" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
                <n-color-picker v-model:value="watermarkSettings.color" />
            </n-form-item>
            <n-form-item label="大小" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-slider v-model:value="watermarkSettings.fontSize" :min="12" :max="200" />
            </n-form-item>
            <n-form-item label="透明度" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-slider v-model:value="watermarkSettings.opacity" :min="0" :max="1" :step="0.1" />
            </n-form-item>
            <n-form-item label="旋转" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-slider v-model:value="watermarkSettings.rotation" :min="-180" :max="180" />
            </n-form-item>
          </n-space>
        </n-collapse-item>

        <n-collapse-item name="3">
          <template #header>
            <div class="collapse-header">
              <n-icon :component="Gear" class="header-icon" />
              <span>设备预览</span>
            </div>
          </template>
          <n-space vertical size="small">
            <n-form-item label="设备" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-radio-group v-model:value="previewSettings.selectedDevice">
                <n-radio-button v-for="device in deviceOptions" :key="device.value" :value="device.value" :label="device.label" />
              </n-radio-group>
            </n-form-item>
            
            
            <!-- 自定义尺寸输入 -->
            <div v-if="previewSettings.selectedDevice === 'custom'" class="custom-size-inputs">
              <n-form-item label="宽度" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
                <n-input-number v-model:value="customWidth" :min="100" :max="3000" placeholder="宽度" />
              </n-form-item>
              <n-form-item label="高度" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
                <n-input-number v-model:value="customHeight" :min="100" :max="3000" placeholder="高度" />
              </n-form-item>
              <n-button type="primary" size="small" @click="confirmCustomSize">确定</n-button>
            </div>
            <n-button type="primary" @click="downloadWallpaper" class="download-button">
                <template #icon>
                  <n-icon :component="Download" />
                </template>
                下载壁纸
              </n-button>
          </n-space>
        </n-collapse-item>
      </n-collapse>
    </n-card>

    <!-- Center: Preview Area -->
    <div class="preview-area">
        <div ref="previewCanvasRef" class="preview-canvas" :style="canvasStyle">
          <!-- 设备框架 -->
          <PhoneFrame v-if="currentDevice?.id === 'iphone' && currentDevice?.hasFrame" />
          <TabletFrame v-if="currentDevice?.id === 'ipad' && currentDevice?.hasFrame" />
          <MacFrame v-if="currentDevice?.id === 'mac' && currentDevice?.hasFrame" />
          
          <!-- 壁纸背景 -->
          <img v-if="imageUrl" :src="imageUrl" alt="background" class="background-image" :style="backgroundImageStyle" />
          
          <!-- 水印 -->
          <div class="watermark" :style="watermarkPositionStyle">
            <img v-if="watermarkImageUrl" :src="watermarkImageUrl" class="watermark-image" />
            <span v-if="watermarkSettings.text">{{ watermarkSettings.text }}</span>
          </div>

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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import html2canvas from 'html2canvas';
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { useWallpaper, getWatermarkPositionStyle } from '../composables/useWallpaper';
import { 
  NCard, NSpace, NUpload, NButton, NInput, NFormItem, NSelect, 
  NColorPicker, NSlider, NRadioGroup, NRadioButton, 
  NCollapse, NCollapseItem, NModal, NIcon, NInputNumber
} from 'naive-ui';
import { PhImageSquare as ImageSquare, PhUploadSimple as UploadSimple, PhTextT as TextT, PhDownload as Download, PhGear as Gear } from "@phosphor-icons/vue";

// 设备框架组件
import PhoneFrame from './iphone/PhoneFrame.vue';
import TabletFrame from './ipad/TabletFrame.vue';
import MacFrame from './mac/MacFrame.vue';
import type { UploadFileInfo } from 'naive-ui';

const { 
  imageUrl, 
  watermarkImageUrl,
  watermarkSettings,
  previewSettings,
  deviceOptions,
  fontOptions,
  currentDevice
} = useWallpaper();

const previewCanvasRef = ref<HTMLElement | null>(null);
const isDownloading = ref(false);
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
  if (options.file.file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      cropperSource.value = e.target?.result as string;
      showCropperModal.value = true;
    };
    reader.readAsDataURL(options.file.file);
  }
};

const confirmCrop = () => {
  cropperRef.value.getCropData((data: string) => {
    imageUrl.value = data;
    showCropperModal.value = false;
  });
};

const handleWatermarkUpload = (options: { file: UploadFileInfo }) => {
  if (options.file.file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      watermarkImageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(options.file.file);
  }
};

const downloadWallpaper = () => {
  if (previewCanvasRef.value) {
    isDownloading.value = true;
    html2canvas(previewCanvasRef.value).then(canvas => {
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

// 水印位置样式 - 根据设备类型调整位置
const watermarkPositionStyle = computed(() => {
  // 获取基本样式
  const baseStyle = watermarkStyle.value;
  
  // 获取位置样式
  const positionStyle = getWatermarkPositionStyle(watermarkSettings.value, previewSettings.value.selectedDevice);
  
  // 合并样式
  return { ...baseStyle, ...positionStyle };
});

const canvasStyle = computed(() => ({
  width: `${currentDevice.value.width}px`,
  height: `${currentDevice.value.height}px`,
}));

// 背景图片样式固定为 cover
const backgroundImageStyle = computed(() => ({
  objectFit: 'cover' as 'cover',
}));

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
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  overflow: hidden;
  background-color: var(--n-body-color);
  height: 100%;
  position: relative;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.preview-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.05) 100%);
  border-radius: 12px;
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
  overflow: hidden;
  display: flex;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border-radius: 12px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  max-width: 100%;
  max-height: 100%;
  z-index: 1;
  transform-origin: center center;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }
  50% {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  }
  100% {
    transform: translateY(0px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5; /* 背景色，在留白区域显示 */
}

.watermark {
  position: absolute;
  display: flex;
  flex-direction: column;
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
</style>
