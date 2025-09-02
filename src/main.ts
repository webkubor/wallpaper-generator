import { createApp } from 'vue'
import App from './App.vue'

// 引入SASS样式文件
import './styles/global.scss'
import './styles/theme.scss'

const app = createApp(App)
app.mount('#app')
