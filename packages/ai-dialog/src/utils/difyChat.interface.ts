// 请求体相关接口
export interface RequestBody {
  query: string;
  inputs: { [key: string]: any };
  response_mode: 'streaming' | 'blocking';
  user: string;
  conversation_id?: string;
  files?: FileInfo[];
  auto_generate_name?: boolean;
}

export interface FileInfo {
  type: 'document' | 'image' | 'audio' | 'video' | 'custom';
  transfer_method: 'remote_url' | 'local_file';
  url?: string;
  upload_file_id?: string;
}

// 响应相关接口
export interface ChatCompletionResponse {
  message_id: string;
  conversation_id: string;
  mode: 'chat';
  answer: string;
  metadata: object;
  usage: Usage;
  retriever_resources: RetrieverResource[];
  created_at: number;
}

export interface Usage {
  // 这里 Usage 内部结构未详细说明，暂时用 object 表示
  [key: string]: any;
}

export interface RetrieverResource {
  // 这里 RetrieverResource 内部结构未详细说明，暂时用 object 表示
  [key: string]: any;
}

export interface ChunkChatCompletionResponse {
  event: string;
  task_id: string;
  message_id: string;
  conversation_id: string;
  answer?: string;
  id?: string;
  type?: string;
  belongs_to?: string;
  url?: string;
  metadata?: object;
  usage?: Usage;
  retriever_resources?: RetrieverResource[];
  audio?: string;
  created_at?: number;
  workflow_run_id?: string;
  data?: WorkflowOrNodeData;
  status?: string;
  error?: string;
  elapsed_time?: number;
  execution_metadata?: object;
  total_tokens?: number;
  total_price?: string;
  currency?: string;
  finished_at?: number;
  code?: string;
  message?: string;
}

export interface WorkflowOrNodeData {
  id: string;
  workflow_id?: string;
  sequence_number?: number;
  node_id?: string;
  node_type?: string;
  title?: string;
  index?: number;
  predecessor_node_id?: string;
  inputs?: object;
  process_data?: any;
  outputs?: any;
  status?: string;
  error?: string;
  elapsed_time?: number;
  execution_metadata?: object;
  total_tokens?: number;
  total_steps?: number;
  created_at?: number;
  finished_at?: number;
}
