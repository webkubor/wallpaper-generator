<template>
  <transition-group name="message" tag="div" class="message-list" role="alert" aria-live="polite">
    <div 
      v-for="item in messages" 
      :key="item.id" 
      class="message-item" 
      :class="{
        'message-info': item.type === 'info',
        'message-success': item.type === 'success',
        'message-warning': item.type === 'warning',
        'message-error': item.type === 'error'
      }"
      tabindex="-1"
    >
      <div class="message-icon">
        <PhCheckCircle v-if="item.type === 'success'" color="#4CAF50" :size="20" weight="bold" />
        <PhWarningCircle v-else-if="item.type === 'warning'" color="#FF933B" :size="20" weight="bold" />
        <PhXCircle v-else-if="item.type === 'error'" color="#e91e63" :size="20" weight="bold" />
        <PhCheckCircle v-else-if="item.type === 'info'" color="#2196f3" :size="20" weight="bold" />
      </div>
      <div class="message-content">
        <span>{{ item.msg }}</span>
      </div>
    </div>
  </transition-group>
</template>

<script lang="ts" setup>
import { PhCheckCircle, PhWarningCircle, PhXCircle } from '@phosphor-icons/vue';
import { messageState } from './state';
const messages = messageState.messages;
</script>

<style lang="scss" scoped>
.message-list {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  max-width: 80%;
  z-index: 9999;
  width: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.message-item {
  width: fit-content;
  max-width: 520px;
  min-width: 260px;
  text-align: left;
  padding: 10px 18px;
  border-radius: 14px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

// ===== 普通消息类型样式 =====
.message-success  { 
  background: linear-gradient(135deg, rgba(240, 253, 244, 0.95), rgba(220, 252, 231, 0.9)) !important; 
  color: #15803d !important; 
  backdrop-filter: blur(12px);
  box-shadow: 
    0 6px 16px rgba(34, 197, 94, 0.12),
    0 2px 6px rgba(34, 197, 94, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(34, 197, 94, 0.2);
}
.message-warning  { 
  background: linear-gradient(135deg, rgba(255, 251, 235, 0.95), rgba(254, 243, 199, 0.9)) !important; 
  color: #a16207 !important; 
  backdrop-filter: blur(12px);
  box-shadow: 
    0 6px 16px rgba(245, 158, 11, 0.12),
    0 2px 6px rgba(245, 158, 11, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(245, 158, 11, 0.2);
}
.message-error    { 
  background: linear-gradient(135deg, rgba(254, 242, 242, 0.95), rgba(254, 202, 202, 0.9)) !important; 
  color: #b91c1c !important; 
  backdrop-filter: blur(12px);
  box-shadow: 
    0 6px 16px rgba(239, 68, 68, 0.12),
    0 2px 6px rgba(239, 68, 68, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(239, 68, 68, 0.2);
}
.message-info     { 
  background: linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.9)) !important; 
  color: #1d4ed8 !important; 
  backdrop-filter: blur(12px);
  box-shadow: 
    0 6px 16px rgba(59, 130, 246, 0.12),
    0 2px 6px rgba(59, 130, 246, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(59, 130, 246, 0.2);
}

/* 消息进入和退出动画 */
.message-enter-active,
.message-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.message-enter-from {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.message-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.message-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.message-icon {
  margin-right: 8px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 20px;
}

.message-content {
  margin-left: 0;
  display: flex;
  flex-direction: column;
  word-break: break-word;
  white-space: normal;
  line-height: 1.5;
  min-height: 20px;
  justify-content: center;
  padding-left: 2px;
  padding-right: 2px;
  font-feature-settings: 'kern' 1, 'liga' 1;
  
  span {
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
}



/* 响应式设计 */
@media (min-width: 1024px) {
  .message-list {
    font-size: 14px;
    max-width: 60vw;
  }
}

@media (max-width: 1023px) {
  .message-list {
    font-size: 12px;
    max-width: 90vw;
  }
}

@media (max-width: 600px) {
  .message-list {
    font-size: 14px;
    max-width: 95vw;
    min-width: 300px;
    top: 10px;
  }
  
  .message-item {
    max-width: 95vw;
    min-width: 180px;
    padding: 8px 14px;
  }
}
</style>
