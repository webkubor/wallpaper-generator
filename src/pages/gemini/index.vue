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
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
import { marked } from 'marked'
import { NButton, NModal, NTooltip, NIcon } from 'naive-ui'
import fly from 'flyio'
import dayjs from 'dayjs'
import { 
  PhTrash as IconTrash, 
  PhExport as IconExport, 
  PhWarning as IconWarning, 
  PhChatCircle as IconContext 
} from '@phosphor-icons/vue'

// 声明全局消息提示类型
declare global {
  interface Window {
    $message: {
      success: (message: string) => void
      error: (message: string) => void
      warning: (message: string) => void
      info: (message: string) => void
    }
  }
}

// 消息类型定义
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  error?: string
}

// 状态管理
const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const prompt = ref('')
const isLoading = ref(false)
const chatHistory = ref<ChatMessage[]>([])
const chatHistoryRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const isOffline = ref(false)
const showNetworkError = ref(false)
const useContext = ref(true)

// 本地存储键
const STORAGE_KEY = 'gemini-chat-history'
const CONTEXT_SETTING_KEY = 'gemini-use-context'

// 初始化
onMounted(() => {
  // 加载聊天历史
  loadChatHistory()
  
  // 加载上下文设置
  const savedContextSetting = localStorage.getItem(CONTEXT_SETTING_KEY)
  if (savedContextSetting !== null) {
    useContext.value = JSON.parse(savedContextSetting)
  }
  
  // 监听网络状态
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // 检查当前网络状态
  isOffline.value = !navigator.onLine
  if (isOffline.value) {
    window.$message.warning('您当前处于离线状态，无法使用 Gemini AI 助手')
  }
  
  // 自动聚焦输入框
  if (inputRef.value) {
    inputRef.value.focus()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

// 网络状态处理
const handleOnline = () => {
  isOffline.value = false
  window.$message.success('网络已连接，可以继续使用 Gemini AI 助手')
}

const handleOffline = () => {
  isOffline.value = true
  window.$message.warning('网络已断开，无法使用 Gemini AI 助手')
}

// 检查网络连接
const checkConnection = async () => {
  try {
    await fly.get('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey)
    showNetworkError.value = false
    window.$message.success('连接成功')
  } catch (error) {
    window.$message.error('连接失败，请检查网络设置')
  }
}

// 保存聊天历史到本地存储
const saveChatHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory.value))
  } catch (error) {
    console.error('保存聊天历史失败:', error)
  }
}

// 从本地存储加载聊天历史
const loadChatHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      chatHistory.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('加载聊天历史失败:', error)
    window.$message.error('加载聊天历史失败')
  }
}

// 清空聊天历史
const clearChat = () => {
  chatHistory.value = []
  saveChatHistory()
  window.$message.success('聊天历史已清空')
}

