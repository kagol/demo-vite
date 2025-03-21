// eslint-disable-next-line import/no-unresolved
import { Ollama } from "ollama/browser";
import { XStream } from "ant-design-x-vue";
import { OLLAMA_MODEL,DEV_STREAM } from "./constants";

export const ollamaChat = async ({
  message,
  onUpdate,
  onSuccess,
  agentRequestLoading,
}) => {
  // 发起对话
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of XStream({
    readableStream: mockReadableStream({
      message,
      onUpdate,
      onSuccess,
      agentRequestLoading,
    }),
    // eslint-disable-next-line no-empty
  })) {
  }
};

function mockReadableStream({
  message,
  onUpdate,
  onSuccess,
  agentRequestLoading,
}) {
  const ollama = new Ollama({ host: "http://localhost:11434" });

  return new ReadableStream({
    async start(controller) {
      // eslint-disable-next-line no-restricted-syntax
      const response = await ollama.generate({
        model: OLLAMA_MODEL,
        prompt: message,
        stream: true, // 流式调用
      });
      // eslint-disable-next-line no-shadow
      let content = "";
      // eslint-disable-next-line no-restricted-syntax
      for await (const chunk of response) {
        // eslint-disable-next-line no-await-in-loop
        content += chunk.response;
        onUpdate(content);
        DEV_STREAM &&  console.log("ollama stream update...", content);
        controller.enqueue(new TextEncoder().encode(JSON.stringify(chunk)));
        if (!agentRequestLoading.value) {
          break;
        }
      }
      onSuccess(content);
      DEV_STREAM &&  console.log("ollama stream success...", content);
      controller.close();
    },
  });
}


 