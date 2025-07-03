<template>
  <div class="activity-container">
    <h2 class="page-title">我报名的活动</h2>

    <!-- 空状态提示 -->
    <div v-if="activities.length === 0" class="empty">
      暂无已报名的活动
    </div>

    <!-- 活动卡片列表 -->
    <div
      v-for="activity in activities"
      :key="activity.id"
      class="activity-card"
    >
      <h3 class="activity-title">
        <router-link :to="`/activity/${activity.id}`">
          {{ activity.title }}
        </router-link>
      </h3>
      <p class="description">{{ activity.description }}</p>
      <p><strong>时间：</strong>{{ formatTime(activity.time) }}</p>
      <p><strong>人数上限：</strong>{{ activity.maxParticipants }}</p>

      <!-- 取消报名按钮 -->
      <div class="action">
        <button class="cancel-btn" @click="cancelJoin(activity.id)">取消报名</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      activities: [], // 存储报名的活动列表
      userId: localStorage.getItem('userId') // 当前登录用户 ID
    }
  },
  methods: {
    // 获取当前用户已报名的活动列表
    async fetchJoinedActivities() {
      try {
        const res = await axios.get('http://localhost:8080/api/activity/joined', {
          params: { userId: this.userId }
        })
        this.activities = res.data
      } catch (err) {
        alert('获取报名信息失败')
        console.error(err)
      }
    },
    // 格式化时间显示
    formatTime(str) {
      return new Date(str).toLocaleString()
    },
    // 取消报名操作
    async cancelJoin(activityId) {
      if (!confirm('确定要取消报名吗？')) return
      try {
        const res = await axios.delete('http://localhost:8080/api/participant/cancel', {
          params: {
            activityId,
            userId: this.userId
          }
        })
        alert(res.data)
        this.fetchJoinedActivities() // 重新加载活动列表
      } catch (err) {
        alert('取消报名失败')
        console.error(err)
      }
    }
  },
  mounted() {
    this.fetchJoinedActivities()
  }
}
</script>

<style scoped>
.activity-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  color: #f0f0f0;
}

.page-title {
  font-size: 2rem;
  text-align: center;
  color: #7fdbff;
  margin-bottom: 20px;
}

.activity-card {
  border: 1px solid #67c23a;
  border-radius: 8px;
  padding: 20px;
  background-color: #0000000b;
  box-shadow: 0 2px 5px rgba(0, 255, 0, 0.3);
  transition: 0.3s ease;
  color: #000000cf;
  margin-bottom: 20px;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(39, 138, 49, 0.5);
}

.activity-title {
  margin: 0 0 10px;
  color: #4fc3f7;
}

.description {
  color: #00000089;
  margin-bottom: 10px;
}

.action {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #555;
}

.cancel-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #d9363e;
}

.empty {
  text-align: center;
  color: #ccc;
  margin-top: 40px;
}
</style>
