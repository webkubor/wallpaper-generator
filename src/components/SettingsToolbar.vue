<template>
  <BaseCard
    class="settings-panel"
    :hoverable="false"
    :bordered="true"
    :glass="true"
    :content-style="{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }"
  >
    <template #header>
      <div class="settings-header">
        <div class="header-left">
          <Gear class="settings-icon" :size="18" weight="fill" />
          <span class="settings-title">氛围设计</span>
        </div>
        <div class="header-actions">
          <BaseButton variant="ghost" size="sm" class="reset-btn" @click="$emit('resetConfig')" title="重置所有设置">
            <template #icon>
              <ArrowCounterClockwise :size="16" />
            </template>
          </BaseButton>
        </div>
      </div>
    </template>

    <div class="settings-body">
      <div class="quick-actions">
        <div class="quick-title">快速操作</div>
        <div class="quick-grid">
          <div class="quick-item">
            <div class="quick-label">背景图</div>
            <FileUploader :show-file-list="false" @select="handleImageSelect" class="full-width-uploader">
              <template #default>
                <div class="upload-btn-content">
                  <UploadSimple :size="16" weight="bold" />
                  <span>灵感</span>
                </div>
              </template>
            </FileUploader>
          </div>

          <div class="quick-item">
            <div class="quick-label">载体模型</div>
            <div class="select-wrapper">
              <select v-model="previewSettings.selectedDevice" class="base-select">
                <option v-for="opt in deviceOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
          </div>

          <div class="quick-item">
            <div class="quick-label">展示标题</div>
            <BaseSwitch :model-value="titleSettings.show" @update:model-value="(val) => titleSettings.show = val" />
          </div>

          <div class="quick-item">
            <div class="quick-label">导出预览</div>
            <BaseSwitch v-model="showExportPreview">
              <template #default>{{ showExportPreview ? '开' : '关' }}</template>
            </BaseSwitch>
          </div>
        </div>
        <div class="quick-hint">先选背景与载体，再细化文字与水印，最后导出。</div>
      </div>

      <div class="collapse-group">
        <!-- 1. 标题设置 (Top) -->
        <details class="collapse-item" open style="--delay: 0.1s">
          <summary class="collapse-header">
            <div class="header-content">
              <TextT class="header-icon" :size="18" weight="fill" />
              <span>文字意境</span>
            </div>
          </summary>
          <div class="collapse-content">
            <TitleSettings v-if="titleSettings.show" />
            <div v-else class="empty-state">开启标题后可调整字体、大小与色彩。</div>
          </div>
        </details>

        <!-- 2. 背景设置 (From Basic) -->
        <details class="collapse-item" open style="--delay: 0.2s">
          <summary class="collapse-header">
            <div class="header-content">
              <ImageSquare class="header-icon" :size="18" weight="fill" />
              <span>底色与光影</span>
            </div>
          </summary>
          <div class="collapse-content">
            <BackgroundSettings :background-settings="backgroundSettings" />
          </div>
        </details>

        <!-- 3. 水印设置 (Bottom) -->
        <details class="collapse-item" style="--delay: 0.3s">
          <summary class="collapse-header">
            <div class="header-content">
              <Droplets class="header-icon" :size="18" weight="fill" />
              <span>印记标识</span>
            </div>
          </summary>
          <div class="collapse-content">
            <WatermarkSettings />
          </div>
        </details>

        <!-- 4. 导出设置 (Renamed from Basic - Device/Size) -->
        <details class="collapse-item" style="--delay: 0.4s">
          <summary class="collapse-header">
            <div class="header-content">
              <Gear class="header-icon" :size="18" weight="fill" />
              <span>导出规范</span>
            </div>
          </summary>
          <div class="collapse-content">
            
            <!-- iPhone 刘海开关 -->
            <div v-if="previewSettings.selectedDevice === 'iphone'" class="form-item">
              <label class="form-label">刘海屏障</label>
              <BaseSwitch :model-value="previewSettings.hasNotch" @update:model-value="(val) => previewSettings.hasNotch = val" />
            </div>
            
            <!-- 自定义尺寸输入 -->
            <div v-if="previewSettings.selectedDevice === 'custom'" class="custom-size-inputs">
              <div class="form-item">
                <label class="form-label">宽</label>
                <BaseInput type="number" :model-value="customWidth" @update:model-value="(val) => $emit('update:customWidth', Number(val) || 400)" :min="100" :max="3000" placeholder="宽度" />
              </div>
              <div class="form-item">
                <label class="form-label">高</label>
                <BaseInput type="number" :model-value="customHeight" @update:model-value="(val) => $emit('update:customHeight', Number(val) || 400)" :min="100" :max="3000" placeholder="高度" />
              </div>
              <BaseButton variant="primary" size="sm" @click="confirmCustomSize">定稿</BaseButton>
            </div>
          </div>
        </details>

        <!-- 5. 个人收藏模板 -->
        <details class="collapse-item personal-templates-section" style="--delay: 0.5s">
          <summary class="collapse-header">
            <div class="header-content">
              <BookmarkSimple class="header-icon" :size="18" weight="fill" />
              <span>时光收藏</span>
            </div>
          </summary>
          <div class="collapse-content">
            <PersonalTemplates @load-template="handleLoadTemplate" />
          </div>
        </details>
      </div>
    </div>
    
    <!-- Bottom Action Footer -->
    <template #footer>
      <div class="settings-footer-content">
        <div class="footer-left">
          <BaseButton circle variant="ghost" @click="$emit('openSettings')" title="系统设置">
            <template #icon><Gear :size="20" /></template>
          </BaseButton>
          <BaseButton circle variant="ghost" @click="$emit('saveConfig')" title="保存配置">
            <template #icon><FloppyDisk :size="20" /></template>
          </BaseButton>
        </div>
        
        <BaseButton variant="primary" @click="$emit('saveTemplate')">
          <template #icon>
            <Plus :size="16" weight="bold" />
          </template>
          存为模板
        </BaseButton>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { 
  PhGear as Gear, 
  PhArrowCounterClockwise as ArrowCounterClockwise, 
  PhUploadSimple as UploadSimple, 
  PhImage as ImageSquare, 
  PhDrop as Droplets,
  PhTextT as TextT,
  PhBookmarkSimple as BookmarkSimple,
  PhFloppyDisk as FloppyDisk,
  PhPlus as Plus
} from "@phosphor-icons/vue";
import PersonalTemplates from './PersonalTemplates.vue';
import WatermarkSettings from './toolbar/WatermarkSettings.vue';
import TitleSettings from './toolbar/TitleSettings.vue';
import BackgroundSettings from './toolbar/BackgroundSettings.vue';
import { useWallpaper } from '@/composables/useWallpaper';
import BaseCard from './base/BaseCard.vue';
import BaseButton from './base/BaseButton.vue';
import BaseSwitch from './base/BaseSwitch.vue';
import BaseInput from './base/BaseInput.vue';
import FileUploader from './common/FileUploader.vue';
interface Props {
  backgroundSettings: any;
  customWidth: number;
  customHeight: number;
  refreshTrigger?: number;
}

