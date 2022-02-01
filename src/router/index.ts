import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ViewTicketDetail from '@/views/ViewTicketDetail.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/question/:ticketID',
    name: 'Ticket Details',
    component: ViewTicketDetail,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
