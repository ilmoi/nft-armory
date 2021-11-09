import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ViewView from '../views/ViewView.vue';
import ViewMint from '@/views/ViewMint.vue';
import ViewUpdate from '@/views/ViewUpdate.vue';
import ViewMisc from '@/views/ViewMisc.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/view',
    name: 'View',
    component: ViewView,
  },
  {
    path: '/mint',
    name: 'Mint',
    component: ViewMint,
  },
  {
    path: '/update',
    name: 'Update',
    component: ViewUpdate,
  },
  {
    path: '/misc',
    name: 'Misc',
    component: ViewMisc,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
