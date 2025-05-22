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

const selectRef2 = ref()
const switchValue = ref(false)

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

onMounted(async () => {
  client = new Client({ name: 'example-client', version: '1.0.0' })

  // 用户自定义的 MCP 工具
  server.tool('switchNFC', '开启或关闭 NFC 功能', { value: z.boolean() }, async ({ value }) => {
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

  // 用户自定义的 MCP 工具
  server.tool('selectOption2', '选择select组件的一个选项（优化版，提供模拟才操作的过程）', { value: z.string(), label: z.string() }, async ({ value, label }) => {
    // 模拟人操作，先点击下拉框，弹出下拉面板
    selectRef2.value.state.visible = true

    // 模拟人工操作延时
    await new Promise(r => setTimeout(r, 500))
    
    // 再点击指定的下拉选项，选择一个选项（椰子鸡）
    globalState.selectModelValue2 = value
    await new Promise(r => setTimeout(r, 200))
    selectRef2.value.state.visible = false

    return { content: [{ type: 'text', text: String(switchValue.value) }] }
  })

  // 建立服务端和客户端的通信连接
  await server.connect(serverTransport)
  await client.connect(clientTransport)
})

const autoHandleSelect = async () => {
  await client.callTool({
    name: 'selectOption',
    arguments: {
      value: 'shanghai'
    }
  })
}

const autoHandleSelect2 = async () => {
  await client.callTool({
    name: 'selectOption2',
    arguments: {
      value: 'yeziji',
      label: '椰子鸡',
    }
  })
}

const autoHandleSwitchNFC = async () => {
  await client.callTool({
    name: 'switchNFC',
    arguments: {
      value: switchValue.value ? false : true
    }
  })
}
</script>

<template>
  <div flex items-center mb-4>
    <div flex flex-row>
      <div class="w-[120px]">下拉框1：</div>
      <tiny-base-select ref="selectRef1" v-model="globalState.selectModelValue" :options="options"></tiny-base-select>
    </div>
    <tiny-button type="primary" round ml-4 @click="autoHandleSelect">AI 自动操作【下拉框1】</tiny-button>
  </div>

  <div flex items-center mb-4>
    <div flex flex-row>
      <div class="w-[120px]">下拉框2：</div>
      <tiny-base-select ref="selectRef2" v-model="globalState.selectModelValue2" :options="options2"></tiny-base-select>
    </div>
    <tiny-button type="primary" round ml-4 @click="autoHandleSelect2">AI 自动操作【下拉框2】</tiny-button>
  </div>

  <div>
    开启/关闭 NFC：<tiny-switch v-model="switchValue"></tiny-switch>
    <tiny-button type="primary" round ml-4 @click="autoHandleSwitchNFC">AI 自动开启/关闭 NFC 功能</tiny-button>
  </div>
</template>
