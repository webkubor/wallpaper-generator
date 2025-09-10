<template>
  <div class="gemini-chat">
    <div class="chat-container">
      <div class="chat-history">
        <div v-for="(msg, index) in chatHistory" :key="index" class="message" :class="msg.role">
          <div class="role">{{ msg.role === 'user' ? '你' : 'Gemini' }}</div>
          <div class="content" v-html="msg.content"></div>
        </div>
      </div>
      
      <div class="input-area">
        <textarea 
          v-model="prompt" 
          placeholder="输入您的问题..."
          @keyup.enter="callGemini"
        ></textarea>
        <button @click="callGemini" :disabled="isLoading || !prompt.trim()">
          {{ isLoading ? '发送中...' : '发送' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import fly from 'flyio'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const prompt = ref('')
const isLoading = ref(false)
const chatHistory = ref<Array<{role: 'user' | 'assistant', content: string}>>([])

// 模拟逐字输出函数
const typeWriter = async (text: string, targetIndex: number, speed = 30) => {
  for (let i = 0; i < text.length; i++) {
    chatHistory.value[targetIndex].content += text[i]
    await new Promise(r => setTimeout(r, speed))
  }
}

const callGemini = async () => {
  if (!prompt.value.trim()) return
  
  try {
    isLoading.value = true
    const userMessage = prompt.value
    chatHistory.value.push({ role: 'user', content: userMessage })
    
    // 先占位 AI 消息
    chatHistory.value.push({ role: 'assistant', content: '' })
    const aiIndex = chatHistory.value.length - 1
    
    // 调用 API
    const res = await fly.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: userMessage
          }]
        }]
      }
    )
    
    const aiResponse = res.data.candidates[0].content.parts[0].text
    // 逐字渲染
    await typeWriter(aiResponse, aiIndex, 20) // 20ms/字符，可调节速度
    
    prompt.value = ''
  } catch (error) {
    console.error('API调用失败:', error)
    chatHistory.value.push({ 
      role: 'assistant', 
      content: '抱歉，请求过程中出现错误，请稍后再试。' 
    })
  } finally {
    isLoading.value = false
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

  /* 移除h1样式 */

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
        }

        .role {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          opacity: 0.8;
          letter-spacing: 0.5px;
        }

        .content {
          font-size: 1rem;
        }
      }
    }

    .input-area {
      display: flex;
      gap: 1rem;
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
        flex: 1;
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
        }

        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
        }

        &::placeholder {
          color: #aaa;
        }
      }

      button {
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

// 响应式设计
@media (max-width: 768px) {
  .gemini-chat {
    padding: 1rem;
    --gradient-primary: linear-gradient(135deg, #d4af37, #f1c40f);
    
    /* 移除h1样式 */
    
    .chat-container {
      border-radius: 18px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      
      .chat-history {
        padding: 1.2rem;
        background-size: 15px 15px;
        
        .message {
          max-width: 88%;
          padding: 1.1rem;
          font-size: 0.95rem;
          
          .role {
            font-size: 0.8rem;
          }
        }
      }
      
      .input-area {
        padding: 1rem;
        flex-direction: column;
        
        textarea {
          min-height: 4.5rem;
          width: 100%;
          font-size: 1rem;
          
          &:focus {
            min-height: 5rem;
          }
        }
        
        button {
          width: 100%;
          padding: 0.9rem;
          margin-top: 0.5rem;
        }
      }
    }
  }
}
</style>