<template>
  <div class="activity-container">
    <h2 class="page-title">社团活动展示</h2>
    <p class="page-subtitle">探索各社团精彩活动，找到你的兴趣所在</p>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <input
        v-model="keyword"
        @keyup.enter="changePage(0)"
        placeholder="搜索活动标题..."
      />
      <button @click="changePage(0)">搜索</button>
    </div>

    <!-- 分类 Tabs -->
    <div class="tabs-container">
      <div class="tabs-scroll">
        <div
          class="tab-item"
          :class="{ active: selectedAdmin === null }"
          @click="selectAdmin(null)"
        >全部</div>
        <div
          v-for="adminName in adminNames"
          :key="adminName"
          class="tab-item"
          :class="{ active: selectedAdmin === adminName }"
          @click="selectAdmin(adminName)"
        >{{ adminName }}</div>
      </div>
    </div>

    <!-- 活动卡片列表 -->
    <div class="activities-grid">
      <div
        v-for="activity in paginatedActivities"
        :key="activity.id"
        class="activity-card"
      >
        <h3>
          <!-- 跳转到活动详情页 -->
          <router-link :to="`/activity/${activity.id}`">
            {{ activity.title }}
          </router-link>
        </h3>
        <p class="description">{{ activity.description }}</p>
        <p><strong>时间：</strong>{{ formatTime(activity.time) }}</p>
        <p><strong>当前报名：</strong>{{ activity.currentParticipants }} / {{ activity.maxParticipants }}</p>

        <!-- 报名状态按钮 -->
        <div class="action">
          <button
            v-if="joinedActivityIds.includes(activity.id)"
            class="joined-btn"
            disabled
          >您已报名</button>
          <button
            v-else
            class="join-btn"
            @click="join(activity.id)"
          >我要报名</button>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div class="pagination">
      <button class="page-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 0">上一页</button>
      <span class="page-info">
        第 {{ currentPage + 1 }} 页 / 共 {{ totalFilteredPages }} 页
      </span>
      <button class="page-btn" @click="changePage(currentPage + 1)" :disabled="currentPage + 1 >= totalFilteredPages">下一页</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      activities: [], // 所有活动数据（来自分页搜索接口）
      groupedActivities: {}, // 所有活动（按 admin 分组）
      selectedAdmin: null, // 当前选中的社团用户名
      keyword: '', // 搜索关键词
      currentPage: 0, // 当前页码
      pageSize: 9, // 每页显示的数量
      joinedActivityIds: [], // 当前用户已报名的活动 ID 列表
      userId: localStorage.getItem('userId') // 当前用户 ID
    }
  },
  computed: {
    // 获取所有社团名（用于 tabs 展示）
    adminNames() {
      return Object.keys(this.groupedActivities);
    },
    // 根据当前所选社团和关键词过滤后的活动列表
    filteredActivities() {
      let list = this.selectedAdmin
        ? (this.groupedActivities[this.selectedAdmin] || [])
        : this.activities;

      // 关键词过滤
      if (this.keyword.trim() !== '') {
        const kw = this.keyword.toLowerCase();
        list = list.filter(item => item.title.toLowerCase().includes(kw));
      }
      return list;
    },
    // 当前页显示的活动（分页）
    paginatedActivities() {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredActivities.slice(start, end);
    },
    // 筛选后总页数
    totalFilteredPages() {
      return Math.ceil(this.filteredActivities.length / this.pageSize);
    }
  },
  mounted() {
    this.fetchActivities(); // 获取全部活动数据（分页）
    this.fetchGroupedActivities(); // 获取社团分类数据
    this.fetchJoinedIds(); // 获取用户已报名活动 ID
  },
  methods: {
    // 时间格式化
    formatTime(str) {
      return new Date(str).toLocaleString();
    },
    // 获取全部活动（用于搜索 + 默认展示）
    async fetchActivities() {
      try {
        const res = await axios.get('http://localhost:8080/api/activity/search', {
          params: {
            keyword: '',
            page: 0,
            size: 1000 // 先加载所有活动用于本地搜索 + 分类
          }
        });
        this.activities = res.data.content;
      } catch (err) {
        alert('加载全部活动失败');
        console.error(err);
      }
    },
    // 获取社团分类数据
    async fetchGroupedActivities() {
      try {
        const res = await axios.get('http://localhost:8080/api/activity/grouped');
        this.groupedActivities = res.data;
      } catch (err) {
        alert('加载社团分类失败');
        console.error(err);
      }
    },
    // 获取当前用户已报名的活动 ID 列表
    async fetchJoinedIds() {
      if (!this.userId) return;
      try {
        const res = await axios.get('http://localhost:8080/api/participant/joined-ids', {
          params: { userId: this.userId }
        });
        this.joinedActivityIds = res.data;
      } catch (err) {
        console.error('获取报名信息失败', err);
      }
    },
    // 报名活动
    async join(activityId) {
      if (!this.userId) {
        alert('请先登录');
        return;
      }
      try {
        const res = await axios.post('http://localhost:8080/api/participant/join', {
          activityId,
          userId: this.userId
        });
        alert(res.data);
        if (res.data === '报名成功') {
          this.joinedActivityIds.push(activityId);
        }
      } catch (err) {
        alert('报名失败：服务器错误');
        console.error(err);
      }
    },
    // 分页跳转
    changePage(page) {
      if (page < 0 || page >= this.totalFilteredPages) return;
      this.currentPage = page;
    },
    // 切换社团分类
    selectAdmin(adminName) {
      this.selectedAdmin = adminName;
      this.currentPage = 0; // 切换分类后回到第一页
    }
  }
}
</script>

<style scoped>
.description {
  color: #ccc;
  max-height: 4.5em; /* 限制3行高度（1.5em * 3） */
  line-height: 1.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;  /* 限制显示3行 */
  -webkit-box-orient: vertical;
}

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
}

.page-subtitle {
  font-size: 1rem;
  text-align: center;
  margin-bottom: 20px;
  color: #bbb;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #afafaf;
  border-radius: 4px;
  background-color: #70707035;
  color: #eee;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.tabs-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.tabs-scroll {
  display: flex;
  gap: 10px;
}

.tab-item {
  padding: 8px 16px;
  background-color: #4242425e;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #303030;
}

.tab-item.active {
  background-color: #67c23a;
  color: white;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.activity-card {
  border: 1px solid #67c23a;
  border-radius: 8px;
  padding: 20px;
  background-color: #48484815;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  transition: 0.3s ease;
  color: #111111;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.activity-card h3 {
   min-height: 60px; /* 根据实际内容调节 */
  margin: 0 0 10px;
  color: #4fc3f7;
}

.activity-card .description {
  color: #00000093;
}

.action {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #555;
}

.join-btn {
  background-color: #67c23a;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.joined-btn {
  background-color: #909399;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
}

.page-btn {
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
}

.page-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.page-info {
  color: #ccc;
  font-size: 0.9rem;
}
</style>
