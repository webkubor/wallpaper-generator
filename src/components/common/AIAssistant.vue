<template>
  <div class="ai-assistant">
    <!-- 悬浮按钮 -->
    <button 
      class="ai-float-btn" 
      @click="togglePanel"
      :class="{ 'active': showPanel }"
      title="🤖 AI 助手"
    >
      <span class="ai-icon">🤖</span>
      <span class="ai-text">AI</span>
    </button>

    <!-- 面板 -->
    <Transition name="slide-fade">
      <div v-if="showPanel" class="ai-panel">
        <div class="ai-header">
          <h3>🤖 AI 助手</h3>
          <p class="ai-subtitle">支持自然语言控制</p>
          <button class="ai-close" @click="showPanel = false">×</button>
        </div>

        <div class="ai-content">
          <!-- 状态检测 -->
          <div class="ai-status" :class="{ 'ready': isReady }">
            <span class="status-dot"></span>
            <span>{{ isReady ? 'WebMCP 已就绪' : '正在检测...' }}</span>
          </div>

          <!-- 示例 Prompts -->
          <div class="ai-section">
            <h4>💬 直接对 AI 说：</h4>
            <div class="prompt-list">
              <div 
                v-for="(prompt, index) in examplePrompts" 
                :key="index"
                class="prompt-item"
                @click="copyPrompt(prompt)"
              >
                <span class="prompt-text">{{ prompt }}</span>
                <span class="copy-hint">点击复制</span>
              </div>
            </div>
          </div>

          <!-- 可用工具 -->
          <div class="ai-section">
            <h4>🛠️ AI 可用操作：</h4>
            <div class="tool-list">
              <div v-for="tool in tools" :key="tool.name" class="tool-item">
                <code class="tool-name">{{ tool.name }}</code>
                <p class="tool-desc">{{ tool.description }}</p>
              </div>
            </div>
          </div>

          <!-- 协议信息 -->
          <div class="ai-footer">
            <a href="/.well-known/webmcp.json" target="_blank" class="protocol-link">
              查看 WebMCP 协议定义 ↗
            </a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 复制成功提示 -->
    <Transition name="fade">
      <div v-if="showCopyToast" class="copy-toast">已复制到剪贴板</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const showPanel = ref(false);
const isReady = ref(false);
const showCopyToast = ref(false);

const examplePrompts = [
  "帮我把背景换成深蓝色，标题改为'早安'，然后导出壁纸",
  "把水印改成'@我的品牌'，颜色用金色，透明度调高一点",
  "换成 iPhone 尺寸，去掉设备边框，加上透视背景效果",
  "把标题字体换成可爱的风格，文字改成竖排",
  "重置所有设置，恢复默认状态"
];

const tools = [
  { name: 'get_wallpaper_config', description: '获取当前所有配置' },
  { name: 'update_wallpaper_config', description: '修改水印、标题、设备、背景等' },
  { name: 'set_image_url', description: '更换背景图片' },
  { name: 'export_wallpaper', description: '导出并下载壁纸' },
  { name: 'reset_wallpaper_config', description: '重置为默认配置' }
];

const togglePanel = () => {
  showPanel.value = !showPanel.value;
};

const copyPrompt = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showCopyToast.value = true;
    setTimeout(() => {
      showCopyToast.value = false;
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
  }
};

onMounted(() => {
  // 检测 WebMCP 是否就绪
  const checkReady = () => {
    if ((window as any).mcp) {
      isReady.value = true;
    }
  };
  
  checkReady();
  window.addEventListener('webmcp:ready', () => {
    isReady.value = true;
  });
});
</script>

<style scoped lang="scss">
.ai-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ai-float-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  &.active {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
}

.ai-icon {
  font-size: 18px;
}

.ai-text {
  font-weight: 600;
}

.ai-panel {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 380px;
  max-width: calc(100vw - 40px);
  max-height: 70vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ai-header {
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .ai-subtitle {
    margin: 4px 0 0;
    opacity: 0.9;
    font-size: 13px;
  }
}

.ai-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.ai-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;

  &.ready {
    background: #e8f5e9;
    color: #2e7d32;

    .status-dot {
      background: #4caf50;
      animation: none;
    }
  }
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #ffc107;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.ai-section {
  margin-bottom: 20px;

  h4 {
    margin: 0 0 12px;
    font-size: 14px;
    color: #333;
    font-weight: 600;
  }
}

.prompt-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prompt-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:hover {
    background: #e3f2fd;
    border-color: #2196f3;
  }
}

.prompt-text {
  font-size: 13px;
  color: #333;
  line-height: 1.5;
  display: block;
}

.copy-hint {
  font-size: 11px;
  color: #2196f3;
  margin-top: 4px;
  display: block;
  opacity: 0;
  transition: opacity 0.2s;
}

.prompt-item:hover .copy-hint {
  opacity: 1;
}

.tool-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tool-item {
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.tool-name {
  font-size: 12px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
}

.tool-desc {
  margin: 6px 0 0;
  font-size: 12px;
  color: #666;
}

.ai-footer {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  text-align: center;
}

.protocol-link {
  font-size: 12px;
  color: #667eea;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.copy-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  z-index: 10000;
}

// 动画
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 移动端适配
@media (max-width: 480px) {
  .ai-panel {
    width: calc(100vw - 40px);
    right: -10px;
  }
}
</style>
