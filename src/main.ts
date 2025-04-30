import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'virtual:uno.css'

// import { xss } from '@opentiny/utils'

// const options = {
//   enableAttrs: true,
//   enableHtml: true,
//   enableUrl: true,

//   html: {
//     whiteList: {
//       img: ['class', 'style', 'src', 'width', 'height', 'alt'],
//     }
//   }
// }

// xss.setXssOption(options)

createApp(App).mount('#app')
