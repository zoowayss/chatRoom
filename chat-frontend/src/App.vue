<template>
  <div class="app">
    <ChatRoom />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChatRoom from './components/ChatRoom.vue'

export default defineComponent({
  name: 'App',
  components: {
    ChatRoom
  }
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

.app {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
  box-sizing: border-box;
}
</style> 