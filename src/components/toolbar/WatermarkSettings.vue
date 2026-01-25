<template>
  <n-form-item label="水印类型" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
    <n-radio-group v-model:value="watermarkSettings.type">
      <n-radio-button value="text">文字</n-radio-button>
      <n-radio-button value="image">图片</n-radio-button>
    </n-radio-group>
  </n-form-item>

  <template v-if="watermarkSettings.type === 'text'">
    <n-form-item label="水印文字" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
      <n-input v-model:value="watermarkSettings.text" />
    </n-form-item>
    <n-form-item label="字体" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
      <n-select v-model:value="watermarkSettings.fontFamily" :options="fontOptions" />
    </n-form-item>
    <n-form-item label="颜色" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
      <n-color-picker :modes="['hex']" v-model:value="watermarkSettings.color" />
    </n-form-item>
    <n-form-item label="大小" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
      <n-slider v-model:value="watermarkSettings.fontSize" :min="12" :max="200" />
    </n-form-item>
  </template>

  <template v-if="watermarkSettings.type === 'image'">
    <n-form-item label="上传图片" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
      <n-upload :custom-request="customUpload" :show-file-list="false" accept="image/*">
        <n-button>选择文件</n-button>
      </n-upload>
    </n-form-item>
  </template>
  <n-form-item label="透明度" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
    <n-slider v-model:value="watermarkSettings.opacity" :min="0" :max="1" :step="0.1" />
  </n-form-item>
  <n-form-item label="旋转" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
    <n-slider v-model:value="watermarkSettings.rotation" :min="-180" :max="180" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NFormItem, NInput, NSelect, NColorPicker, NRadioGroup, NRadioButton, NSlider, NUpload, NButton } from 'naive-ui';
import { useWallpaper } from '@/composables/useWallpaper';
import type { UploadCustomRequestOptions } from 'naive-ui';

// 直接使用 useWallpaper 获取响应式数据
const { watermarkSettings, fontOptions } = useWallpaper();

const customUpload = async ({ file, onFinish }: UploadCustomRequestOptions) => {
  if (file.file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      watermarkSettings.value.imageUrl = e.target?.result as string;
      onFinish();
    };
    reader.readAsDataURL(file.file);
  }
};
</script>
