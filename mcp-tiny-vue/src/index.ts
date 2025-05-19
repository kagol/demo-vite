import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function setupMcp(options) {
  const server = new McpServer({
    name: 'mcp-server-tiny-vue',
    version: '1.0.0'
  })

  server.tool('selectOption', '选择select组件的一个选项', { value: z.string() }, async ({ value }) => {
    // 这里添加选择选项工具的具体逻辑，由于 MCP tool 的参数不支持响应式对象和组件实例对象，只能让用户实现具体的工具逻辑
    options.tools.selectOption(value)

    return { content: [{ type: 'text', text: `选择的选项是: ${value}` }] }
  })

  return server
}