defineProps<Props>();

const emit = defineEmits<{
  resetConfig: [];
  imageUpload: [file: { file: File }];
  confirmCustomSize: [];
  'update:customWidth': [value: number];
  'update:customHeight': [value: number];
  togglePersonalTemplates: [];
  loadTemplate: [template: any];
  saveConfig: [];
  saveTemplate: [];
  openSettings: [];
}>();


// 直接使用 useWallpaper 获取数据
const { 
  previewSettings,
  deviceOptions,
  titleSettings,
  showExportPreview
} = useWallpaper();

const handleImageSelect = (info: { file: File, url: string }) => {
  // Convert to structure expected by parent if needed, or just emit file
  // Parent expects UploadFileInfo-like object { file: File }
  emit('imageUpload', { file: info.file } as any);
};

const confirmCustomSize = () => {
  emit('confirmCustomSize');
};

const handleLoadTemplate = (template: any) => {
  emit('loadTemplate', template);
};

</script>

<style scoped lang="scss">
.settings-panel {
  width: 380px;
  height: 100%;
  flex-shrink: 0;
  border-radius: 12px;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .settings-icon {
      color: var(--text-secondary);
    }
    
    .settings-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

.settings-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 6px;
}

/* Quick Actions */
.quick-actions {
  padding: 16px 20px 12px;
  background: linear-gradient(180deg, rgba(244, 208, 63, 0.08), rgba(244, 208, 63, 0.02));
  border-bottom: 1px dashed var(--border-color);
}

