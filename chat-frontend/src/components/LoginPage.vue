<template>
  <div class="login-page">
    <QrLogin @login-success="handleLoginSuccess" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import QrLogin from './QrLogin.vue'

export default defineComponent({
  name: 'LoginPage',
  components: {
    QrLogin
  },
  setup() {
    const router = useRouter()

    const handleLoginSuccess = (username: string) => {
      const userId = `user_${Date.now()}`
      router.push({
        name: 'ChatRoom',
        params: {
          username,
          userId
        }
      })
    }

    return {
      handleLoginSuccess
    }
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.login-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}
</style> 