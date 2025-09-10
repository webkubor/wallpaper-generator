<template>
  <n-form-item label="背景类型" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
    <n-radio-group v-model:value="backgroundSettings.type">
      <n-radio-button value="perspective">透视</n-radio-button>
      <n-radio-button value="color">纯色</n-radio-button>
    </n-radio-group>
  </n-form-item>
  <n-form-item v-if="backgroundSettings.type === 'color'" label="背景颜色" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
    <n-color-picker :modes="['hex']" v-model:value="backgroundSettings.color" />
  </n-form-item>
  <n-form-item label="字体颜色" label-placement="left" label-style="padding-bottom: 0;" style="margin-bottom: 12px;">
    <n-color-picker :modes="['hex']" v-model:value="backgroundSettings.fontColor" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NFormItem, NRadioGroup, NRadioButton, NColorPicker } from 'naive-ui';

interface Props {
  backgroundSettings: any;
}

defineProps<Props>();

</script>
