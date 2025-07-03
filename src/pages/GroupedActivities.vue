<template>
  <div class="activity-container">
    <h2 class="page-title">社团活动展示</h2>
    <p class="page-subtitle">探索各社团精彩活动，找到你的兴趣所在</p>

    <!-- 标签栏 -->
    <div class="tabs-container">
      <div class="tabs-scroll">
        <div
          v-for="adminName in adminNames"
          :key="adminName"
          class="tab-item"
          :class="{ active: adminName === selectedAdmin }"
          @click="selectAdmin(adminName)"
        >
          <span class="tab-text">{{ adminName }}</span>
          <div class="tab-indicator"></div>
        </div>
      </div>
    </div>

    <!-- 活动列表 -->
    <div v-if="selectedAdmin" class="activities-section">
      <h3 class="section-title">
        <span class="title-icon">🎯</span>
        {{ selectedAdmin }} 活动
      </h3>
      
      <div class="activities-grid">
        <div
          v-for="activity in groupedActivities[selectedAdmin]"
          :key="activity.id"
          class="activity-card"
        >
          <div class="card-header">
            <h4 class="activity-title">{{ activity.title }}</h4>
            <div class="activity-meta">
              <span class="meta-item">
                <i class="icon">⏱️</i>
                {{ formatTime(activity.time) }}
              </span>
              <span class="meta-item">
                <i class="icon">👥</i>
                {{ activity.maxParticipants }}人
              </span>
            </div>
          </div>
          <p class="activity-desc">{{ activity.description }}</p>
          <div class="card-footer">
            <span class="tag" :style="{backgroundColor: getRandomTagColor()}">
              {{ selectedAdmin }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-activities">
      <p>暂无活动数据，请稍后再试</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      groupedActivities: {},
      selectedAdmin: null,
      tagColors: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
        '#98D8C8', '#F06292', '#7986CB', '#9575CD'
      ]
    }
  },
  computed: {
    adminNames() {
      return Object.keys(this.groupedActivities)
    },
  },
  mounted() {
    this.fetchGroupedActivities()
  },
  methods: {
    async fetchGroupedActivities() {
      try {
        const res = await axios.get('http://localhost:8080/api/activity/grouped')
        this.groupedActivities = res.data

        const keys = Object.keys(res.data)
        if (keys.length > 0) {
          this.selectedAdmin = keys[0]
        }
      } catch (err) {
        console.error('加载分类活动失败', err)
      }
    },
    selectAdmin(adminName) {
      this.selectedAdmin = adminName
    },
    formatTime(str) {
      return new Date(str).toLocaleString()
    },
    getRandomTagColor() {
      return this.tagColors[Math.floor(Math.random() * this.tagColors.length)]
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.activity-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #f2f2f2;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #94fea0;
  margin-bottom: 0.5rem;
  text-align: center;
}

.page-subtitle {
  font-size: 1rem;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 2rem;
}

/* 标签栏样式 */
.tabs-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 2rem;
}

.tabs-scroll {
  display: inline-flex;
  gap: 12px;
  padding: 0 4px;
}

.tab-item {
  position: relative;
  padding: 12px 20px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  border-radius: 8px;
  white-space: nowrap;
}

.tab-item:hover {
  background-color: #2ded56b6;
}

.tab-item.active {
  color: #2ded56b6;
}

.tab-item.active .tab-indicator {
  width: 100%;
  background-color: #2ded56b6;
}

.tab-indicator {
  position: absolute;
  bottom: -8px;
  left: 0;
  height: 3px;
  width: 0;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.tab-text {
  position: relative;
  z-index: 1;
  font-weight: 500;
}

/* 活动区域样式 */
.activities-section {
  animation: fadeIn 0.5s ease;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 1.2em;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* 活动卡片样式 */
.activity-card {
  background: rgba(255, 255, 255, 0.959);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 85%;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 12px;
}

.activity-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.activity-meta {
  display: flex;
  gap: 12px;
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon {
  font-size: 0.9em;
}

.activity-desc {
  color: #4b4b4b;
  line-height: 1.5;
  flex-grow: 1;
  margin-bottom: 16px;
  font-size: 0.95rem;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
}

.tag {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
}

.no-activities {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .activity-container {
    padding: 1rem;
  }
  
  .activities-grid {
    grid-template-columns: 1fr;
  }
}
</style>