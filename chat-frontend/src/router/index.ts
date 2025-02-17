import { createRouter, createWebHistory } from 'vue-router'
import QrLogin from '../components/QrLogin.vue'
import ChatRoom from '../components/ChatRoom.vue'
import ScanPage from '../components/ScanPage.vue'
import { userStore } from '../store/user'

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
    meta: { requiresAuth: true }
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

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 先检查store中的登录状态
    if (userStore.isLoggedIn.value) {
      next()
    } else {
      // 再检查localStorage
      const user = userStore.getUser()
      if (user) {
        userStore.setUser(user.username, user.userId)
        next()
      } else {
        // 都没有，跳转到登录页
        next({ name: 'QrLogin' })
      }
    }
  } else {
    // 非受保护路由直接放行
    next()
  }
})

export default router 