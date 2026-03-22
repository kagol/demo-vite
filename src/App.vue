<script setup lang="ts">
import { onMounted, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'

const count = ref(0);

onMounted(() => {
  // 注册工具：获取当前页面标题（适配 Chrome 146 WebMCP 规范）
  if (navigator.modelContext) {
    try {
      navigator.modelContext.registerTool({
        name: "getPageTitle", // 工具唯一名称（必填）
        description: "获取当前网页的标题", // 工具描述（必填）
        inputSchema: {
          type: "object",
          properties: {} // 无入参时为空对象
        }, // 入参校验 Schema（必填）
        // 核心修复：Chrome 146 要求用 execute 替代 handler
        async execute() {
          return { title: document.title };
        }
      });

      navigator.modelContext.registerTool({
        name: 'counter',
        description: '计数器，在现有数字基础上，自增 step 值',
        inputSchema: {
          type: "object",
          properties: {
            step: {
              type: "number",
              description: "自增的步数",
              default: 1
            }
          }
        },
        async execute(input) {
          const { step = 1 } = input;
          count.value += step;
          console.log('count.value', count.value);
          return {
            result: count.value + step
          };
        }
      })
      console.log("✅ WebMCP 工具注册成功：getPageTitle");
    } catch (error) {
      console.error("❌ 工具注册失败：", error.message);
    }
  } else {
    console.error("❌ WebMCP 未启用，请检查 chrome://flags/#enable-webmcp-testing");
  }
});
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  Counter <button @click="count++">count is: {{ count }}</button>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
