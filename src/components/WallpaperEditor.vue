<template>
  <div class="wallpaper-editor">
    <!-- Left: Settings Panel -->
    <n-card title="设置" class="settings-panel">
      <n-space vertical>
        <n-upload
          action=""
          :show-file-list="false"
          @change="handleImageUpload"
        >
          <n-button>上传图片</n-button>
        </n-upload>

        <n-input 
          v-model:value="watermarkSettings.text" 
          placeholder="输入水印文字"
        />

        <n-form-item label="字体">
          <n-select v-model:value="watermarkSettings.fontFamily" :options="fontOptions as any" />
        </n-form-item>

        <n-form-item label="颜色">
          <n-color-picker v-model:value="watermarkSettings.color" />
        </n-form-item>

        <n-form-item label="大小">
          <n-slider v-model:value="watermarkSettings.fontSize" :min="12" :max="200" />
        </n-form-item>

        <n-form-item label="透明度">
          <n-slider v-model:value="watermarkSettings.opacity" :min="0" :max="1" :step="0.1" />
        </n-form-item>

        <n-form-item label="旋转">
          <n-slider v-model:value="watermarkSettings.rotation" :min="-180" :max="180" />
        </n-form-item>

        <n-form-item label="边距">
          <n-input-number v-model:value="watermarkSettings.padding" />
        </n-form-item>

        <n-form-item label="设备">
          <n-radio-group v-model:value="previewSettings.selectedDevice">
            <n-radio-button
              v-for="device in deviceOptions"
              :key="device.value"
              :value="device.value"
              :label="device.label"
            />
          </n-radio-group>
        </n-form-item>

        <n-form-item label="位置">
          <n-radio-group v-model:value="watermarkSettings.position">
            <n-radio-button
              v-for="pos in positionOptions"
              :key="pos.value"
              :value="pos.value"
              :label="pos.label"
            />
          </n-radio-group>
        </n-form-item>

        <n-button type="primary" @click="downloadWallpaper">下载壁纸</n-button>
      </n-space>
    </n-card>

    <!-- Center: Preview Area -->
    <div class="preview-area">
      <div ref="previewCanvasRef" class="preview-canvas" :style="canvasStyle">
        <img v-if="imageUrl" :src="imageUrl" alt="background" class="background-image" />
        <div v-if="watermarkSettings.text" class="watermark" :style="watermarkStyle">
          {{ watermarkSettings.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import html2canvas from 'html2canvas';
import { useWallpaper } from '../composables/useWallpaper';
import { 
  NCard, NSpace, NUpload, NButton, NInput, NFormItem, NSelect, 
  NColorPicker, NSlider, NInputNumber, NRadioGroup, NRadioButton 
} from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui';

const { 
  imageUrl, 
  watermarkSettings,
  previewSettings,
  deviceOptions,
  fontOptions,
  positionOptions,
  currentDevice
} = useWallpaper();

const previewCanvasRef = ref<HTMLElement | null>(null);

const handleImageUpload = (options: { file: UploadFileInfo }) => {
  if (options.file.file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(options.file.file);
  }
};

const downloadWallpaper = () => {
  if (previewCanvasRef.value) {
    html2canvas(previewCanvasRef.value).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'wallpaper.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
};

const watermarkStyle = computed(() => ({
  fontFamily: watermarkSettings.value.fontFamily,
  fontSize: `${watermarkSettings.value.fontSize}px`,
  color: watermarkSettings.value.color,
  opacity: watermarkSettings.value.opacity,
  transform: `rotate(${watermarkSettings.value.rotation}deg)`,
}));

const canvasStyle = computed(() => {
  const position = watermarkSettings.value.position;
  const justifyContent: { [key: string]: string } = {
    'top-left': 'flex-start', 'top-center': 'center', 'top-right': 'flex-end',
    'center-left': 'flex-start', 'center-center': 'center', 'center-right': 'flex-end',
    'bottom-left': 'flex-start', 'bottom-center': 'center', 'bottom-right': 'flex-end',
  };
  const alignItems: { [key: string]: string } = {
    'top-left': 'flex-start', 'top-center': 'flex-start', 'top-right': 'flex-start',
    'center-left': 'center', 'center-center': 'center', 'center-right': 'center',
    'bottom-left': 'flex-end', 'bottom-center': 'flex-end', 'bottom-right': 'flex-end',
  };
  return {
    width: `${currentDevice.value.width}px`,
    height: `${currentDevice.value.height}px`,
    justifyContent: justifyContent[position],
    alignItems: alignItems[position],
    padding: `${watermarkSettings.value.padding}px`
  }
});

</script>

<style scoped lang="scss">
.wallpaper-editor {
  display: flex;
  gap: 24px;
  width: 100%;
  height: 100%;
}

.settings-panel {
  width: 350px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f7f7f7;
  /* Dark mode styles */
  @media (prefers-color-scheme: dark) {
    background-color: #2c2c2c;
  }
}

.preview-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background-color: #f0f0f0;
  overflow: auto;
  /* Dark mode styles */
  @media (prefers-color-scheme: dark) {
    background-color: #252525;
  }
}

.preview-canvas {
  position: relative;
  overflow: hidden;
  display: flex;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  flex-shrink: 0; /* Prevent canvas from shrinking */
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.watermark {
  position: relative; /* Change from absolute to relative to be placed by flexbox */
  z-index: 1;
  word-break: break-word;
  line-height: 1.2;
  text-align: center;
}
</style>
