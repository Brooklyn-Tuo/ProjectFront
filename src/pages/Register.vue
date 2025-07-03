<!-- src/pages/Register.vue -->
<template>
  <div>
    <h2>注册</h2>
    <input v-model="username" placeholder="用户名" />
    <input v-model="password" type="password" placeholder="密码" />
    <button @click="register">注册</button>
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
    async register() {
      const res = await axios.post('http://localhost:8080/api/user/register', {
        username: this.username,
        password: this.password
      });
      alert(res.data);
    }
  }
}
</script>
