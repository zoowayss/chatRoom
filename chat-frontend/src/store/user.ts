import { ref } from 'vue'

const STORAGE_KEY = 'chat_user'

interface UserInfo {
  username: string
  userId: string
}

export const userStore = {
  username: ref(''),
  userId: ref(''),
  isLoggedIn: ref(false),

  init() {
    // 初始化时从localStorage读取用户信息
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      const userInfo: UserInfo = JSON.parse(storedUser)
      this.setUser(userInfo.username, userInfo.userId)
    }
  },

  setUser(username: string, userId: string) {
    this.username.value = username
    this.userId.value = userId
    this.isLoggedIn.value = true
    // 保存到localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ username, userId }))
  },

  clearUser() {
    this.username.value = ''
    this.userId.value = ''
    this.isLoggedIn.value = false
    // 清除localStorage
    localStorage.removeItem(STORAGE_KEY)
  },

  getUser(): UserInfo | null {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      return JSON.parse(storedUser)
    }
    return null
  }
} 