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

// 直接使用集中管理的消息状态
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
}

.message-item {
  width: fit-content;
  max-width: 520px;
  min-width: 260px;
  text-align: left;
  padding: 10px 18px;
  border-radius: 14px;
  margin-top: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  font-weight: 500;
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.13);
  border: none;
}

// ===== 普通消息类型样式 =====
.message-success  { background: #f1faed !important; color: #222 !important; }
.message-warning  { background: #fff8f1 !important; color: #222 !important; }
.message-error    { background: #fff0f6 !important; color: #222 !important; }
.message-info     { background: #e8f3ff !important; color: #174a6c !important; }

.message-item:hover {
  transform: translateY(-2px);
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
  line-height: 1.6;
  min-height: 20px;
  justify-content: center;
  padding-left: 2px;
  padding-right: 2px;
}

// ===== 标签样式 =====
.msg-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  padding: 1px 8px;
  margin-right: 8px;
  letter-spacing: 1px;
  vertical-align: middle;
}
.msg-label-success { background: #e8f7e5; color: #388e3c; }
.msg-label-warning { background: #fff3e0; color: #e65100; }
.msg-label-error   { background: #fde7ef; color: #c2185b; }
.msg-label-info    { background: #e3f2fd; color: #1565c0; }

/* 过渡动画样式 */
.message-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-enter-from, .message-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
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
