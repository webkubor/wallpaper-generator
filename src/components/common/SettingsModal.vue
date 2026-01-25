<template>
  <BaseModal 
    :show="show" 
    @update:show="$emit('update:show', $event)" 
    title="系统设置"
    width="400px"
  >
    <div class="settings-form">
      <!-- Theme -->
      <div class="form-item">
        <label class="form-label">主题模式</label>
        <BaseSwitch :model-value="isDark" @update:model-value="handleUpdateDark">
          <template #default>
            <div class="switch-content">
              <component :is="isDark ? Moon : Sun" :size="16" />
              <span>{{ isDark ? '深色模式' : '浅色模式' }}</span>
            </div>
          </template>
        </BaseSwitch>
      </div>
      
      <!-- Download Option -->
      <div class="form-item">
        <label class="form-label">下载选项</label>
        <div class="radio-vertical-group">
          <label class="radio-label">
            <input type="radio" :checked="downloadOption === 'withBackground'" @change="$emit('update:downloadOption', 'withBackground')">
            全尺寸（包含编辑器背景）
          </label>
          <label class="radio-label">
            <input type="radio" :checked="downloadOption === 'withoutBackground'" @change="$emit('update:downloadOption', 'withoutBackground')">
            仅导出区域（设备 + 标题 + 水印）
          </label>
        </div>
      </div>
      
      <!-- Filename Prefix -->
      <div class="form-item">
        <label class="form-label">文件名前缀</label>
        <BaseInput :model-value="fileNamePrefix" @update:model-value="$emit('update:fileNamePrefix', $event)" placeholder="wallpaper" />
      </div>
      
      <!-- Filename Mode -->
      <div class="form-item">
        <label class="form-label">命名模式</label>
        <div class="radio-vertical-group">
          <label class="radio-label">
            <input type="radio" :checked="fileNameMode === 'timestamp'" @change="$emit('update:fileNameMode', 'timestamp')">
            使用时间戳
          </label>
          <label class="radio-label">
            <input type="radio" :checked="fileNameMode === 'imageName'" @change="$emit('update:fileNameMode', 'imageName')">
            使用图片文件名
          </label>
        </div>
      </div>
    </div>
    
    <template #footer>
      <BaseButton variant="secondary" @click="handleCancel">取消</BaseButton>
      <BaseButton variant="primary" :loading="isDownloading" @click="handleDownload">下载</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../base/BaseModal.vue';
import BaseButton from '../base/BaseButton.vue';
import BaseSwitch from '../base/BaseSwitch.vue';
import BaseInput from '../base/BaseInput.vue';
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

const handleUpdateDark = (val: boolean) => {
  emit('update:isDark', val);
};

const handleCancel = () => {
  emit('update:show', false);
};

const handleDownload = () => {
  emit('download');
};
</script>

<style scoped lang="scss">
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.switch-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.radio-vertical-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  
  input[type="radio"] {
    accent-color: var(--color-brand);
    width: 16px;
    height: 16px;
  }
}
</style>