// 导出聊天记录
const exportChat = () => {
  try {
    const chatText = chatHistory.value.map(msg => {
      const role = msg.role === 'user' ? '你' : 'Gemini'
      const time = formatTime(msg.timestamp)
      return `【${role}】${time}\n${msg.content}\n\n`
    }).join('')
    
    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gemini-chat-${dayjs().format('YYYY-MM-DD-HH-mm')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    window.$message.success('聊天记录已导出')
  } catch (error) {
    console.error('导出聊天记录失败:', error)
    window.$message.error('导出聊天记录失败')
  }
}

// 切换上下文记忆
const toggleContext = () => {
  useContext.value = !useContext.value
  localStorage.setItem(CONTEXT_SETTING_KEY, JSON.stringify(useContext.value))
  window.$message.info(useContext.value ? '已启用上下文记忆' : '已禁用上下文记忆')
}

// 格式化时间
const formatTime = (timestamp: number) => {
  return dayjs(timestamp).format('MM-DD HH:mm')
}

// 格式化消息内容（支持 Markdown）
const formatMessage = (content: string) => {
  try {
    return marked(content, { breaks: true })
  } catch (error) {
    return content
  }
}

// 模拟逐字输出函数
const typeWriter = async (text: string, targetIndex: number, speed = 20) => {
  const targetMessage = chatHistory.value[targetIndex]
  if (!targetMessage) return
  
  targetMessage.content = ''
  
  for (let i = 0; i < text.length; i++) {
    if (targetMessage) {
      targetMessage.content += text[i]
      // 每添加一个字符就保存一次聊天历史
      if (i % 10 === 0) saveChatHistory()
    }
    await new Promise(r => setTimeout(r, speed))
  }
  
  // 完成后再保存一次
  saveChatHistory()
}

// 构建上下文
const buildContext = () => {
  if (!useContext.value) {
    return [{
      parts: [{ text: prompt.value }]
    }]
  }
  
  // 获取最近的对话作为上下文（最多10轮）
  const recentMessages = chatHistory.value.slice(-20)
  
  return [{
    parts: recentMessages.map(msg => ({
      text: `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
    })).concat([
      { text: `Human: ${prompt.value}` }
    ])
  }]
}

// 重试消息
const retryMessage = async (index: number) => {
  if (isLoading.value) return
  
  const userMessage = chatHistory.value[index]
  if (!userMessage || userMessage.role !== 'user') return
  
  // 删除这条消息之后的所有消息
  chatHistory.value = chatHistory.value.slice(0, index + 1)
  
  // 重新发送这条消息
  prompt.value = userMessage.content
  await nextTick()
  callGemini()
}

// 调用 Gemini API
const callGemini = async () => {
  if (!prompt.value.trim() || isLoading.value || isOffline.value) return
  
  // 检查网络连接
  if (!navigator.onLine) {
    showNetworkError.value = true
    return
  }
  
  try {
    isLoading.value = true
    const userMessage = prompt.value
    
    // 添加用户消息到聊天历史
    chatHistory.value.push({ 
      role: 'user', 
      content: userMessage,
      timestamp: Date.now()
    })
    
    // 清空输入框
    prompt.value = ''
    
    // 先占位 AI 消息
    chatHistory.value.push({ 
      role: 'assistant', 
      content: '',
      timestamp: Date.now()
    })
    const aiIndex = chatHistory.value.length - 1
    
    // 保存聊天历史
    saveChatHistory()
    
    // 滚动到底部
    await nextTick()
    scrollToBottom()
    
    // 调用 API
    const res = await fly.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: buildContext()
      },
      {
        timeout: 30000 // 30秒超时
      }
    )
    
    // 检查响应
    if (!res.data || !res.data.candidates || !res.data.candidates[0]) {
      throw new Error('API 返回数据格式错误')
    }
    
    const aiResponse = res.data.candidates[0].content.parts[0].text
    
    // 逐字渲染
    await typeWriter(aiResponse, aiIndex)
    
  } catch (error: any) {
    console.error('API调用失败:', error)
    
    // 错误类型判断
    let errorMessage = '请求过程中出现错误，请稍后再试。'
    
    if (error.status === 429) {
      errorMessage = 'API 请求次数超限，请稍后再试。'
    } else if (error.status === 400) {
      errorMessage = '请求参数错误，请检查您的输入。'
    } else if (error.status === 401 || error.status === 403) {
      errorMessage = 'API 密钥无效或权限不足。'
    } else if (!navigator.onLine) {
      errorMessage = '网络连接已断开，请检查您的网络设置。'
      showNetworkError.value = true
    } else if (error.message && error.message.includes('timeout')) {
      errorMessage = '请求超时，服务器响应时间过长。'
    }
    
    // 更新最后一条消息为错误状态
    if (chatHistory.value.length > 0) {
      const lastMessage = chatHistory.value[chatHistory.value.length - 1]
      if (lastMessage.role === 'assistant' && !lastMessage.content) {
        lastMessage.content = '抱歉，我无法回答这个问题。'
        lastMessage.error = errorMessage
      }
    }
    
    // 保存聊天历史
    saveChatHistory()
    
    // 显示错误消息
    window.$message.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

// 监听聊天历史变化，自动滚动到底部
watch(chatHistory, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

// 滚动到底部
const scrollToBottom = () => {
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
  }
}
</script>

<style lang="scss" scoped>
.gemini-chat {
  margin: 0 auto;
  padding: 2rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f9f5f0, #f1ece2);
  position: relative;
  overflow: hidden;
  --gradient-primary: linear-gradient(135deg, #d4af37, #f1c40f);
  --primary-color: #d4af37;
  --secondary-color: #f1c40f;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: var(--gradient-primary);
    z-index: 1;
    box-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
  }

  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08);
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(212, 175, 55, 0.15);
    transition: all 0.3s ease;
    transform: translateZ(0);
    
    &:hover {
      box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.8rem;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      background: rgba(255,255,255,0.8);
      
      .title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
      }
      
      .actions {
        display: flex;
        gap: 0.5rem;
      }
    }

    .chat-history {
      flex: 1;
      overflow-y: auto;
      padding: 1.8rem;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      background-image: radial-gradient(rgba(244, 208, 63, 0.03) 1px, transparent 1px);
      background-size: 20px 20px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.02);
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        opacity: 0.2;
        border-radius: 10px;
      }
      
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        opacity: 0.7;
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .empty-text {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .empty-tips {
          font-size: 0.9rem;
          color: #666;
        }
      }

      .message {
        max-width: 75%;
        padding: 1.4rem 1.6rem;
        border-radius: 20px;
        word-break: break-word;
        line-height: 1.7;
        box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: message-appear 0.4s ease-out forwards;
        will-change: transform;
        
        &:nth-child(odd) {
          animation-delay: 0.05s;
        }
        &:nth-child(even) {
          animation-delay: 0.1s;
        }

        @keyframes message-appear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        &.user {
          align-self: flex-end;
          background: var(--gradient-primary);
          color: #fff;
          border-bottom-right-radius: 4px;

          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            right: -10px;
            width: 0; 
            height: 0; 
            border-left: 10px solid #d4af37;
            border-top: 10px solid transparent;
          }
          
          .time {
            color: rgba(255, 255, 255, 0.7);
          }
        }

        &.assistant {
          align-self: flex-start;
          background: #f8f9fa;
          color: #333;
          border: 1px solid rgba(0,0,0,0.05);
          border-bottom-left-radius: 4px;

          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: -10px;
            width: 0; 
            height: 0; 
            border-right: 10px solid #f8f9fa;
            border-top: 10px solid transparent;
          }
          
          .time {
            color: #999;
          }
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          
          .role {
            font-size: 0.85rem;
            font-weight: 600;
            opacity: 0.8;
            letter-spacing: 0.5px;
          }
          
          .time {
            font-size: 0.75rem;
            opacity: 0.8;
          }
        }

        .content {
          font-size: 1rem;
          
          :deep(p) {
            margin: 0.5rem 0;
            
            &:first-child {
              margin-top: 0;
            }
            
            &:last-child {
              margin-bottom: 0;
            }
          }
          
          :deep(pre) {
            background: rgba(0, 0, 0, 0.05);
            padding: 0.8rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 0.8rem 0;
          }
          
          :deep(code) {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.9em;
            background: rgba(0, 0, 0, 0.05);
            padding: 0.2em 0.4em;
            border-radius: 3px;
          }
          
          :deep(ul), :deep(ol) {
            padding-left: 1.5rem;
            margin: 0.8rem 0;
          }
          
          :deep(blockquote) {
            border-left: 4px solid var(--primary-color);
            padding-left: 1rem;
            margin: 1rem 0;
            color: #555;
          }
        }
        
        .error-info {
          margin-top: 0.8rem;
          padding: 0.5rem 0.8rem;
          background: rgba(255, 0, 0, 0.1);
          border-radius: 8px;
          font-size: 0.85rem;
          color: #d32f2f;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          
          button {
            margin-left: auto;
          }
        }
      }
      
      .typing-indicator {
        align-self: flex-start;
        display: flex;
        align-items: center;
        gap: 0.3rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 20px;
        border: 1px solid rgba(0,0,0,0.05);
        
        .dot {
          width: 8px;
          height: 8px;
          background: var(--primary-color);
          border-radius: 50%;
          opacity: 0.6;
          animation: typing-dot 1.4s infinite ease-in-out both;
          
          &:nth-child(1) {
            animation-delay: -0.32s;
          }
          
          &:nth-child(2) {
            animation-delay: -0.16s;
          }
        }
        
        @keyframes typing-dot {
          0%, 80%, 100% {
            transform: scale(0.6);
          }
          40% {
            transform: scale(1);
          }
        }
      }
    }

    .input-area {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      padding: 1.2rem 1.8rem;
      background: #f8f9fa;
      border-top: 1px solid rgba(0,0,0,0.05);
      position: relative;

      &::before {
        content: "";
        position: absolute;
        top: -1px;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
        opacity: 0.2;
      }

      textarea {
        width: 100%;
        min-height: 5.5rem;
        padding: 1.2rem 1.4rem;
        border-radius: 18px;
        border: 1px solid rgba(0,0,0,0.12);
        resize: none;
        font-size: 1.05rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(255,255,255,0.98);
        box-shadow: inset 0 2px 6px rgba(0,0,0,0.04);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        
        &:focus {
          min-height: 6rem;
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
        }

        &::placeholder {
          color: #aaa;
        }
      }
      
      .input-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        button[type="primary"] {
          padding: 0.8rem 1.8rem;
          background: var(--gradient-primary);
          color: #fff;
          font-weight: 600;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 10px rgba(212, 175, 55, 0.2);
          letter-spacing: 0.5px;

          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(212, 175, 55, 0.3);
          }

          &:active {
            transform: translateY(-1px);
          }

          &:disabled {
            background: #d1d5db;
            cursor: not-allowed;
            box-shadow: none;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .gemini-chat {
    padding: 1rem;
    --gradient-primary: linear-gradient(135deg, #d4af37, #f1c40f);
    
    .chat-container {
      border-radius: 18px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      
      .chat-header {
        padding: 0.8rem 1.2rem;
        
        .title {
          font-size: 1rem;
        }
      }
      
      .chat-history {
        padding: 1.2rem;
        background-size: 15px 15px;
        
        .message {
          max-width: 88%;
          padding: 1.1rem;
          font-size: 0.95rem;
          
          .message-header {
            .role {
              font-size: 0.8rem;
            }
            
            .time {
              font-size: 0.7rem;
            }
          }
        }
      }
      
      .input-area {
        padding: 1rem;
        
        textarea {
          min-height: 4.5rem;
          padding: 1rem;
          font-size: 1rem;
          
          &:focus {
            min-height: 5rem;
          }
        }
        
        .input-actions {
          button[type="primary"] {
            padding: 0.7rem 1.4rem;
            font-size: 0.9rem;
          }
        }
      }
    }
  }
}
</style>