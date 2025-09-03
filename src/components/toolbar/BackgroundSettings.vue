<template>
  <n-divider title-placement="left">预览背景</n-divider>
  <n-form-item label="背景类型">
    <n-radio-group v-model:value="localSettings.type" @update:value="updateSettings">
      <n-radio-button value="perspective">透视</n-radio-button>
      <n-radio-button value="color">纯色</n-radio-button>
    </n-radio-group>
  </n-form-item>
  <n-form-item v-if="localSettings.type === 'color'" label="背景颜色">
    <n-color-picker :modes="['hex']" v-model:value="localSettings.color" @update:value="updateSettings" />
  </n-form-item>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { NFormItem, NRadioGroup, NRadioButton, NColorPicker, NDivider } from 'naive-ui';

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:settings']);

const localSettings = ref({ ...props.settings });

watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings };
}, { deep: true });

const updateSettings = () => {
  emit('update:settings', localSettings.value);
};
</script>
