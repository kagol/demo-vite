<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import DemoGrid from './components/DemoGrid.vue'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { createTransportPair, createSseProxy } from '@opentiny/next'

const mcpServer = {
  transport: null,
  done: () => {},
}

provide('mcpServer', mcpServer)
const session = ref('')

const [ transport, clientTransport ] = createTransportPair()
mcpServer.transport = transport

onMounted(async () => {
  const capabilities = { prompts: {},  resources: {}, tools: {}, logging: {} }
  const client = new Client({ name: 'demo-vite', version: '1.0.0' }, { capabilities })
  console.log('client======', client)
  await client.connect(clientTransport)

  const { sessionId } = await createSseProxy({
    client,
    url: 'http://39.108.160.245/sse',
    token: ''
  })

  session.value = sessionId
})
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <p>sessionId: http://39.108.160.245/sse?sessionId={{ session }}</p>
  <DemoGrid />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
