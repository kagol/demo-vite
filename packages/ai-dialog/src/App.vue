<script setup lang="tsx">
import {
  Attachments,
  type AttachmentsProps,
  Bubble,
  type BubbleListProps,
  Prompts,
  type PromptsProps,
  Sender,
  Welcome,
} from "ant-design-x-vue";
import {
  CloudUploadOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  ReadOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import markdownit from "markdown-it";
import { Badge, Button, Space, theme, Typography } from "ant-design-vue";
import { computed, ref, type VNode, watch } from "vue";
import { useAntxAgent } from "./utils/useAntxAgent";
import { $aiWatcher } from "./utils/ai-helper";

defineOptions({ name: "PlaygroundIndependent" });

const md = markdownit({ html: true, breaks: true });

//#region 使用Ant Agent机制，访问大模型
const agentRequestLoading = ref(false); // 是否在回答问题中， 发送按钮变成动画状态
const { onRequest, messages } = useAntxAgent(agentRequestLoading);
//#endregion

//#region 样式变量
const { token } = theme.useToken();
const styles = computed(() => {
  return {
    layoutWrap: {
      width: "100%",
      height: "100%",
      "border-radius": `${token.value.borderRadius}px`,
      display: "flex",
      background: `${token.value.colorBgContainer}`,
      "font-family": `AlibabaPuHuiTi, ${token.value.fontFamily}, sans-serif`,
    },
    menu: {
      background: `${token.value.colorBgLayout}80`,
      width: "20%",
      height: "100%",
      display: "flex",
      "flex-direction": "column",
    },
    conversations: {
      padding: "0 12px",
      flex: 1,
      "overflow-y": "auto",
    },
    chatWrap: {
      height: "100%",
      width: "100%",
      "max-width": "700px",
      margin: "0 auto",
      "box-sizing": "border-box",
      display: "flex",
      "flex-direction": "column",
      padding: `${token.value.paddingLG}px`,
      "padding-top": "60px",
      "padding-bottom": "210px",
      gap: "16px",
    },
    messages: {
      flex: 1,
    },
    placeholder: {
      "padding-top": "32px",
    },
    sender: {
      "box-shadow": token.value.boxShadow,
    },
  } as const;
});
//#endregion

//#region 欢迎节点和预制的初始提示词：
// Prompts:用于显示一组与当前上下文相关的预定义的问题或建议。
// Promtps: 本质上就是antX提供的一种卡片

const renderTitle = (icon: VNode, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const welcomePromptsItems: PromptsProps["items"] = [
  {
    key: "1",
    label: renderTitle(
      <FireOutlined style={{ color: "#FF4D4F" }} />,
      "Prompt1"
    ),
    description: "you are interested in?",
    children: [{ key: "1-1", description: `What's new in X?` }],
  },
  {
    key: "2",
    label: renderTitle(
      <ReadOutlined style={{ color: "#1890FF" }} />,
      "Prompt2"
    ),
    description: "How to design?",
    children: [
      { key: "2-1", icon: <HeartOutlined />, description: `Know the well` },
    ],
  },
];

const onPromptsItemClick: PromptsProps["onItemClick"] = (info) => {
  onRequest(info.data.description as string);
};

const welcomeNode = computed(() => (
  <Space direction="vertical" size={16} style={styles.value.placeholder}>
    <Welcome
      variant="borderless"
      icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
      title="欢迎标题"
      description="欢迎的描述正文"
    />
    <Prompts
      title="预定的提问标题和几个提问"
      items={welcomePromptsItems}
      onItemClick={onPromptsItemClick}
    />
  </Space>
));
//#endregion

//#region 消息列表 Bubble.List  无消息时，显示欢迎节点。

// 消息泡的样式
const roleStyle: BubbleListProps["roles"] = {
  ai: {
    avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
    placement: "start",
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: "16px",
      },
    },
  },
  local: {
    avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
    placement: "end",
    variant: "shadow",
  },
};

