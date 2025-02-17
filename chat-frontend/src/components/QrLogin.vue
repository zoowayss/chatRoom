<template>
  <div class="login-page">
    <div class="login-container">
      <h2>聊天室登录</h2>
      <div class="qr-login">
        <div class="qr-container">
          <div v-if="qrCodeUrl" class="qr-code">
            <img :src="qrCodeUrl" alt="登录二维码" />
            <p v-if="status === 'PENDING'">请使用手机扫码登录</p>
            <p v-else-if="status === 'SCANNED'">已扫描，请在手机上确认</p>
            <p v-else-if="status === 'CONFIRMED'">登录成功，正在跳转...</p>
          </div>
          <div v-else class="loading">
            正在生成二维码...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { userStore } from '../store/user'

export default defineComponent({
  name: 'QrLogin',
  setup() {
    const router = useRouter()
    const qrCodeUrl = ref('')
    const status = ref('PENDING')
    const qrId = ref('')
    const stompClient = ref<Client | null>(null)

    const generateQrCode = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/qrcode/generate')
        const data = await response.json()
        qrId.value = data.qrId
        qrCodeUrl.value = await QRCode.toDataURL(data.content)
        status.value = data.status
        connectWebSocket()
      } catch (error) {
        console.error('生成二维码失败:', error)
      }
    }

    const connectWebSocket = () => {
      const client = new Client({
        webSocketFactory: () => new SockJS('http://172.31.39.193:8080/ws'),
        onConnect: () => {
          client.subscribe(`/topic/qrcode/${qrId.value}`, (message) => {
            const data = JSON.parse(message.body)
            console.log(data)
            status.value = data.status
            
            if (data.status === 'CONFIRMED') {
              const userId = `user_${Date.now()}`
              userStore.setUser(data.username, userId)
              router.replace('/chat')
            }
          })
        }
      })

      client.activate()
      stompClient.value = client
    }

    onMounted(() => {
      generateQrCode()
    })

    onUnmounted(() => {
      if (stompClient.value) {
        stompClient.value.deactivate()
      }
    })

    return {
      qrCodeUrl,
      status
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

.qr-login {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-container {
  padding: 20px;
}

.qr-code {
  text-align: center;
}

.qr-code img {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
}

.loading {
  text-align: center;
  color: #666;
}
</style> 