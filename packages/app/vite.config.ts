import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue({
          template: {
            compilerOptions: {
              // 将所有带短横线的标签名都视为自定义元素
              isCustomElement: (tag) => tag.includes('schema-card'),
            },
          },
        }),
      },
    }),
    vueJsx()
  ],
})
