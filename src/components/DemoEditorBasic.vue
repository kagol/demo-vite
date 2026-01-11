<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FluentEditor from '@opentiny/fluent-editor'

let editor: FluentEditor;
const editorRef = ref<HTMLElement>();

onMounted(() => {
  if (!editorRef.value) return;

  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
  });
  console.log('editor', editor);
  
});
</script>

<template>
  <div style="position: relative">
    <div ref="editorRef" />
  </div>
</template>
