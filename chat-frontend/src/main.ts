

// 添加 global 定义
window.global = window;
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'


const app = createApp(App)
app.mount('#app') 