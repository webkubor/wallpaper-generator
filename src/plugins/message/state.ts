import { reactive } from 'vue';

// 消息项类型定义
export interface MessageItem {
  id: number;
  msg: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timeoutId: ReturnType<typeof setTimeout>;
}

// 消息方法接口定义
export interface MessageMethods {
  (message: string, type?: string): void;
  success(message: string): void;
  warning(message: string): void;
  error(message: string): void;
  info(message: string): void;
}

// 消息状态集中管理
const messageLimit = 5;
const timeout = 3000;
let messageCounter = 0;

// 创建消息状态对象
const state = reactive({
  messages: [] as MessageItem[],
  
  // 显示消息
  showMessage(message: string, type: string = 'info'): void {
    const id = Date.now() * 1000 + (messageCounter++ % 1000);
    const timeoutId = setTimeout(() => {
      this.removeMessage(id);
    }, timeout);

    const newMessage: MessageItem = {
      id,
      msg: message,
      type: type as 'success' | 'warning' | 'error' | 'info',
      timeoutId
    };
    
    this.messages.push(newMessage);

    // 如果队列长度超过限制，移除最早的消息
    if (this.messages.length > messageLimit) {
      const firstMsg = this.messages.shift();
      if (firstMsg && firstMsg.timeoutId) {
        clearTimeout(firstMsg.timeoutId);
      }
    }
  },

  // 移除消息
  removeMessage(id: number): void {
    const index = this.messages.findIndex(msg => msg.id === id);
    if (index !== -1) {
      // 清除定时器
      if (this.messages[index].timeoutId) {
        clearTimeout(this.messages[index].timeoutId);
      }
      // 直接修改响应式数组
      this.messages.splice(index, 1);
    }
  },

  // 清除所有消息
  clearAll(): void {
    this.messages.forEach(msg => {
      if (msg.timeoutId) {
        clearTimeout(msg.timeoutId);
      }
    });
    this.messages = [];
  }
});

// 创建链式调用的消息函数
const createMessageFunction = (): MessageMethods => {
  const messageFunction = (message: string, type: string = 'info') => {
    state.showMessage(message, type);
  };
  
  // 添加便捷方法
  messageFunction.success = (message: string) => state.showMessage(message, 'success');
  messageFunction.warning = (message: string) => state.showMessage(message, 'warning');
  messageFunction.error = (message: string) => state.showMessage(message, 'error');
  messageFunction.info = (message: string) => state.showMessage(message, 'info');
  
  return messageFunction as MessageMethods;
};

// 导出消息状态和方法
export const messageState = state;
export const message = createMessageFunction();
