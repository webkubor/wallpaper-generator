import { createApp } from 'vue'
import App from './App.vue'
import { useMessagePlugin } from "@/plugins/message";

// 引入样式文件
import './styles/font.scss'

// 创建应用实例
const app = createApp(App)

// 挂载应用
app.use(useMessagePlugin)
app.mount('#app')
