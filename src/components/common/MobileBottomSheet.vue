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
        <div class="mbs-body">
          <slot />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  closeOnMask: { type: Boolean, default: true },
})

const emit = defineEmits<{
  (e: 'update:show', v: boolean): void
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
  background: var(--bg-card, #fff);
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
  background: var(--border-color, rgba(0,0,0,0.12));
  margin: 8px auto 4px;
}

.mbs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px 8px;
  border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.08));
}

.mbs-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.mbs-close {
  border: none;
  background: transparent;
  padding: 4px 8px;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  color: var(--text-secondary);
}

.mbs-body {
  padding: 8px 12px 12px;
  overflow-y: auto; /* 由内容决定高度，溢出时滚动 */
}

/* 过渡动画 */
.mbs-fade-enter-active, .mbs-fade-leave-active { transition: opacity .18s ease; }
.mbs-fade-enter-from, .mbs-fade-leave-to { opacity: 0; }

.mbs-slide-up-enter-active, .mbs-slide-up-leave-active { transition: transform .22s ease; }
.mbs-slide-up-enter-from, .mbs-slide-up-leave-to { transform: translateY(100%); }
</style>