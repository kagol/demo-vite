import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { getValue } from '@opentiny/vue-renderless/action-menu/vue'
console.log(getValue('test'))

createApp(App).mount('#app')
