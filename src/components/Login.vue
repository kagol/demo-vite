<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">用户登录</h2>
      <tiny-form
        ref="loginFormRef"
        :model="loginData"
        :rules="loginRules"
        label-width="0"
        @submit.prevent
      >
        <tiny-form-item prop="username">
          <tiny-input
            v-model="loginData.username"
            placeholder="请输入用户名"
            :prefix-icon="IconUser"
          ></tiny-input>
        </tiny-form-item>
        <tiny-form-item prop="password">
          <tiny-input
            v-model="loginData.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="IconLock"
            show-password
          ></tiny-input>
        </tiny-form-item>
        <tiny-form-item>
          <div class="login-options">
            <tiny-checkbox v-model="loginData.rememberMe">记住我</tiny-checkbox>
            <tiny-button type="text">忘记密码？</tiny-button>
          </div>
        </tiny-form-item>
        <tiny-form-item>
          <tiny-button
            type="primary"
            class="login-button"
            @click="handleLogin"
            :loading="loading"
          >
            登录
          </tiny-button>
        </tiny-form-item>
      </tiny-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  TinyForm,
  TinyFormItem,
  TinyInput,
  TinyButton,
  TinyCheckbox,
  TinyModal
} from '@opentiny/vue'
import { iconUser, iconLock } from '@opentiny/vue-icon'

const IconUser = iconUser()
const IconLock = iconLock()

const loginFormRef = ref()
const loading = ref(false)

const loginData = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur' }
  ]
}

const handleLogin = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      // 模拟登录请求
      setTimeout(() => {
        loading.value = false
        if (loginData.username === 'admin' && loginData.password === '123456') {
          TinyModal.message({
            message: '登录成功！欢迎回来，' + loginData.username,
            status: 'success'
          })
        } else {
          TinyModal.message({
            message: '登录失败，用户名或密码错误（提示：admin/123456）',
            status: 'error'
          })
        }
      }, 1500)
    } else {
      TinyModal.message({
        message: '请完善登录信息',
        status: 'warning'
      })
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  margin-bottom: 30px;
  text-align: center;
  color: #333;
  font-size: 24px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.login-button {
  width: 100%;
  margin-top: 10px;
}

:deep(.tiny-form-item__content) {
  margin-left: 0 !important;
}
</style>
