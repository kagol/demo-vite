import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerMcpConfig } from '@opentiny/vue-common'
import { createMcpTools, getTinyVueMcpConfig } from '@opentiny/tiny-vue-mcp'

registerMcpConfig(getTinyVueMcpConfig({ t: null }), createMcpTools)
console.log('registerMcpConfig mcpConfig=====', getTinyVueMcpConfig({ t: null }))

createApp(App).mount('#app')
