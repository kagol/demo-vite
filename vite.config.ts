import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: [
      { find: '@opentiny/mcp-tiny-vue', replacement: fileURLToPath(new URL('./mcp-tiny-vue/src', import.meta.url)) },
    ]
  }
})
