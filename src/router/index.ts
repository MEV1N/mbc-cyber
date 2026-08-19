import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import InaugurationView from '../views/InaugurationView.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingView,
  },
  {
    path: '/inauguration',
    name: 'Inauguration',
    component: InaugurationView,
  },
  {
    path: '/inaugurate',
    name: 'Inaugurate',
    component: InaugurationView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
