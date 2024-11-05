import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        authStore.logout(); // Clear the token
        next({ name: 'login' });
      },
      redirect: { name: 'login' }
    },
    {
      path: '/ConList',
      name: 'ConList',
      component: () => import('../views/consultation/ConListView.vue')
    },
    {
      path: '/SysUserList',
      name: 'SysUserList',
      component: () => import('../views/system/SysUserListView.vue')
    },
    {
      path: '/SysUserAdd',
      name: 'SysUserAdd',
      component: () => import('../views/system/SysUserAddView.vue')
    }
  ],
})

export default router
