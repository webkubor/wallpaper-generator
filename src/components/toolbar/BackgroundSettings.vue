<template>
  <n-divider title-placement="left">背景</n-divider>
  <n-form-item label="背景类型">
    <n-radio-group v-model:value="backgroundSettings.type">
      <n-radio-button value="perspective">透视</n-radio-button>
      <n-radio-button value="color">纯色</n-radio-button>
    </n-radio-group>
  </n-form-item>
  <n-form-item v-if="backgroundSettings.type === 'color'" label="背景颜色">
    <n-color-picker :modes="['hex']" v-model:value="backgroundSettings.color" />
  </n-form-item>
  <n-divider title-placement="left">壁纸字体</n-divider>
  <n-form-item label="字体颜色">
    <n-color-picker :modes="['hex']" v-model:value="backgroundSettings.fontColor" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NFormItem, NRadioGroup, NRadioButton, NColorPicker, NDivider } from 'naive-ui';

interface Props {
  backgroundSettings: any;
}

defineProps<Props>();

</script>
