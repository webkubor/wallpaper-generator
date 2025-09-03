<template>
  <n-divider title-placement="left">水印设置</n-divider>

  <n-form-item label="水印类型">
    <n-radio-group v-model:value="localSettings.type" @update:value="updateSettings">
      <n-radio-button value="text">文字</n-radio-button>
      <n-radio-button value="image">图片</n-radio-button>
    </n-radio-group>
  </n-form-item>

  <template v-if="localSettings.type === 'text'">
    <n-form-item label="水印文字">
      <n-input v-model:value="localSettings.text" @update:value="updateSettings" />
    </n-form-item>
    <n-form-item label="字体">
      <n-select v-model:value="localSettings.fontFamily" :options="fontOptions" @update:value="updateSettings" />
    </n-form-item>
    <n-form-item label="颜色">
      <n-color-picker :modes="['hex']" v-model:value="localSettings.color" @update:value="updateSettings" />
    </n-form-item>
    <n-form-item label="大小">
      <n-slider v-model:value="localSettings.fontSize" :min="12" :max="200" @update:value="updateSettings" />
    </n-form-item>
  </template>

  <template v-if="localSettings.type === 'image'">
    <n-form-item label="上传图片">
      <n-upload action="/api/upload" @finish="handleImageUpload">
        <n-button>选择文件</n-button>
      </n-upload>
    </n-form-item>
  </template>
  <n-form-item label="透明度">
    <n-slider v-model:value="localSettings.opacity" :min="0" :max="1" :step="0.1" @update:value="updateSettings" />
  </n-form-item>
  <n-form-item label="旋转">
    <n-slider v-model:value="localSettings.rotation" :min="-180" :max="180" @update:value="updateSettings" />
  </n-form-item>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { NFormItem, NSelect, NColorPicker, NSlider, NDivider, NRadioGroup, NRadioButton, NInput, NUpload, NButton, type UploadFileInfo } from 'naive-ui';
import { fontOptions as wallpaperFontOptions } from '@/composables/useWallpaper';

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:settings']);

const localSettings = ref({ ...props.settings });

// 将导入的字体选项转换为符合naive-ui的SelectOption格式
const fontOptions = wallpaperFontOptions.map(font => ({
  label: font.label,
  value: font.value
}));

watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings };
}, { deep: true });

const updateSettings = () => {
  emit('update:settings', localSettings.value);
};

const handleImageUpload = ({ event }: { file: UploadFileInfo, event?: ProgressEvent }) => {
  if (event && event.target) {
    const xhr = event.target as XMLHttpRequest;
    const response = JSON.parse(xhr.response);
    localSettings.value.imageUrl = response.url; // 假设后端返回 { url: '...' }
    updateSettings();
  }
};
</script>
