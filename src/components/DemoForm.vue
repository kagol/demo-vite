<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TinyButton, TinyInput, Modal } from '@opentiny/vue'

const emailValue = ref('')
const submitButton = ref(null)

const submit = () => {
  if (emailValue.value) {
    Modal.alert(`提交的邮箱是: ${emailValue.value}`)
  } else {
    Modal.alert('请输入邮箱')
  }
}

const submitMethod = () => {
  emailValue.value = 'kagol@sina.com'
  console.log('submitButton.value', submitButton.value);
  
  submitButton.value.$el.click()
}

onMounted(() => {
  window.submitMethod = submitMethod
})
</script>

<template>
  <div style="width: 300px;">
    <tiny-input v-model="emailValue" placeholder="请输入邮箱" style="margin-bottom: 12px;">
    </tiny-input>
    <tiny-button ref="submitButton" type="primary" @click="submit">提交</tiny-button>
  </div>
</template>