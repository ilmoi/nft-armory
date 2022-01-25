import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ViewView from '../views/ViewView.vue';
import ViewMint from '@/views/ViewMint.vue';
import ViewUpdate from '@/views/ViewUpdate.vue';
import ViewMisc from '@/views/ViewMisc.vue';
import ViewHome from '@/views/ViewHome.vue';
import ViewIWantUrNFT from '@/views/ViewIWantUrNFT.vue';
import ViewTicketDetail from '@/views/ViewTicketDetail.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: ViewHome,
  },
  {
    path: '/view',
    name: 'See Open Questions',
    component: ViewView,
  },
  {
    path: '/update',
    name: 'Answer',
    component: ViewUpdate,
  },
  {
    path: '/urnft',
    name: 'Ask Question',
    component: ViewIWantUrNFT,
  },
  {
    path: '/ticketdetail/:ticketID',
    name: 'Ticket Details',
    component: ViewTicketDetail,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
