import { createRouter, createWebHistory } from 'vue-router';
import Welcome from '../views/Welcome.vue';
import ClassmateManager from '../views/ClassmateManager.vue';
import Web3d from '../views/web3d.vue';
import Web from '../views/web.vue';

const routes = [
  { path: '/', component: Welcome },
  { path: '/classmates', component: ClassmateManager },
  { path: '/3d', component: Web3d },
  { path: '/d', component: Web }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
