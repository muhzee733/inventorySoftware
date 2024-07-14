// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/home.vue';
import Login from '../pages/login.vue'
import { useUserStore } from '../store/useStore';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const auth = localStorage.getItem('auth')

  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.user && !auth) {
    next('/login');
  } else {
    next();
  }
});

export default router;
