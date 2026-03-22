<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { TabServerTransport } from "@mcp-b/transports";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { onMounted, ref } from 'vue';
import { z } from "zod";

const count = ref(0)

onMounted(async () => {
  // Create the server (one per site)
  const server = new McpServer({
    name: "my-website",
    version: "1.0.0",
  });

  // Expose a tool (wrap your app's logic)
  server.tool("getPageInfo", "Get current page info", {}, async () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            title: document.title,
            url: window.location.href,
          }),
        },
      ],
    };
  });

    server.registerTool(
      'counter',
      {
        title: '自增',
        description: '在某个数字的基础上增加 step 个数字',
        inputSchema: {
          step: z.number().optional()
        },
      },
      async (params) => {
        console.log('params', params);
        
        count.value += Number(params.step)
        return { content: [{ type: 'text', text: '自增成功：' + count.value }] }
      }
    )

  // Connect the transport
  await server.connect(new TabServerTransport({ allowedOrigins: ["*"] })); // Adjust origins for security
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
  Counter:
  <button type="button" @click="count++">count is {{ count }}</button>
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
