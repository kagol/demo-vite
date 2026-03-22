<script lang="ts" setup>
import Quill from 'quill';
import { onMounted } from 'vue';
import { deltaToHtml } from '../utils';
import { deltaData } from './const';


let editor: Quill

onMounted(() => {
  editor = new Quill('#editor', {
    theme: 'snow'
  });

  editor.setContents(deltaData)
});

let html: string

const printDelta = () => {
  const delta = editor.getContents();
  console.log('delta:', JSON.stringify(delta));
  html = deltaToHtml(delta)
  console.log('html:', html);
};

const printHTML = () => {
  const html = editor.root.innerHTML;
  console.log(html);
};

const setHTML = () => {
  console.log('html:===', html);
  editor.clipboard.dangerouslyPasteHTML(html);
};
</script>
<template>
  <button @click="printDelta">打印Delta</button>
  <button @click="printHTML">打印HTML</button>
  <button @click="setHTML">设置HTML</button>
  <div id="editor"></div>
</template>