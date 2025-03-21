import { getToken } from '../utils/auth';
import type { RequestBody } from '../utils/difyChat.interface';

export function chatMessages(data: RequestBody) {
  // axios在浏览器环境不支持 流式，需改为fetch请求
  return fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      Authorization: `Bearer ${getToken()}`,
    },
  });
}
