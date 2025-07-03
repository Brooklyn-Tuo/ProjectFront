<template>
  <div class="container">
    <h2>后台管理</h2>
    
    <!-- 添加活动按钮 -->
    <button class="add-btn" @click="showForm = !showForm">
      {{ showForm ? '取消添加' : '添加新活动' }}
    </button>
    
    <!-- 添加活动表单 -->
    <div v-if="showForm" class="form">
      <h3>添加新活动</h3>
      <input v-model="newActivity.title" placeholder="活动标题" />
      <textarea v-model="newActivity.description" placeholder="活动描述"></textarea>
      <input v-model="newActivity.time" type="datetime-local" />
      <input v-model="newActivity.maxParticipants" type="number" placeholder="人数上限" />
      <button class="submit-btn" @click="addActivity">发布活动</button>
    </div>
    
    <hr />
    
    <!-- 活动列表 -->
    <div
      v-for="activity in activities"
      :key="activity.id"
      class="activity-card"
    >
      <h3>{{ activity.title }}</h3>
      <p>{{ activity.description }}</p>
      <p><strong>时间：</strong>{{ formatTime(activity.time) }}</p>
      <p><strong>发布者ID：</strong>{{ activity.createdBy }}</p>
      <button class="delete-btn" @click="deleteActivity(activity.id)">
        删除活动
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      activities: [],
      showForm: false,
      newActivity: {
        title: '',
        description: '',
        time: '',
        maxParticipants: ''
      },
      userId: localStorage.getItem('userId') || null
    };
  },
  async mounted() {
    await this.fetchMyCreatedActivities(); // 页面加载时只查自己发布的活动
  },
  methods: {
    // 获取当前 admin 自己发布的活动
    async fetchMyCreatedActivities() {
      try {
        const res = await axios.get('http://localhost:8080/api/activity/admin/created', {
          params: { userId: this.userId }
        });
        this.activities = res.data;
      } catch (err) {
        alert('加载失败');
        console.error(err);
      }
    },

    // 删除活动
    async deleteActivity(id) {
      if (!confirm('确定要删除该活动吗？')) return;

      try {
        const res = await axios.delete(`http://localhost:8080/api/activity/delete/${id}`);
        alert(res.data);
        await this.fetchMyCreatedActivities(); // 删除后重新加载
      } catch (err) {
        alert('删除失败');
        console.error(err);
      }
    },

    // 时间格式化
    formatTime(str) {
      return new Date(str).toLocaleString();
    },

    // 添加活动
    async addActivity() {
      const { title, description, time, maxParticipants } = this.newActivity;

      if (!title || !description || !time || !maxParticipants) {
        alert('请填写完整信息');
        return;
      }

      try {
        const res = await axios.post('http://localhost:8080/api/activity/create', {
          ...this.newActivity,
          maxParticipants: parseInt(maxParticipants),
          createdBy: parseInt(this.userId)
        });

        alert(res.data);
        this.showForm = false;
        this.newActivity = {
          title: '',
          description: '',
          time: '',
          maxParticipants: ''
        };
        await this.fetchMyCreatedActivities(); // 添加后重新加载
      } catch (err) {
        alert('添加失败，请检查输入或后端服务');
        console.error(err);
      }
    }
  }
};
</script>


<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

.activity-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 6px;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.submit-btn {
  background-color: #67c23a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 10px;
}

.form input,
.form textarea {
  display: block;
  margin: 10px 0;
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>