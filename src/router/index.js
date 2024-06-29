import { createRouter, createWebHistory } from 'vue-router';
import Welcome from '../views/Welcome.vue';
import ClassmateManager from '../views/ClassmateManager.vue';

const routes = [
  { path: '/', component: Welcome },
  { path: '/classmates', component: ClassmateManager }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
