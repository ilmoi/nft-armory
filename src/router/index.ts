import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ViewView from '../views/ViewView.vue';
import ViewMint from '@/views/ViewMint.vue';
import ViewUpdate from '@/views/ViewUpdate.vue';
import ViewMisc from '@/views/ViewMisc.vue';
import ViewHome from '@/views/ViewHome.vue';
import ViewIWantUrNFT from '@/views/ViewIWantUrNFT.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: ViewHome,
  },
  {
    path: '/view',
    name: 'View',
    component: ViewView,
  },
  {
    path: '/view/address/:address',
    name: 'ViewAddress',
    component: ViewView,
  },
  {
    path: '/view/creator/:creator',
    name: 'ViewCreator',
    component: ViewView,
  },
  {
    path: '/view/authority/:authority',
    name: 'ViewAuthority',
    component: ViewView,
  },
  {
    path: '/view/mint/:mint',
    name: 'ViewMint',
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
  {
    path: '/urnft',
    name: 'I Want Ur NFT',
    component: ViewIWantUrNFT,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
