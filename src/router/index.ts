import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Get from '../views/Get.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Get',
    component: Get
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
