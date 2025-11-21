<script setup lang="ts">
import type { Range } from '@opentiny/fluent-editor'
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
  ['file', 'image', 'video'],
  [{ 'table-up': [] }],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-table-up'),
  ]).then(
    ([
      { default: FluentEditor, generateTableUp },
      { defaultCustomSelect, TableMenuContextmenu, TableSelection, TableUp },
    ]) => {
      if (!editorRef.value) {
        return
      }

      FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)

      const Delta = FluentEditor.import('delta')
      editor = new FluentEditor(editorRef.value, {
        theme: 'snow',
        modules: {
          'toolbar': TOOLBAR_CONFIG,
          'uploader': {
            // only allow image
            mimetypes: ['image/*'],
            handler(range: Range, files: File[]) {
              const result = files.map((_, i) => i % 2 === 0 ? 'https://developer.mozilla.org/static/media/chrome.5e791c51c323fbb93c31.svg' : false)

              console.log('result', result);
              
              return result
            },
            fail(file: File, range: Range) {
              console.log('fail', file, range);
              this.quill.updateContents(new Delta().retain(range.index).delete(1).insert({ image: 'https://developer.mozilla.org/static/media/edge.741dffaf92fcae238b84.svg' }))
            },
            success(file, range) {
              console.log('success', file, range)
            },
          },
          'table-up': {
            customSelect: defaultCustomSelect,
            selection: TableSelection,
            selectionOptions: {
              tableMenu: TableMenuContextmenu,
            },
          },
        },
      })
    },
  )
})
</script>

<template>
  <div ref="editorRef" />
</template>
