import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ViewGet from '../views/ViewGet.vue';
import ViewMint from '@/views/ViewMint.vue';
import ViewUpdate from '@/views/ViewUpdate.vue';
import ViewMisc from '@/views/ViewMisc.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Get',
    component: ViewGet,
  },
  {
    path: '/',
    name: 'Mint',
    component: ViewMint,
  },
  {
    path: '/',
    name: 'Update',
    component: ViewUpdate,
  },
  {
    path: '/',
    name: 'Misc',
    component: ViewMisc,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
