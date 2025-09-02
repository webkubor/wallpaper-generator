<template>
  <div class="editor-container">
    <div class="wallpaper-editor">
    <!-- Left: Settings Panel -->
    <n-card title="设置" class="settings-panel" hoverable bordered content-style="padding: 10px; height: 100%; overflow: auto;">
      <n-collapse default-expanded-names="1,3" style="height: 100%; overflow: auto;">
        <n-collapse-item title="基础设置" name="1">
          <n-space vertical size="small">
            <n-form-item label="上传背景" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-upload :custom-request="() => {}" :show-file-list="false" @change="handleImageUpload">
                <n-button>选择图片</n-button>
              </n-upload>
            </n-form-item>
          </n-space>
        </n-collapse-item>

        <n-collapse-item title="水印与文字" name="2">
          <n-space vertical size="small">
            <n-form-item label="水印文字" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-input v-model:value="watermarkSettings.text" placeholder="输入水印文字" />
            </n-form-item>
            <n-form-item label="图片水印" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-upload list-type="image-card" :max="1" @change="handleWatermarkUpload">
                点击上传
              </n-upload>
            </n-form-item>
            <n-form-item label="字体" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-select v-model:value="watermarkSettings.fontFamily" :options="fontOptions as any" />
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

        <n-collapse-item title="布局与导出" name="3">
          <n-space vertical size="small">
            <n-form-item label="设备" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-radio-group v-model:value="previewSettings.selectedDevice">
                <n-radio-button v-for="device in deviceOptions" :key="device.value" :value="device.value" :label="device.label" />
              </n-radio-group>
            </n-form-item>
            
            <n-form-item label="缩放模式" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
              <n-radio-group v-model:value="previewSettings.scalingMode">
                <n-radio-button v-for="mode in scalingModeOptions" :key="mode.value" :value="mode.value" :label="mode.label" />
              </n-radio-group>
            </n-form-item>
            
            <!-- 自定义尺寸输入 -->
            <div v-if="previewSettings.selectedDevice === 'custom'" class="custom-size-inputs">
              <n-form-item label="宽度" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
                <n-input-number v-model:value="customWidth" :min="100" :max="3000" placeholder="宽度" @update:value="updateCustomSize" />
              </n-form-item>
              <n-form-item label="高度" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 8px;">
                <n-input-number v-model:value="customHeight" :min="100" :max="3000" placeholder="高度" @update:value="updateCustomSize" />
              </n-form-item>
            </div>
            <n-button type="primary" @click="downloadWallpaper" :loading="isDownloading">下载壁纸</n-button>
          </n-space>
        </n-collapse-item>
      </n-collapse>
    </n-card>

    <!-- Center: Preview Area -->
    <div class="preview-area">
        <div ref="previewCanvasRef" class="preview-canvas" :style="canvasStyle">
          <img v-if="imageUrl" :src="imageUrl" alt="background" class="background-image" :style="backgroundImageStyle" />
          <div class="watermark" :style="watermarkStyle">
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
import { useWallpaper } from '../composables/useWallpaper';
import { 
  NCard, NSpace, NUpload, NButton, NInput, NFormItem, NSelect, 
  NColorPicker, NSlider, NRadioGroup, NRadioButton, 
  NCollapse, NCollapseItem, NModal
} from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui';

const { 
  imageUrl, 
  watermarkImageUrl,
  watermarkSettings,
  previewSettings,
  deviceOptions,
  fontOptions,
  scalingModeOptions,
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

// 更新自定义尺寸
const updateCustomSize = () => {
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

const watermarkStyle = computed(() => ({
  fontFamily: watermarkSettings.value.fontFamily,
  fontSize: `${watermarkSettings.value.fontSize}px`,
  color: watermarkSettings.value.color,
  opacity: Math.min(watermarkSettings.value.opacity + 0.2, 1), // 增加基础透明度
  transform: `rotate(${watermarkSettings.value.rotation}deg) translateX(-50%)`,
  fontWeight: 800,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.6), 0 0 8px rgba(255, 255, 255, 0.5)', // 增强文字阴影效果
  letterSpacing: '1px', // 增加字间距
  textStroke: '1px rgba(0, 0, 0, 0.3)', // 添加文字描边
  WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)', // 兼容 Webkit 浏览器
}));

const canvasStyle = computed(() => ({
  width: `${currentDevice.value.width}px`,
  height: `${currentDevice.value.height}px`,
}));

// 根据用户选择的缩放模式动态调整背景图片样式
const backgroundImageStyle = computed(() => ({
  objectFit: previewSettings.value.scalingMode as 'contain' | 'cover',
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
  width: 280px;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.preview-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  overflow: hidden;
  background-color: var(--n-body-color);
  height: 100%;
}

.cropper-container {
  width: 100%;
  height: 100%;
}

.preview-canvas {
  position: relative;
  overflow: hidden;
  display: flex;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  max-width: 100%;
  max-height: 100%;
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
  bottom: 60px;
  left: 50%;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  word-break: break-word;
  line-height: 1.2;
  text-align: center;
  gap: 10px;
}

.watermark-image {
  height: 30px;
}

.custom-size-inputs {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.02);

  .n-form-item {
    flex: 1;
    margin-bottom: 0;
  }
}
</style>