.quick-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
  margin-bottom: 10px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quick-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.quick-hint {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.8;
}

/* Collapse Styles */
.collapse-group {
  display: flex;
  flex-direction: column;
}

.collapse-item {
  border-bottom: 1px solid var(--border-color);
  opacity: 0;
  animation: slide-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  animation-delay: var(--delay, 0s);
  
  &:last-child {
    border-bottom: none;
  }
  
  .collapse-header {
    padding: 16px 20px;
    cursor: pointer;
    list-style: none;
    user-select: none;
    position: relative;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
    
    &::-webkit-details-marker {
      display: none;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 15px;
      color: var(--text-primary);
      
      .header-icon {
        color: var(--color-brand);
        filter: drop-shadow(0 2px 4px rgba(244, 208, 63, 0.2));
      }
    }
    
    &::after {
      content: '';
      position: absolute;
      right: 20px;
      top: 50%;
      width: 6px;
      height: 6px;
      border-right: 2px solid var(--text-secondary);
      border-bottom: 2px solid var(--text-secondary);
      transform: translateY(-70%) rotate(45deg);
      transition: transform 0.3s ease;
      opacity: 0.6;
    }
  }
  
  &[open] .collapse-header::after {
    transform: translateY(-30%) rotate(225deg);
  }
  
  .collapse-content {
    padding: 0 20px 20px;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Form Item Styles */
.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
  
  .form-label {
    font-size: 14px;
    color: var(--text-secondary);
    white-space: nowrap;
  }
}

.custom-size-inputs {
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: var(--border-radius-sm);
  align-items: flex-end;
  
  .form-item {
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 0;
    gap: 4px;
  }
}

/* Select Styling Reused */
.select-wrapper {
  position: relative;
  min-width: 120px;
  
  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--text-secondary);
    pointer-events: none;
  }
}
.base-select {
  width: 100%;
  appearance: none;
  padding: 6px 24px 6px 12px;
  font-size: 14px;
  color: var(--text-primary);
  background-color: rgba(0, 0, 0, 0.03);
  border: 1px solid transparent;
  border-radius: var(--border-radius-sm);
  outline: none;
  cursor: pointer;
  
  &:focus {
    background-color: #fff;
    border-color: var(--color-brand);
  }
}

.settings-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  .footer-left {
    display: flex;
    gap: 8px;
  }
}

.upload-btn-content {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
  font-weight: 500;
  
  &:hover {
    background-color: rgba(244, 208, 63, 0.05);
    border-color: var(--color-brand);
    color: var(--color-brand-active);
  }
}

:deep(.full-width-uploader) {
  width: 100%;
  flex: 1;
  /* Remove base button styles if we are styling the content directly, 
     BUT FileUploader uses a slot inside a div.
     The click event is on the wrapper div in FileUploader.
     So this inner div styling is purely visual. */
}

.empty-state {
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 1024px) {
  .settings-panel {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .settings-panel {
    width: 100%;
    height: auto;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-header {
    .header-left { display: none; }
  }
  
  .personal-templates-section {
    display: none;
  }
}
</style>