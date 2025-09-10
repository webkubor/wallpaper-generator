<template>
  <n-form-item label="标题内容">
    <n-input v-model:value="titleSettings.text" />
  </n-form-item>
  <n-form-item label="字体">
    <n-select v-model:value="titleSettings.fontFamily" :options="fontOptions" />
  </n-form-item>
  <n-form-item label="颜色">
    <n-color-picker :modes="['hex']" v-model:value="titleSettings.color" />
  </n-form-item>
  <n-form-item label="字体大小">
    <n-slider v-model:value="titleSettings.fontSize" :min="12"  :step="1" />
    <n-input-number v-model:value="titleSettings.fontSize" :min="12"  style="margin-left: 12px; width: 120px" />
  </n-form-item>
  <n-form-item label="排列方式">
    <n-radio-group v-model:value="titleSettings.direction">
      <n-radio-button value="horizontal">横排</n-radio-button>
      <n-radio-button value="vertical">竖排</n-radio-button>
    </n-radio-group>
  </n-form-item>
  <n-form-item label="文字描边">
    <n-switch v-model:value="titleSettings.strokeEnabled" />
  </n-form-item>
  <n-form-item v-if="titleSettings.strokeEnabled" label="描边颜色">
    <n-color-picker v-model:value="titleSettings.strokeColor" />
  </n-form-item>
  <n-form-item v-if="titleSettings.strokeEnabled" label="描边宽度">
    <n-slider v-model:value="titleSettings.strokeWidth" :min="1" :max="5" :step="1" />
  </n-form-item>
  <n-form-item label="阴影效果">
    <n-select v-model:value="titleSettings.shadowEffect" :options="shadowOptions" />
  </n-form-item>
  <n-form-item v-if="titleSettings.shadowEffect === 'custom'" label="阴影颜色">
    <n-color-picker :modes="['hex']" v-model:value="titleSettings.shadowColor" />
  </n-form-item>
  <n-form-item v-if="titleSettings.shadowEffect === 'custom'" label="阴影大小">
    <n-slider v-model:value="titleSettings.shadowSize" :min="0" :max="10" :step="1" />
    <n-input-number v-model:value="titleSettings.shadowSize" :min="0" :max="10" style="margin-left: 12px; width: 120px" />
  </n-form-item>
</template>

<script setup lang="ts">
import { useWallpaper } from '@/composables/useWallpaper';

// 直接使用 useWallpaper 获取响应式数据
const { titleSettings, fontOptions } = useWallpaper();

const shadowOptions = [
  { label: '无阴影', value: 'none' },
  { label: '默认阴影', value: 'default' },
  { label: '自定义阴影', value: 'custom' }
];
</script>
