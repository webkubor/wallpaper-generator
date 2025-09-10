<template>
  <div class="gemini-chat">
    <h1>Gemini AI 聊天助手</h1>
    
    <div class="chat-container">
      <div class="chat-history">
        <div v-for="(msg, index) in chatHistory" :key="index" class="message" :class="msg.role">
          <div class="role">{{ msg.role === 'user' ? '你' : 'AI' }}</div>
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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f0f4f8, #d9e2ec);

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #1f2a38;
    font-size: 2rem;
    font-weight: 700;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }

  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    background: #ffffff;

    .chat-history {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .message {
        max-width: 70%;
        padding: 1rem 1.2rem;
        border-radius: 16px;
        word-break: break-word;
        line-height: 1.5;
        box-shadow: 0 3px 6px rgba(0,0,0,0.05);
        position: relative;
        transition: transform 0.2s;

        &.user {
          align-self: flex-end;
          background: linear-gradient(120deg, #4caf50, #81c784);
          color: #fff;

          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            right: -8px;
            width: 0; 
            height: 0; 
            border-top: 8px solid #4caf50;
            border-left: 8px solid transparent;
          }
        }

        &.assistant {
          align-self: flex-start;
          background: #f1f3f5;
          color: #333;

          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: -8px;
            width: 0; 
            height: 0; 
            border-top: 8px solid #f1f3f5;
            border-right: 8px solid transparent;
          }
        }

        .role {
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          opacity: 0.7;
        }
      }
    }

    .input-area {
      display: flex;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: #eef2f7;
      border-top: 1px solid #dce3eb;

      textarea {
        flex: 1;
        min-height: 4.5rem;
        padding: 0.8rem 1rem;
        border-radius: 12px;
        border: 1px solid #cfd8e3;
        resize: none;
        font-size: 1rem;
        transition: all 0.2s;

        &:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
        }
      }

      button {
        padding: 0.8rem 1.6rem;
        background: linear-gradient(120deg, #4caf50, #43a047);
        color: #fff;
        font-weight: 600;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76,175,80,0.4);
        }

        &:disabled {
          background: #a1aab1;
          cursor: not-allowed;
          box-shadow: none;
        }
      }
    }
  }
}
</style>