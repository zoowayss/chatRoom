<template>
  <div class="scan-page">
    <div v-if="!scanned" class="scan-container">
      <h2>扫码登录确认</h2>
      <div class="user-info">
        <input v-model="username" placeholder="请输入用户名" />
      </div>
      <button @click="confirmScan" :disabled="!username">确认登录</button>
    </div>
    <div v-else class="success-container">
      <h2>登录成功</h2>
      <p>请返回电脑端继续操作</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'ScanPage',
  setup() {
    const username = ref('')
    const scanned = ref(false)
    const qrId = ref('')

    onMounted(() => {
      // 从URL获取二维码ID
      const urlParams = new URLSearchParams(window.location.search)
      qrId.value = urlParams.get('qrId') || ''
    })

    const confirmScan = async () => {
      try {
        // 先发送扫描确认
        await fetch(`http://172.31.39.193:8080/api/qrcode/scan/${qrId.value}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: username.value })
        })

        // 等待一秒后发送登录确认
        setTimeout(async () => {
          await fetch(`http://localhost:8080/api/qrcode/confirm/${qrId.value}`, {
            method: 'POST'
          })
          scanned.value = true
        }, 1000)

      } catch (error) {
        console.error('确认失败:', error)
      }
    }

    return {
      username,
      scanned,
      confirmScan
    }
  }
})
</script>

<style scoped>
.scan-page {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.scan-container, .success-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.user-info {
  margin: 20px 0;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #1565c0;
}
</style> 