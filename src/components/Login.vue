<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">登录</h1>
      <tiny-form label-width="80px" :model="loginForm" ref="loginFormRef">
        <tiny-form-item label="用户名">
          <tiny-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            clearable>
          </tiny-input>
        </tiny-form-item>
        <tiny-form-item label="密码">
          <tiny-input 
            v-model="loginForm.password" 
            type="password"
            placeholder="请输入密码"
            show-password>
          </tiny-input>
        </tiny-form-item>
        <tiny-form-item label="记住我">
          <tiny-checkbox v-model="loginForm.rememberMe">记住我</tiny-checkbox>
        </tiny-form-item>
        <tiny-form-item>
          <tiny-button type="primary" @click="handleLogin" style="width: 100%">
            登录
          </tiny-button>
        </tiny-form-item>
        <div class="login-footer">
          <tiny-link href="#" @click="handleForgot">忘记密码？</tiny-link>
          <span> | </span>
          <tiny-link href="#" @click="handleRegister">立即注册</tiny-link>
        </div>
      </tiny-form>
    </div>
  </div>
</template>

<script>
import { TinyForm, TinyFormItem, TinyInput, TinyButton, TinyCheckbox, TinyLink } from '@opentiny/vue'

export default {
  name: 'Login',
  components: {
    TinyForm,
    TinyFormItem,
    TinyInput,
    TinyButton,
    TinyCheckbox,
    TinyLink
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      }
    }
  },
  methods: {
    handleLogin() {
      if (!this.loginForm.username) {
        alert('请输入用户名')
        return
      }
      if (!this.loginForm.password) {
        alert('请输入密码')
        return
      }
      alert(`登录成功！用户名：${this.loginForm.username}${this.loginForm.rememberMe ? '（已记住）' : ''}`)
      // 这里可以调用登录接口
    },
    handleForgot(e) {
      e.preventDefault()
      alert('忘记密码功能')
    },
    handleRegister(e) {
      e.preventDefault()
      alert('立即注册功能')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin: 0 0 30px 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #666;
}

.login-footer span {
  margin: 0 8px;
}
</style>
