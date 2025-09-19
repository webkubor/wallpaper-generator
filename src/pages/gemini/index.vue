<template>
  <div class="gemini-chat">
    <div class="chat-container">
      <div class="chat-header">
        <div class="title">Gemini AI 助手</div>
        <div class="actions">
          <n-button size="small" @click="clearChat" :disabled="chatHistory.length === 0">
            <template #icon>
              <n-icon :component="IconTrash" />
            </template>
            清空对话
          </n-button>
          <n-button size="small" @click="exportChat" :disabled="chatHistory.length === 0">
            <template #icon>
              <n-icon :component="IconExport" />
            </template>
            导出对话
          </n-button>
        </div>
      </div>
      
      <div class="chat-history" ref="chatHistoryRef">
        <div v-if="chatHistory.length === 0" class="empty-state">
          <div class="empty-icon">💬</div>
          <div class="empty-text">开始与 Gemini AI 对话吧</div>
          <div class="empty-tips">您的对话将自动保存在本地</div>
        </div>
        
        <div v-for="(msg, index) in chatHistory" :key="index" class="message" :class="msg.role">
          <div class="message-header">
            <div class="role">{{ msg.role === 'user' ? '你' : 'Gemini' }}</div>
            <div class="time">{{ formatTime(msg.timestamp) }}</div>
          </div>
          <div class="content" v-html="formatMessage(msg.content)"></div>
          
          <div v-if="msg.error" class="error-info">
            <n-icon :component="IconWarning" /> {{ msg.error }}
            <n-button size="tiny" @click="retryMessage(index)" v-if="msg.role === 'user'">
              重试
            </n-button>
          </div>
        </div>
        
        <div v-if="isLoading" class="typing-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
      
      <div class="input-area">
        <textarea 
          v-model="prompt" 
          placeholder="输入您的问题..."
          @keyup.enter.exact="callGemini"
          @keydown.enter.ctrl.prevent="prompt += '\n'"
          ref="inputRef"
        ></textarea>
        <div class="input-actions">
          <n-tooltip trigger="hover" placement="top" :show-arrow="true">
            <template #trigger>
              <n-button circle size="small" @click="toggleContext" :type="useContext ? 'primary' : 'default'">
                <template #icon>
                  <n-icon :component="IconContext" />
                </template>
              </n-button>
            </template>
            {{ useContext ? '已启用上下文记忆' : '已禁用上下文记忆' }}
          </n-tooltip>
          
          <n-button type="primary" @click="callGemini" :disabled="isLoading || !prompt.trim() || isOffline">
            {{ isLoading ? '发送中...' : '发送' }}
          </n-button>
        </div>
      </div>
      
      <n-modal v-model:show="showNetworkError" preset="dialog" title="网络连接错误">
        <template #content>
          <p>无法连接到 Gemini API，请检查您的网络连接后重试。</p>
          <p>如果问题持续存在，可能是 API 服务暂时不可用。</p>
        </template>
        <template #action>
          <n-button @click="showNetworkError = false">关闭</n-button>
          <n-button type="primary" @click="checkConnection">重试连接</n-button>
        </template>
      </n-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NModal, NTooltip, NIcon } from 'naive-ui'
import { 
  PhTrash as IconTrash, 
  PhExport as IconExport, 
  PhWarning as IconWarning, 
  PhChatCircle as IconContext 
} from '@phosphor-icons/vue'
import { useGemini } from './gemini'
import './gemini.scss'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const {
  prompt,
  isLoading,
  chatHistory,
  isOffline,
  showNetworkError,
  useContext,
  checkConnection,
  clearChat,
  exportChat,
  toggleContext,
  formatTime,
  formatMessage,
  retryMessage,
  callGemini
} = useGemini(apiKey)
</script>