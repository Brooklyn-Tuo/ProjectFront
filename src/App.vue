<template>
  <div class="navbar">
    <router-link to="/activities">全部由活动列表</router-link> |
    <router-link to="/my-joined">我已报名的活动</router-link> |
    <span>角色：{{ role }}</span>
    <button v-if="role === 'admin'" @click="goAdmin">后台管理</button>
    <button @click="logout">退出登录</button>
  </div>
  <router-view />
</template>

<script>
export default {
  data() {
    return {
      role: localStorage.getItem('role') || 'user'
    }
  },
  mounted() {
    // 页面加载时读取用户信息
    this.username = localStorage.getItem('username')
    this.role = localStorage.getItem('role')
  },
  methods: {
    logout() {
      localStorage.clear()
      this.$router.push('/login')
      
      
    },
    goAdmin() {
      this.$router.push('/admin')
    }
  }
}
</script>
<style>
body {
  background-color: #f5f5f5; /* 浅灰色背景 */
  color: #333;               /* 深文字 */
  font-family: "Helvetica", "Arial", sans-serif;
  margin: 0;
  padding: 0;
}

/* 如果你之前所有容器都依赖了暗色背景，这里统一覆盖 */
.activity-container,
.detail-container,
.detail-card {
  background-color: white !important;
  color: #333 !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* 按钮样式适配浅色 */
button {
  color: white;
  background-color: #409EFF;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>

