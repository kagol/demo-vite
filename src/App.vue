<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { TinyBaseSelect, TinyButton } from '@opentiny/vue'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { createTransportPair } from '@opentiny/next'

// 创建一对可互通的 Transport 实例
const [serverTransport, clientTransport] = createTransportPair()

let client

onMounted(async () => {
  const { mcpServerTinyVue: server, globalState } = getCurrentInstance().appContext.config.globalProperties

  client = new Client({
    name: 'example-client',
    version: '1.0.0'
  })

  // 建立服务端和客户端的通信连接
  await server.connect(serverTransport)
  await client.connect(clientTransport)
})

const options = ref([
  { value: '选项 1', label: '北京' },
  { value: '选项 2', label: '上海' },
  { value: '选项 3', label: '天津' },
  { value: '选项 4', label: '重庆' },
  { value: '选项 5', label: '深圳' }
])

const autoHandleSelect = async () => {
  const result = await client.callTool({
    name: 'selectOption',
    arguments: {
      value: '选项 2'
    }
  })

  console.log('result====', result)
}
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

  <div style="display: flex; align-items: center;">
    <tiny-base-select v-model="globalState.selectModelValue" :options="options"> </tiny-base-select>
    <tiny-button type="primary" size="mini" round style="margin-left: 12px;" @click="autoHandleSelect">AI 自动操作</tiny-button>
  </div>
</template>
