import { fileURLToPath ,URL } from 'url'
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueMacros from "unplugin-vue-macros/vite";

const proxyConfig = {
  [loadEnv("", process.cwd()).VITE_BASE_API]: {
    target: loadEnv("", process.cwd()).VITE_SERVER_HOST,
    changeOrigin: true,
    logLevel: "debug",
    rewrite: (path: string) =>
      path.replace(
        new RegExp(`${loadEnv("", process.cwd()).VITE_BASE_API}`),
        ""
      ),
  },
};

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true,
    fs: {
      strict: true,
    },
    proxy: {
      ...proxyConfig,
    },
  },
  plugins: [
    VueMacros({
      plugins: {
        vue: vue({
          template: {
            compilerOptions: {
              // 将所有带短横线的标签名都视为自定义元素
              isCustomElement: (tag) => tag.includes("schema-card"),
            },
          },
        }),
      },
    }),
    vueJsx(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }
    ]
  }
});
