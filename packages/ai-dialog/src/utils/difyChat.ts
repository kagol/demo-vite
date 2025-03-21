import { ref } from 'vue';
import { DEV_STREAM } from './constants';
import type {
  ChunkChatCompletionResponse,
  RequestBody,
} from './difyChat.interface';
import { chatMessages } from '../api/chats';

const conversationId = ref('');
function handleResponseData(line: string) {
  let resultStr: string | undefined = '';

  if (line.startsWith('data: ')) {
    const jsonStr = line.slice(6);
    const data: ChunkChatCompletionResponse = JSON.parse(jsonStr);

    switch (data.event) {
      case 'workflow_started':
        conversationId.value = data.conversation_id;
        // console.log("工作流已启动:", data);
        break;
      case 'node_started':
        // console.log('节点已启动:', data);
        break;
      case 'node_finished':
        // console.log('节点已完成:', data);
        break;
      case 'message':
        resultStr = data.answer;
        break;
      case 'workflow_finished':
        // console.log('工作流已完成:', data);
        break;
      case 'message_end':
        // console.log('消息结束:', data);
        break;
      default:
      // console.log('未知事件:', data);
    }
  }
  return resultStr;
}

export async function difyChat({
  message,
  onUpdate,
  onSuccess,
  agentRequestLoading,
}: any) {
  const params: RequestBody = {
    inputs: {},
    query: message,
    response_mode: 'streaming',
    conversation_id: conversationId.value,
    user: 'user',
  };

  // 请求对话api
  const response = await chatMessages(params);
  if (!response.ok) {
    agentRequestLoading.value = false;
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  // 处理流式响应
  const reader = response.body?.getReader();
  let buffer = '';
  let messageLines = '';
  while (true && reader) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();
    if (done) break;

    buffer += new TextDecoder().decode(value);
    const lines = buffer.split('\n');

    // 处理每一行数据
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();

      try {
        let answer = handleResponseData(line);
        if (answer.trim()) {
          messageLines += answer;
          onUpdate(messageLines);
          DEV_STREAM && console.log('dify steaming update... ', messageLines);
        }
      } catch (error) {
        console.error('解析 JSON 数据出错:', error);
      }
    }

    // 保留最后一行不完整的数据
    buffer = lines[lines.length - 1];
  }
  onSuccess(messageLines);
  DEV_STREAM && console.log('dify steaming success... ', messageLines);
}
