<template>
  <teleport to="body">
    <transition name="mbs-fade">
      <div v-if="show" class="mbs-overlay" @click="onMaskClick"></div>
    </transition>
    <transition name="mbs-slide-up">
      <div v-if="show" class="mbs-sheet" role="dialog" aria-modal="true">
        <div class="mbs-handle" aria-hidden="true"></div>
        <div class="mbs-header">
          <div class="mbs-title">{{ title }}</div>
          <button class="mbs-close" type="button" aria-label="关闭" @click="close">✕</button>
        </div>
        <div class="mbs-body compact">
          <!-- 上传 -->
          <template v-if="activePanel === 'upload'">
            <n-upload :custom-request="() => {}" :show-file-list="false" @change="(info: any) => emit('image-upload', info.file)">
              <n-button size="small" block>
                <template #icon>
                  <n-icon :component="UploadSimple" />
                </template>
                选择图片
              </n-button>
            </n-upload>
          </template>

          <!-- 预览/设备 -->
          <template v-else-if="activePanel === 'preview'">
            <n-form-item label="设备" size="small">
              <n-select size="small" v-model:value="previewSettings.selectedDevice" 
                :options="deviceOptions" />
            </n-form-item>
            <n-form-item v-if="previewSettings.selectedDevice === 'iphone'" label="刘海 (iOS)" size="small">
              <n-switch size="small" v-model:value="previewSettings.hasNotch" />
            </n-form-item>
            <div v-if="previewSettings.selectedDevice === 'custom'" class="custom-size-inputs">
              <n-form-item label="宽度" size="small">
                <n-input-number size="small" v-model:value="customWidth" :min="100" :max="3000" placeholder="宽度" />
              </n-form-item>
              <n-form-item label="高度" size="small">
                <n-input-number size="small" v-model:value="customHeight" :min="100" :max="3000" placeholder="高度" />
              </n-form-item>
              <n-button type="primary" size="small" color="#f4d03f" @click="emit('confirm-custom-size')">确定</n-button>
            </div>
          </template>

          <!-- 标题设置 -->
          <template v-else-if="activePanel === 'title'">
            <n-form-item label="显示标题" size="small">
              <n-switch size="small" :value="titleSettings.show" 
                @update:value="(val: boolean) => titleSettings.show = val" />
            </n-form-item>
            <TitleSettings v-if="titleSettings.show" :title-settings="titleSettings" 
              @update:title-settings="(val) => emit('update:title-settings', val)" />
          </template>

          <!-- 水印设置 -->
          <template v-else-if="activePanel === 'watermark'">
            <WatermarkSettings />
          </template>

          <!-- 背景设置 -->
          <template v-else-if="activePanel === 'background'">
            <BackgroundSettings :background-settings="backgroundSettings" 
              @update:background-settings="(val) => emit('update:backgroundSettings', val)" />
          </template>

          <!-- 个人收藏 -->
          <template v-else-if="activePanel === 'templates'">
            <PersonalTemplates @load-template="(template) => emit('load-template', template)" />
          </template>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useWallpaper } from '@/hooks/useWallpaper'
import { PhUploadSimple as UploadSimple} from '@phosphor-icons/vue'
import { 
  NButton, NFormItem, NIcon, NUpload, 
  NSelect, NSwitch, NInputNumber 
} from 'naive-ui'
import TitleSettings from '../toolbar/TitleSettings.vue'
import WatermarkSettings from '../toolbar/WatermarkSettings.vue'
import BackgroundSettings from '../toolbar/BackgroundSettings.vue'
import PersonalTemplates from '../PersonalTemplates.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  closeOnMask: { type: Boolean, default: true }
})

const { 
  previewSettings,
  customWidth,
  customHeight,
  deviceOptions,
  titleSettings,
  backgroundSettings,
  
} = useWallpaper()

const activePanel = ref('upload')

const emit = defineEmits<{
  (e: 'update:show', v: boolean): void
  (e: 'update:backgroundSettings', val: any): void
  (e: 'load-template', template: any): void
  (e: 'image-upload', file: any): void
  (e: 'update:title-settings', val: any): void
  (e: 'confirm-custom-size'): void
}>()

const close = () => emit('update:show', false)
const onMaskClick = () => {
  if (props.closeOnMask) close()
}

// 锁定滚动，避免底部弹窗打开时页面跟随滚动
const toggleBodyScroll = (lock: boolean) => {
  const body = document.body
  if (lock) {
    body.dataset.prevOverflow = body.style.overflow || ''
    body.style.overflow = 'hidden'
  } else {
    body.style.overflow = body.dataset.prevOverflow || ''
    delete body.dataset.prevOverflow
  }
}

watch(() => props.show, (val) => toggleBodyScroll(val), { immediate: true })

onMounted(() => {
  if (props.show) toggleBodyScroll(true)
})

onBeforeUnmount(() => toggleBodyScroll(false))
</script>

<style scoped>
.mbs-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 2000;
}

.mbs-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2001;
  background: var(--n-card-color, #fff);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
  max-height: 80vh; /* 限高，内部内容滚动 */
  overflow: hidden; /* 头部圆角生效 */
  display: flex;
  flex-direction: column;
}

.mbs-handle {
  width: 36px;
  height: 4px;
  border-radius: 999px;
  background: var(--n-border-color, rgba(0,0,0,0.12));
  margin: 8px auto 4px;
}

.mbs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px 8px;
  border-bottom: 1px solid var(--n-border-color, rgba(0,0,0,0.08));
}

.mbs-title {
  font-size: 14px;
  font-weight: 600;
}

.mbs-close {
  border: none;
  background: transparent;
  padding: 4px 8px;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.mbs-body {
  padding: 8px 12px 12px;
  overflow-y: auto; /* 由内容决定高度，溢出时滚动 */
}

/* 过渡动画 */
.mbs-fade-enter-active, .mbs-fade-leave-active { transition: opacity .18s ease; }
.mbs-fade-enter-from, .mbs-fade-leave-to { opacity: 0; }

.mbs-slide-up-enter-active, .mbs-slide-up-leave-active { transition: transform .22s ease; }
.mbs-slide-up-enter-from, .mbs-slide-up-leave-to { transform: translateY(10%); }
</style>
