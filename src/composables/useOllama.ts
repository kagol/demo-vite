import { ref } from 'vue'
import ollama from 'ollama' // 如不用 SDK，可删除此行

export function useOllama() {
  const messages = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // 配置（可根据需要改为 props 或环境变量）
  const OLLAMA_BASE_URL = 'http://localhost:11434'
  const MODEL = 'deepseek-r1:7b' // 'llama3.1' // 或 'qwen2.5:7b' 等你已下载的模型

  // 非流式调用（简单问答）
  const chat = async (userMessage) => {
    isLoading.value = true
    error.value = null
    
    // 添加用户消息到历史
    messages.value.push({ role: 'user', content: userMessage })
    
    try {
      // 方案 A：使用 ollama-js SDK
      const response = await ollama.chat({
        model: MODEL,
        messages: messages.value,
        stream: false
      })
      
      const assistantMessage = response.message.content
      messages.value.push({ role: 'assistant', content: assistantMessage })
      
      return assistantMessage
      
    } catch (err) {
      error.value = err.message
      console.error('Ollama 调用失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 流式调用（打字机效果，推荐）
  const chatStream = async (userMessage, onChunk) => {
    console.log('chatStream start');
    
    isLoading.value = true
    error.value = null
    
    messages.value.push({ role: 'user', content: userMessage })
    
    // 创建一个空的助手消息占位（用于流式更新）
    const assistantMsg = { role: 'assistant', content: '' }
    messages.value.push(assistantMsg)
    
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          messages: messages.value.slice(0, -1), // 排除空的 assistant 消息
          stream: true
        })
      })
      console.log('response===', response);

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const reader = response.body.getReader()
      console.log('reader===', reader);
      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        // Uint8Array(144) [123, 34, 109, 111, 100, 101, 108, 34, 58, 34, 100, 101, 101, 112, 115, 101, 101, 107, 45, 114, 49, 58, 55, 98, 34, 44, 34, 99, 114, 101, 97, 116, 101, 100, 95, 97, 116, 34, 58, 34, 50, 48, 50, 54, 45, 48, 50, 45, 48, 53, 84, 49, 53, 58, 49, 52, 58, 53, 52, 46, 56, 50, 50, 51, 56, 51, 90, 34, 44, 34, 109, 101, 115, 115, 97, 103, 101, 34, 58, 123, 34, 114, 111, 108, 101, 34, 58, 34, 97, 115, 115, 105, 115, 116, 97, 110, 116, 34, 44, 34, …][0 … 99][100 … 143]buffer: ArrayBuffer(144)byteLength: 144byteOffset: 0length: 144Symbol(Symbol.toStringTag): "Uint8Array"[[Prototype]]: TypedArray
        console.log('done, value===', done, value);
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())
        console.log('chunk===', chunk);
        console.log('lines===', lines);
        
        for (const line of lines) {
          console.log('line===', line);
          try {
            const data = JSON.parse(line)
            console.log('data===', data, data.message?.content);
            if (data.message?.content) {
              assistantMsg.content += data.message.content
              // 触发 Vue 响应式更新
              messages.value = [...messages.value]
              // 外部回调（用于自动滚动等）
              if (onChunk) onChunk(data.message.content)
            }
          } catch (e) {
            console.error('解析流数据失败:', line)
          }
        }
      }
      console.log('chatStream end');
    } catch (err) {
      error.value = err.message
      // 移除失败的助手消息
      messages.value.pop()
    } finally {
      isLoading.value = false
    }
  }

  // 清空对话
  const clearHistory = () => {
    messages.value = []
  }

  return {
    messages,
    isLoading,
    error,
    chat,
    chatStream,
    clearHistory
  }
}
