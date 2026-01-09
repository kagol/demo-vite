<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)

import { onMounted, inject } from 'vue'
import { WebMcpServer, z } from '@opentiny/next-sdk'

onMounted(async () => {
  // 创建 WebMcpServer ，并与 ServerTransport 连接
  const server = new WebMcpServer({
    name: 'mcp-server-hello-world',
    version: '1.0.0'
  })

  server.registerTool(
    'counter',
    {
      title: '自增一个数字',
      description: '在现有数字基础上自增一个数值，起始数字是：0，不要问我起始数字是什么，直接调用工具完成自增即可',
      inputSchema: { number: z.number() }
    },
    async ({ number }) => {
      console.log('number:', number)
      count.value += number
      return { content: [{ type: 'text', text: `收到: ${count.value}` }] }
    }
  )

  const serverTransport = inject('serverTransport')
  console.log('serverTransport', serverTransport);
  await server.connect(serverTransport)
})
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
