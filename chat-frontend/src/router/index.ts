import { createRouter, createWebHistory } from 'vue-router'
import QrLogin from '../components/QrLogin.vue'
import ChatRoom from '../components/ChatRoom.vue'
import ScanPage from '../components/ScanPage.vue'

const routes = [
  {
    path: '/',
    name: 'QrLogin',
    component: QrLogin
  },
  {
    path: '/chat',
    name: 'ChatRoom',
    component: ChatRoom,
    props: true
  },
  {
    path: '/scan',
    name: 'ScanPage',
    component: ScanPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 