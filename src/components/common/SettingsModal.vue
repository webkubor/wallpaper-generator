<template>
  <n-modal v-model:show="visible" preset="card" style="width: 400px;z-index: 9999;" title="系统设置">
    <n-space vertical>
      <n-form-item label="主题模式">
        <n-switch v-model:value="isDark">
          <template #checked-icon>
            <n-icon :component="Moon" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="Sun" />
          </template>
          <template #checked>
            深色模式
          </template>
          <template #unchecked>
            浅色模式
          </template>
        </n-switch>
      </n-form-item>
      
      <n-form-item label="下载选项">
        <n-radio-group v-model:value="downloadOption">
          <n-space vertical>
            <n-radio value="withBackground">包含背景（下载整个预览区）</n-radio>
            <n-radio value="withoutBackground">不包含背景（仅下载壁纸区域）</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      
      <n-form-item label="文件名前缀">
        <n-input v-model:value="fileNamePrefix" placeholder="wallpaper" />
      </n-form-item>
      
      <n-form-item label="命名模式">
        <n-radio-group v-model:value="fileNameMode">
          <n-space vertical>
            <n-radio value="timestamp">使用时间戳</n-radio>
            <n-radio value="imageName">使用图片文件名</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      
      <n-space justify="end">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" color="#f4d03f" :loading="isDownloading" @click="handleDownload">下载</n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NModal, NSpace, NFormItem, NSwitch, NIcon, NRadioGroup, NRadio, NButton, NInput } from 'naive-ui';
import { PhSun as Sun, PhMoon as Moon } from "@phosphor-icons/vue";

interface Props {
  show: boolean;
  isDark: boolean;
  downloadOption: string;
  isDownloading: boolean;
  fileNamePrefix: string;
  fileNameMode: string;
}

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'update:isDark', value: boolean): void;
  (e: 'update:downloadOption', value: string): void;
  (e: 'update:fileNamePrefix', value: string): void;
  (e: 'update:fileNameMode', value: string): void;
  (e: 'download'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const visible = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
});

const isDark = computed({
  get: () => props.isDark,
  set: (value) => emit('update:isDark', value)
});

const downloadOption = computed({
  get: () => props.downloadOption,
  set: (value) => emit('update:downloadOption', value)
});

const fileNamePrefix = computed({
  get: () => props.fileNamePrefix,
  set: (value) => emit('update:fileNamePrefix', value)
});

const fileNameMode = computed({
  get: () => props.fileNameMode,
  set: (value) => emit('update:fileNameMode', value)
});

const handleCancel = () => {
  emit('update:show', false);
};

const handleDownload = () => {
  emit('download');
};
</script>
