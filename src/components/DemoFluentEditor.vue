<template>
  <tiny-fluent-editor v-model="value" :data-type="false" :data-upgrade="false"></tiny-fluent-editor>
  <div>
    内容：<br />
    {{ value }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TinyFluentEditor } from '@opentiny/vue'

const value = ref('<p>Hello <strong>FluentEditor</strong>!</p>')
</script>
