<template>
  <n-divider title-placement="left">标题设置</n-divider>
  <n-form-item label="标题内容">
    <n-input v-model:value="titleSettings.text" />
  </n-form-item>
  <n-form-item label="字体">
    <n-select v-model:value="titleSettings.fontFamily" :options="fontOptions" />
  </n-form-item>
  <n-form-item label="颜色">
    <n-color-picker :modes="['hex']" v-model:value="titleSettings.color" />
  </n-form-item>
  <n-form-item label="排列方式">
    <n-radio-group v-model:value="titleSettings.direction">
      <n-radio-button value="horizontal">横排</n-radio-button>
      <n-radio-button value="vertical">竖排</n-radio-button>
    </n-radio-group>
  </n-form-item>
</template>

<script setup lang="ts">
import { NFormItem, NInput, NSelect, NColorPicker, NRadioGroup, NRadioButton, NDivider } from 'naive-ui';
import { useWallpaper } from '@/composables/useWallpaper';

// 直接使用 useWallpaper 获取响应式数据
const { titleSettings, fontOptions } = useWallpaper();
</script>
