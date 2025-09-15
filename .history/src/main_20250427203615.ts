import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { getValue } from 'test/action-menu/vue'
console.log(getValue('test'))

createApp(App).mount('#app')
