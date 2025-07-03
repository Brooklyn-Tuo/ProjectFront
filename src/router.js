// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import ActivityList from './pages/ActivityList.vue'
import MyActivities from './pages/MyActivities.vue' 
import MyCreatedActivities from './pages/MyCreatedActivities.vue'
import MyJoinedActivities from './pages/MyJoinedActivities.vue'
import ActivityDetail from './pages/ActivityDetail.vue'
import AdminDashboard from './pages/AdminDashboard.vue'
import GroupedActivities from './pages/GroupedActivities.vue'


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/activities', component: ActivityList },
  { path: '/my-activities',component: MyActivities },
  { path: '/my-created',component: MyCreatedActivities },
  { path: '/my-joined', component: MyJoinedActivities },
  { path: '/activity/:id', component: ActivityDetail },
  { path: '/admin', component: AdminDashboard },
  { path: '/grouped', component: GroupedActivities }


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router