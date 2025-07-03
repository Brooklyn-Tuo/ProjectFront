<template>
  <div class="container">
    <h2>我报名的活动</h2>
    <div v-if="activities.length === 0">你还没有报名任何活动。</div>
    <ul>
  <li v-for="activity in activities" :key="activity.id" class="activity-card">
    <h3>{{ activity.title }}</h3>
    <p>{{ activity.description }}</p>
    <p>时间：{{ formatTime(activity.time) }}</p>
    <button @click="cancel(activity.id)">取消报名</button> <!-- 加了这一行 -->
  </li>
</ul>


  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      activities: [],
      userId: localStorage.getItem('userId')
    }
  },
  mounted() {
    this.fetchActivities()
  },
  methods: {
    async fetchActivities() {
      try {
        const res = await axios.get(`http://localhost:8080/api/participant/my-joined?userId=${this.userId}`)
        this.activities = res.data
      } catch (err) {
        alert('获取报名活动失败')
        console.error(err)
      }
    },//添加cancell方法
    async cancel(activityId) {
    try {
      const res = await axios.delete(`http://localhost:8080/api/participant/cancel`, {
        params: {
          activityId,
          userId: this.userId
        }
      })
      alert(res.data)
      // 取消成功后刷新列表
      this.fetchActivities()
    } catch (err) {
      alert('取消报名失败')
      console.error(err)
    }
  },
    formatTime(timeStr) {
      return new Date(timeStr).toLocaleString()
    }
  }
}




</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.activity-card {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
}
</style>
