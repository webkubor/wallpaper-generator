import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
import { marked } from 'marked'
import fly from 'flyio'
import dayjs from 'dayjs'

// 消息类型定义
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  error?: string
}



export function useGemini(apiKey: string) {
  // 状态管理
  const prompt = ref('')
  const isLoading = ref(false)
  const chatHistory = ref<ChatMessage[]>([])
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

  return {
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
  }
}