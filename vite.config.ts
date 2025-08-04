import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import { VueMcp } from 'vite-plugin-vue-mcp'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS(), VueMcp()],
  resolve: {
    alias: [
      { find: '@opentiny/mcp-tiny-vue', replacement: fileURLToPath(new URL('./mcp-tiny-vue/src', import.meta.url)) },
    ]
  }
})
