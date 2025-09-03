<template>
  <n-divider title-placement="left">标题设置</n-divider>
  <n-form-item label="标题内容">
    <n-input v-model:value="localSettings.text" @update:value="updateSettings" />
  </n-form-item>
  <n-form-item label="字体">
    <n-select v-model:value="localSettings.fontFamily" :options="fontOptions" @update:value="updateSettings" />
  </n-form-item>
  <n-form-item label="颜色">
    <n-color-picker :modes="['hex']" v-model:value="localSettings.color" @update:value="updateSettings" />
  </n-form-item>
  <n-form-item label="排列方式">
    <n-radio-group v-model:value="localSettings.direction" @update:value="updateSettings">
      <n-radio-button value="horizontal">横排</n-radio-button>
      <n-radio-button value="vertical">竖排</n-radio-button>
    </n-radio-group>
  </n-form-item>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { NFormItem, NInput, NSelect, NColorPicker, NRadioGroup, NRadioButton, NDivider } from 'naive-ui';
import { fontOptions as wallpaperFontOptions } from '../composables/useWallpaper';

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
</script>
