import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { getValue, setValue, getAaa } from 'test/action-menu/vue2'
console.log(getValue('test'))

createApp(App).mount('#app')
