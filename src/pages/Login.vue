<!-- src/pages/Login.vue -->
<template>
  <div class="login-container">
    <h2>欢迎登录</h2>
    <input v-model="username" placeholder="用户名" />
    <input v-model="password" type="password" placeholder="密码" />
    <button @click="login">登录</button>

    <!-- 新增：跳转注册按钮 -->
    <p class="register-link">
      还没有账号？<a @click.prevent="goToRegister" href="#">去注册</a>
    </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        // 清除旧登录信息
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        localStorage.removeItem('role')

        const res = await axios.post('http://localhost:8080/api/user/login', {
          username: this.username,
          password: this.password
        })

        const user = res.data

        if (user && user.id) {
          // 登录成功，保存用户信息
          localStorage.setItem('userId', user.id)
          localStorage.setItem('username', user.username)
          localStorage.setItem('role', user.role)

          alert('登录成功')

          // 跳转并刷新页面以加载身份状态
          this.$router.push('/activities').then(() => {
            location.reload()
          })
        } else {
          alert('用户名或密码错误')
        }
      } catch (err) {
        alert('请求失败，请检查网络或后端服务')
        console.error(err)
      }
    },

    // 跳转到注册页面
    goToRegister() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  background-color: #4082df94;
  color: #eee;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.495);
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 16px;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #333;
  color: #fff;
}
button {
  padding: 10px 20px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.register-link {
  margin-top: 20px;
  font-size: 0.9rem;
}
.register-link a {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
