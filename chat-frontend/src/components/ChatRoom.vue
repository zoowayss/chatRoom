<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>聊天室</h2>
    </div>
    
    <div class="chat-messages" ref="messageContainer">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <div :class="['message-content', msg.type.toLowerCase()]">
          <span class="sender">{{ msg.sender }}</span>
          <p>{{ msg.content }}</p>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

interface ChatMessage {
  sender: string
  content: string
  type: 'CHAT' | 'JOIN' | 'LEAVE'
}

export default defineComponent({
  name: 'ChatRoom',
  setup() {
    const messages = ref<ChatMessage[]>([])
    const newMessage = ref('')
    const stompClient = ref<Client | null>(null)
    const username = ref('')
    const messageContainer = ref<HTMLElement | null>(null)

    const connect = () => {
      const client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        onConnect: () => {
          client.subscribe('/topic/public', (message) => {
            const receivedMessage = JSON.parse(message.body)
            messages.value.push(receivedMessage)
            scrollToBottom()
          })

          username.value = prompt('请输入您的用户名') || `用户${Math.floor(Math.random() * 1000)}`
          client.publish({
            destination: '/app/chat.addUser',
            body: JSON.stringify({
              sender: username.value,
              type: 'JOIN',
              content: username.value + ' 加入了聊天室'
            })
          })
        }
      })

      client.activate()
      stompClient.value = client
    }

    const sendMessage = () => {
      if (newMessage.value.trim() && stompClient.value) {
        const chatMessage = {
          sender: username.value,
          content: newMessage.value,
          type: 'CHAT'
        }
        stompClient.value.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(chatMessage)
        })
        newMessage.value = ''
      }
    }

    const scrollToBottom = () => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    }

    onMounted(() => {
      connect()
    })

    onUnmounted(() => {
      if (stompClient.value) {
        stompClient.value.deactivate()
      }
    })

    return {
      messages,
      newMessage,
      sendMessage,
      messageContainer
    }
  }
})
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.chat-header {
  text-align: center;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px 8px 0 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
}

.message {
  margin-bottom: 10px;
}

.message-content {
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
}

.message-content.chat {
  background: #e3f2fd;
}

.message-content.join {
  background: #e8f5e9;
  text-align: center;
}

.message-content.leave {
  background: #ffebee;
  text-align: center;
}

.sender {
  font-weight: bold;
  margin-right: 8px;
}

.chat-input {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 0 0 8px 8px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #1565c0;
}
</style> 