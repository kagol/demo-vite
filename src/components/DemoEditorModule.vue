<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FluentEditor, { CollaborationModule, generateTableUp } from '@opentiny/fluent-editor'

let editor: FluentEditor;
const editorRef = ref<HTMLElement>();

import { defaultCustomSelect, TableMenuSelect, TableSelection, TableUp } from 'quill-table-up'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

import katex from 'katex'
import 'katex/dist/katex.min.css'
window.katex = katex

// 可编辑公式
import 'mathlive'
import 'mathlive/static.css'
import 'mathlive/fonts.css'

// 协同编辑
import * as Y from 'yjs'
import { Awareness } from 'y-protocols/awareness'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import QuillCursors from 'quill-cursors'

FluentEditor.register(
  'modules/collaborative-editing',
  CollaborationModule,
  true,
)

FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)

onMounted(() => {
  if (!editorRef.value) return;

 editor = new FluentEditor(editorRef.value, {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['formula'],
      ['code-block'],
      ['table-up'],
      ['clean']
    ],
    'collaborative-editing': {
        deps: {
          Y,
          Awareness,
          QuillBinding,
          QuillCursors,
          WebsocketProvider,
          IndexeddbPersistence,
        },
        provider: {
          type: 'websocket',
          options: {
            serverUrl: 'wss://ai.opentiny.design/tiny-editor/',
            roomName: 'tiny-editor-document-demo-roomName',
          },
        },
        awareness: {
          state: {
            name: `userId:${Math.random().toString(36).substring(2, 15)}`,
            color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`,
          },
        },
    },
    'mathlive': true,
    'syntax': { hljs },
    'table-up': {
      customSelect: defaultCustomSelect,
      modules: [
        { module: TableSelection },
        { module: TableMenuSelect },
      ],
    },
  }
})
  console.log('editor', editor);
  
});
</script>

<template>
  <div style="position: relative">
    <div ref="editorRef" />
  </div>
</template>
