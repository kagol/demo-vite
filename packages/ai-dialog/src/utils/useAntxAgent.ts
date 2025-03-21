import { difyChat } from "./difyChat";
import { ollamaChat } from "./ollamaChat";
import { MODEL_NAME } from "./constants";
import { useXAgent, useXChat } from "ant-design-x-vue";

export function useAntxAgent(agentRequestLoading) {
  const [agent] = useXAgent({
    request: async ({ message }, { onUpdate, onSuccess }) => {
      onUpdate("");
      agentRequestLoading.value = true;
      // 发起对话
      if (MODEL_NAME === "ollama") {
        await ollamaChat({ message, onUpdate, onSuccess, agentRequestLoading });
      } else if (MODEL_NAME === "dify") {
        await difyChat({ message, onUpdate, onSuccess, agentRequestLoading, });
      }
      agentRequestLoading.value = false;
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent: agent.value,
  });

  return { onRequest, messages, setMessages };
}
