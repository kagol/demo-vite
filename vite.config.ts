import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VueMcp } from 'vite-plugin-vue-mcp'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('lit-'),
        }
      }
    }),
    VueMcp(),
  ],
  resolve: {
    alias: [
      { find: '@/composables', replacement: path.resolve(__dirname, './src/composables') }
    ]
  }
})
