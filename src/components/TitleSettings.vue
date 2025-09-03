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

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:settings']);

const localSettings = ref({ ...props.settings });

const fontOptions = [
  { label: '阿里妈妈方圆体', value: 'AlimamaFangYuanTiVF-Thin' },
  { label: '细雨体', value: 'drizzle' },
  { label: '可爱体', value: 'cute' },
  { label: '吸血鬼战争', value: 'vampire-wars' },
  { label: 'AI中文02', value: 'AiChinese02' },
  { label: '中文3', value: 'Chinese3' },
];

watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings };
}, { deep: true });

const updateSettings = () => {
  emit('update:settings', localSettings.value);
};
</script>
