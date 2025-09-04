import type { App } from 'vue';
import { createApp } from 'vue';
import { messageState, message } from './state';
import Message from './Message.vue';

// 声明全局属性类型扩展
declare module 'vue' {
  interface ComponentCustomProperties {
    $message: typeof message;
  }
}

// 声明全局window扩展
declare global {
  interface Window {
    $message: typeof message;
  }
}

export function useMessagePlugin(app: App) {
  // 创建消息组件实例并挂载到body
  const messageContainer = document.createElement('div');
  messageContainer.id = 'global-message-container';
  document.body.appendChild(messageContainer);
  
  // 挂载消息组件
  const messageApp = createApp(Message);
  messageApp.mount(messageContainer);
  
  // 注册全局方法
  app.config.globalProperties.$message = message;
  
  // 同时暴露到window对象，方便非组件环境调用
  window.$message = app.config.globalProperties.$message;
}

// 导出便捷方法，可以直接导入使用
export { message, messageState };

export default {
  install: (app: App) => {
    useMessagePlugin(app);
  }
};