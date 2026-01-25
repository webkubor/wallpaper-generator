<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" class="base-modal-mask" @click="handleMaskClick">
        <div class="base-modal-wrapper" :style="{ maxWidth: width }">
          <div class="base-modal" @click.stop>
            <!-- Header -->
            <div class="base-modal__header">
              <div class="base-modal__title">{{ title }}</div>
              <button class="base-modal__close" @click="close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            
            <!-- Body -->
            <div class="base-modal__body" :style="bodyStyle">
              <slot></slot>
            </div>
            
            <!-- Footer -->
            <div class="base-modal__footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  title?: string;
  width?: string;
  maskClosable?: boolean;
  bodyStyle?: any;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: '',
  width: '500px',
  maskClosable: true,
  bodyStyle: () => ({})
});

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'close'): void;
}>();

const close = () => {
  emit('update:show', false);
  emit('close');
};

const handleMaskClick = () => {
  if (props.maskClosable) {
    close();
  }
};
</script>

<style scoped lang="scss">
.base-modal-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.base-modal-wrapper {
  width: 100%;
  position: relative;
}

.base-modal {
  background-color: var(--bg-card);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: calc(100vh - 32px);
  animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
  }
  
  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  &__close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--text-primary);
    }
  }
  
  &__body {
    padding: 20px;
    overflow-y: auto;
    color: var(--text-primary);
    line-height: 1.6;
  }
  
  &__footer {
    padding: 16px 20px;
    border-top: 1px solid var(--border-color);
    background-color: var(--bg-body);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-pop {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
