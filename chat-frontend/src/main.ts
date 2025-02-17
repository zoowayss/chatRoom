// 添加 global 定义
window.global = window;
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { userStore } from './store/user'
import './style.css'

// 初始化用户状态
userStore.init()

const app = createApp(App)
app.use(router)
app.mount('#app') 