const renderMarkdown = (mdStr) => {
  return (
    <Typography>
      <div v-html={md.render(mdStr)} />
    </Typography>
  );
};

const bubbleListItems = computed<BubbleListProps["items"]>(() =>
  messages.value
    .filter(({ message }) => !message.startsWith('[‍instruction‍]:')) // 过滤不显示 $aiWatch 的命令
    .map(({ id, message, status }) => ({
      key: id,
      loading: false,
      role: status === "local" ? "local" : "ai",
      content: renderMarkdown(message),
    }))
);

const bubbleListNodes = computed(() => (
  <Bubble.List
    roles={roleStyle}
    style={styles.value.messages}
    items={
      bubbleListItems.value.length
        ? bubbleListItems.value
        : [{ content: welcomeNode.value, variant: "borderless" }]
    }
  />
));
//#endregion

//#region 热点提示区，输入框上边的提示
const senderPromptsItems: PromptsProps["items"] = [
  {
    key: "1",
    description: "Hot Topics",
    icon: <FireOutlined style={{ color: "#FF4D4F" }} />,
  },
  {
    key: "2",
    description: "Design Guide",
    icon: <ReadOutlined style={{ color: "#1890FF" }} />,
  },
];
const senderPromptsNodes = computed(() => (
  <Prompts
    style={{ color: token.value.colorText }}
    items={senderPromptsItems}
    onItemClick={onPromptsItemClick}
  />
));
//#endregion

//#region 输入框 与 上传附件
const headerOpen = ref(false); // 是否展开头部上传附件
const senderContent = ref(""); // 输入框的内容
const attachedFiles = ref<AttachmentsProps["items"]>([]); // 输入框待上传的附件， 但没有预演如何传递给大模型

const attachmentButtonClick = () => (headerOpen.value = !headerOpen.value);

const handleFileChange: AttachmentsProps["onChange"] = (info) =>
  (attachedFiles.value = info.fileList);
// 询问AI
const onSubmit = (nextContent: string) => {
  if (!nextContent) return;
  onRequest(nextContent);
  senderContent.value = "";
};
// 中断询问
const onCancel = () => {
  if (agentRequestLoading.value) {
    agentRequestLoading.value = false;
  }
};

const attachmentsNode = computed(() => (
  <Badge dot={attachedFiles.value.length > 0 && !headerOpen.value}>
    <Button
      type="text"
      icon={<PaperClipOutlined />}
      onClick={attachmentButtonClick}
    />
  </Badge>
));

const senderHeader = computed(() => (
  <Sender.Header title="上传附件" open={headerOpen.value}>
    <Attachments
      beforeUpload={() => false}
      items={attachedFiles.value}
      onChange={handleFileChange}
      placeholder={(type) =>
        type === "drop"
          ? { title: "Drop file here" }
          : {
              icon: <CloudUploadOutlined />,
              title: "上传区域",
              description: "点击或拖放文件到当前区域",
            }
      }
    />
  </Sender.Header>
));

// 最终的输入框整体VNODE
const senderNodes = computed(() => (
  <Sender
    value={senderContent.value}
    style={styles.value.sender}
    header={senderHeader.value}
    prefix={attachmentsNode.value}
    loading={agentRequestLoading.value}
    onSubmit={onSubmit}
    onCancel={onCancel}
    onChange={(value) => (senderContent.value = value)}
  />
));
//#endregion

//#region aiWatcher 自动响应用户的操作
watch($aiWatcher, (options) => {
  // 模拟发送消息
  onRequest(`[‍instruction‍]: ${JSON.stringify(options)}`);
});
//#endregion
defineRender(() => {
  return (
    <div style={styles.value.layoutWrap}>
      <div style={styles.value.chatWrap}>
        {bubbleListNodes.value}
        {senderPromptsNodes.value}
        {senderNodes.value}
      </div>
    </div>
  );
});
</script>
