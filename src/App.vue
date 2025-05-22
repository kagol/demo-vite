<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { TinyBaseSelect, TinyButton, TinySwitch } from '@opentiny/vue'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { createTransportPair } from '@opentiny/next'
import { z } from 'zod'

// 创建一对可互通的 Transport 实例
const [serverTransport, clientTransport] = createTransportPair()
const { mcpServerTinyVue: server, globalState } = getCurrentInstance().appContext.config.globalProperties

let client

onMounted(async () => {
  client = new Client({
    name: 'example-client',
    version: '1.0.0'
  })

  // 用户自定义的 MCP 工具
  server.tool('switchNFC', '开启或关闭 NFC 功能', { value: z.boolean() }, async ({ value }) => {
    console.log('server tool switchNFC', value)
    switchValue.value = value

    // 用户自定义的 MCP 工具调用 TinyVue 的 MCP 工具
    await client.callTool({
      name: 'selectOption',
      arguments: {
        value: 'shanghai'
      }
    })

    return { content: [{ type: 'text', text: String(switchValue.value) }] }
  })

  // 建立服务端和客户端的通信连接
  await server.connect(serverTransport)
  await client.connect(clientTransport)
})

const options = ref([
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'tianjin', label: '天津' },
  { value: 'chongqing', label: '重庆' },
  { value: 'shenzhen', label: '深圳' }
])

const options2 = ref([
  { value: 'changfen', label: '肠粉' },
  { value: 'huoguo', label: '牛肉火锅' },
  { value: 'yeziji', label: '椰子鸡' },
  { value: 'zhujiaofan', label: '猪脚饭' },
  { value: 'guotiao', label: '牛肉粿条' }
])

const autoHandleSelect = async () => {
  const result = await client.callTool({
    name: 'selectOption',
    arguments: {
      value: 'shanghai'
    }
  })

  console.log('result====', result)
}

const switchValue = ref(false)

const autoHandleSwitchNFC = async () => {
  const result = await client.callTool({
    name: 'switchNFC',
    arguments: {
      value: switchValue.value ? false : true
    }
  })

  console.log('NFC result====', result)
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
    <div>
      下拉框1：<tiny-base-select ref="selectRef1" v-model="globalState.selectModelValue" :options="options"></tiny-base-select>
      下拉框2：<tiny-base-select ref="selectRef2" v-model="globalState.selectModelValue2" :options="options2"></tiny-base-select>
    </div>
    <tiny-button type="primary" size="mini" round style="margin-left: 12px;" @click="autoHandleSelect">AI 自动操作【下拉框1】</tiny-button>
    <tiny-button type="primary" size="mini" round style="margin-left: 12px;" @click="autoHandleSelect">AI 自动操作【下拉框2】</tiny-button>
  </div>

  <div>
    <tiny-switch v-model="switchValue"></tiny-switch>
    <tiny-button type="primary" size="mini" round style="margin-left: 12px;" @click="autoHandleSwitchNFC">AI 自动开启、关闭 NFC 功能</tiny-button>
  </div>
</template>
