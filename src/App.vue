<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'

import { onMounted, ref, provide } from 'vue'
import { createMessageChannelPairTransport, WebMcpClient } from '@opentiny/next-sdk'
import { TinyRemoter } from '@opentiny/next-remoter'
import '@opentiny/next-remoter/dist/style.css'

const visible = ref(false)
const sessionId = ref('')
const [serverTransport, clientTransport] = createMessageChannelPairTransport()
provide('serverTransport', serverTransport)

onMounted(async () => {
  // 创建 WebMcpClient ，并与 WebAgent 连接
  const client = new WebMcpClient()
  await client.connect(clientTransport)
  const { sessionId: sessionID } = await client.connect({
    agent: true,

    // sessionId 为可选参数。若传入该参数，系统将使用指定值作为会话标识；若未传入，WebAgent 服务将自动生成一个随机的字符串作为 sessionId。为便于通过 MCP Inspector 工具进行调试，此处采用了固定的 sessionId。用户亦可通过浏览器原生提供的 crypto.randomUUID() 方法生成随机字符串作为会话标识。
    sessionId: 'd299a869-c674-4125-a84b-bb4e24079b99',

    url: 'https://agent.opentiny.design/api/v1/webmcp-trial/mcp'
    // https://agent.opentiny.design/api/v1/webmcp-trial/mcp
    // https://ai.opentiny.design/webagent/api/v1/webmcp/mcp
  })
  visible.value = true
  sessionId.value = sessionID
  console.log('sessionId:', sessionId.value)
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
  <HelloWorld msg="Vite + Vue--test" />
  <tiny-remoter
    agent-root="https://agent.opentiny.design/api/v1/webmcp-trial/"
    :session-id="sessionId"
    :menuItems="[
      {
        action: 'qr-code',
        show: false
      },
      {
        action: 'remote-control',
        show: false
      },
      {
        action: 'remote-url',
        show: false
      }
    ]"
  />
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
