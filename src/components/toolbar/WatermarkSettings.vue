<template>
  <n-divider title-placement="left">水印设置</n-divider>

  <n-form-item label="水印类型">
    <n-radio-group v-model:value="watermarkSettings.type">
      <n-radio-button value="text">文字</n-radio-button>
      <n-radio-button value="image">图片</n-radio-button>
    </n-radio-group>
  </n-form-item>

  <template v-if="watermarkSettings.type === 'text'">
    <n-form-item label="水印文字">
      <n-input v-model:value="watermarkSettings.text" />
    </n-form-item>
    <n-form-item label="字体">
      <n-select v-model:value="watermarkSettings.fontFamily" :options="fontOptions" />
    </n-form-item>
    <n-form-item label="颜色">
      <n-color-picker :modes="['hex']" v-model:value="watermarkSettings.color" />
    </n-form-item>
    <n-form-item label="大小">
      <n-slider v-model:value="watermarkSettings.fontSize" :min="12" :max="200" />
    </n-form-item>
  </template>

  <template v-if="watermarkSettings.type === 'image'">
    <n-form-item label="上传图片">
      <n-upload action="/api/upload" @finish="handleImageUpload">
        <n-button>选择文件</n-button>
      </n-upload>
    </n-form-item>
  </template>
  <n-form-item label="透明度">
    <n-slider v-model:value="watermarkSettings.opacity" :min="0" :max="1" :step="0.1" />
  </n-form-item>
  <n-form-item label="旋转">
    <n-slider v-model:value="watermarkSettings.rotation" :min="-180" :max="180" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NFormItem, NInput, NSelect, NColorPicker, NRadioGroup, NRadioButton, NDivider, NSlider, NUpload, NButton } from 'naive-ui';
import { useWallpaper } from '@/composables/useWallpaper';
import type { UploadFileInfo } from 'naive-ui';

// 直接使用 useWallpaper 获取响应式数据
const { watermarkSettings, fontOptions } = useWallpaper();

const handleImageUpload = ({ event }: { file: UploadFileInfo, event?: ProgressEvent }) => {
  if (event && event.target) {
    const xhr = event.target as XMLHttpRequest;
    const response = JSON.parse(xhr.response);
    watermarkSettings.value.imageUrl = response.url; // 假设后端返回 { url: '...' }
  }
};
</script>
