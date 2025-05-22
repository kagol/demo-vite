import { createApp, reactive } from 'vue'
import './style.css'
import App from './App.vue'
import { setupMcp } from '@opentiny/mcp-tiny-vue'
import 'virtual:uno.css'

const globalState = reactive({
  selectModelValue: ''
})

const mcpServerTinyVue = setupMcp({
  tools: {
    // 由用户来实现具体的工具逻辑
    selectOption: (value) => {
      globalState.selectModelValue = value
    },
    // 配置更多工具逻辑
  }
})

const app = createApp(App)

app.config.globalProperties.mcpServerTinyVue = mcpServerTinyVue
app.config.globalProperties.globalState = globalState

app.mount('#app')
