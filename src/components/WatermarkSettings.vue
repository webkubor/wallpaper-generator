<template>
  <n-divider title-placement="left">水印设置</n-divider>
  <n-form-item label="字体">
    <n-select v-model:value="localSettings.fontFamily" :options="fontOptions" @update:value="updateSettings" />
  </n-form-item>
  <n-form-item label="颜色">
    <n-color-picker :modes="['hex']" v-model:value="localSettings.color" @update:value="updateSettings" />
  </n-form-item>
  <n-form-item label="大小">
    <n-slider v-model:value="localSettings.fontSize" :min="12" :max="200" @update:value="updateSettings" />
  </n-form-item>
  <n-form-item label="透明度">
    <n-slider v-model:value="localSettings.opacity" :min="0" :max="1" :step="0.1" @update:value="updateSettings" />
  </n-form-item>
  <n-form-item label="旋转">
    <n-slider v-model:value="localSettings.rotation" :min="-180" :max="180" @update:value="updateSettings" />
  </n-form-item>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { NFormItem, NSelect, NColorPicker, NSlider, NDivider } from 'naive-ui';

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:settings']);

const localSettings = ref({ ...props.settings });

const fontOptions = [
  { label: '默认字体', value: 'system-ui, sans-serif' },
  { label: '衬线字体', value: 'serif' },
  { label: '无衬线字体', value: 'sans-serif' },
  { label: '等宽字体', value: 'monospace' },
];

watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings };
}, { deep: true });

const updateSettings = () => {
  emit('update:settings', localSettings.value);
};
</script>
