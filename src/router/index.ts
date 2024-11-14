import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { isTokenExpired } from '../utils/jwt'

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
      path: '/Profile',
      name: 'Profile',
      component: () => import('../views/auth/ProfileView.vue'),
    },
    {
      path: '/ConList',
      name: 'ConList',
      component: () => import('../views/consultation/ConListView.vue')
    },
    {
      path: '/FacilityList',
      name: 'FacilityList',
      component: () => import('../views/facility/FacilityListView.vue')
    },
    {
      path: '/FacilityEdit/:id',
      name: 'FacilityEdit',
      component: () => import('../views/facility/FacilityEditView.vue'),
      props: true
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
    },
    {
      path: '/SysUserEdit/:uuid',
      name: 'SysUserEdit',
      component: () => import('../views/system/SysUserEditView.vue'),
      props: true
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name === 'login') {
    return next();
  }

  if ((!authStore.token || isTokenExpired(authStore.token))) {
    authStore.clearToken(); // 清除過期或無效的 token
    next({ name: 'login' }); // 導向到登入頁面
  } else {
    next();
  }
});
export default router
