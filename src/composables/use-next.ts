import { ref, onMounted, provide, inject } from 'vue'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { createTransportPair, createSseProxy } from '@opentiny/next'

export const useNextClient = ({ clientOptions, url }) => {
  const mcpServer = {
    transport: null,
  }
  const sessionId = ref()

  provide('mcpServer', mcpServer)

  const [ transport, clientTransport ] = createTransportPair()
  mcpServer.transport = transport

  onMounted(async () => {
    const client = new Client(clientOptions)
    await client.connect(clientTransport)

    const { sessionId: id } = await createSseProxy({
      client,
      url
    })

    sessionId.value = id
  })

  return {
    mcpServer,
    sessionId
  }
}

export const useNextServer = ({ serverOptions }) => {
  const { transport } = inject('mcpServer')
  const server = new McpServer(serverOptions)

  onMounted(async () => {
    await server.connect(transport)
  })

  return {
    server
  }
}
