<template>
  <div class="container">
    <h2 class="page-title">我发布的活动</h2>
    <p class="page-subtitle">管理你发起的精彩活动</p>

    <div v-if="activities.length === 0" class="empty-tip">
      你还没有发布任何活动。
    </div>

    <div class="activities-grid">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="activity-card"
      >
        <h3 class="activity-title">{{ activity.title }}</h3>
        <p class="activity-description">{{ activity.description }}</p>
        <p><strong>时间：</strong>{{ formatTime(activity.time) }}</p>

        <div class="action">
          <button class="delete-btn" @click="deleteActivity(activity.id)">
            删除活动
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      activities: [],
      userId: localStorage.getItem('userId')
    };
  },
  mounted() {
    this.fetchCreatedActivities();
  },
  methods: {
    // 获取当前用户创建的活动
    async fetchCreatedActivities() {
      try {
        const res = await axios.get(`http://localhost:8080/api/activity/byUserId?userId=${this.userId}`);
        this.activities = res.data;
      } catch (err) {
        alert('获取发布活动失败');
        console.error(err);
      }
    },
    // 删除指定活动
    async deleteActivity(id) {
      if (!confirm('确定要删除这个活动吗？')) return;
      try {
        const res = await axios.delete(`http://localhost:8080/api/activity/delete/${id}`);
        alert(res.data);
        this.fetchCreatedActivities(); // 删除成功后刷新活动列表
      } catch (err) {
        alert('删除失败');
        console.error(err);
      }
    },
    // 格式化时间
    formatTime(timeStr) {
      return new Date(timeStr).toLocaleString();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #f0f0f0;
}

.page-title {
  font-size: 2rem;
  text-align: center;
  color: #7fdbff;
}

.page-subtitle {
  font-size: 1rem;
  text-align: center;
  margin-bottom: 20px;
  color: #bbb;
}

.empty-tip {
  text-align: center;
  font-size: 1rem;
  color: #888;
  margin-top: 40px;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.activity-card {
  background-color: #1e1e1e;
  border: 1px solid #67c23a;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.5);
}

.activity-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #4fc3f7;
  margin-bottom: 10px;
}

.activity-description {
  font-size: 0.95rem;
  color: #ccc;
  margin-bottom: 10px;
  line-height: 1.5;
}

.action {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #555;
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c0392b;
}
</style>
