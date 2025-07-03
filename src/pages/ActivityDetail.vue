<template>
  <div class="detail-container">
    <div class="detail-card">
      <h2 class="title">{{ activity.title }}</h2>
      <p class="field"><strong>描述：</strong>{{ activity.description }}</p>
      <p class="field"><strong>时间：</strong>{{ formatTime(activity.time) }}</p>
      <p class="field"><strong>最多报名人数：</strong>{{ activity.maxParticipants }}</p>
      <p class="field"><strong>当前已报名人数：</strong>{{ joinedCount }}</p>

      <div class="button-group">
        <button
          v-if="hasJoined"
          class="joined-btn"
          disabled
        >
          您已报名
        </button>

        <button
          v-else
          class="join-btn"
          @click="joinActivity"
        >
          我要报名
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      activity: {}, // 当前活动信息
      joinedCount: 0, // 当前报名人数
      hasJoined: false, // 是否已报名
      userId: localStorage.getItem('userId') // 当前用户ID
    }
  },
  async mounted() {
    const activityId = this.$route.params.id
    try {
      // 获取活动详情
      const res = await axios.get(`http://localhost:8080/api/activity/${activityId}`)
      this.activity = res.data

      // 获取当前已报名人数
      const countRes = await axios.get(`http://localhost:8080/api/participant/count`, {
        params: { activityId }
      })
      this.joinedCount = countRes.data

      // 判断当前用户是否已报名
      const joinCheck = await axios.get(`http://localhost:8080/api/participant/hasJoined`, {
        params: { activityId, userId: this.userId }
      })
      this.hasJoined = joinCheck.data
    } catch (err) {
      alert('加载失败')
      console.error(err)
    }
  },
  methods: {
    formatTime(str) {
      return new Date(str).toLocaleString()
    },
    async joinActivity() {
      const activityId = this.$route.params.id
      try {
        const res = await axios.post(`http://localhost:8080/api/participant/join`, {
          activityId,
          userId: this.userId
        })
        alert(res.data)
        if (res.data === '报名成功') {
          this.hasJoined = true
          this.joinedCount++
        }
      } catch (err) {
        alert('报名失败')
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
.detail-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
  color: #f2f2f2;
}

.detail-card {
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  border-left: 5px solid #67c23a;
}

.title {
  font-size: 1.8rem;
  color: #7fdbff;
  margin-bottom: 20px;
}

.field {
  margin: 10px 0;
  font-size: 1rem;
  line-height: 1.5;
}

.button-group {
  margin-top: 30px;
}

.join-btn {
  background-color: #67c23a;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.joined-btn {
  background-color: #aaa;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: not-allowed;
}
</style>