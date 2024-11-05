<template>
  <div class="sidebar-wrapper sidebar-theme">
    <nav id="sidebar">

      <div class="navbar-nav theme-brand flex-row  text-center">
        <div class="nav-logo">
          <div class="nav-item theme-logo">
            <a href="/">
              <img src="/src/assets/img/logo.png" class="navbar-logo" alt="logo">
            </a>
          </div>
          <div class="nav-item theme-text">
            <a href="/" class="nav-link"> 親子照護平台 </a>
          </div>
        </div>
        <div class="nav-item sidebar-toggle">
          <div class="btn-toggle sidebarCollapse">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
          </div>
        </div>
      </div>

      <div class="profile-info">
        <div class="user-info">
          <div class="profile-img">
            <img src="/src/assets/img/profile-30.jpeg" alt="avatar">
          </div>
          <div class="profile-content">
            <h6 class="">{{ name }}</h6>
<!--            <p class="">職稱</p>-->
          </div>
        </div>
      </div>

      <div class="shadow-bottom"></div>
      <ul class="list-unstyled menu-categories" id="accordionExample">
        <li :class="['menu', isActive('/') ? 'active' : '']">
          <a href="/" aria-expanded="false" class="dropdown-toggle">
            <div class="">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span>首頁<small></small></span>
            </div>
          </a>
        </li>
        <li class="menu menu-heading">
          <div class="heading"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-minus"><line x1="5" y1="12"
                                                                                                x2="19"
                                                                                                y2="12"></line></svg><span>諮詢記錄管理</span></div>
        </li>
        <li :class="['menu', isActive('/EmtriageAdd') ? 'active' : '']">
          <a href="/ConList" aria-expanded="false" class="dropdown-toggle">
            <div class="">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>諮詢列表</span>
            </div>
          </a>
        </li>

        <li class="menu menu-heading">
          <div class="heading"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-minus"><line x1="5" y1="12"
                                                                                                x2="19"
                                                                                                y2="12"></line></svg><span>就醫資訊管理</span></div>
        </li>

        <li :class="['menu', isActive('/InfoEpidemic') ? 'active' : '']">
          <a href="/InfoEpidemic" aria-expanded="false" class="dropdown-toggle">
            <div class="">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-activity"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
              <span>醫療構機列表</span>
            </div>
          </a>
        </li>

        <li v-if="isAdmin" class="menu menu-heading">
          <div class="heading"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg><span>系統維護與設定</span></div>
        </li>

        <li v-if="isAdmin" :class="['menu', isActive('/SysUserList') ? 'active' : '']">
          <a href="/SysUserList" aria-expanded="false" class="dropdown-toggle">
            <div class="">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>管理者列表</span>
            </div>
          </a>
        </li>

      </ul>

    </nav>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'SidebarComponent',
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    console.log(authStore);
    const isAdmin = computed(() => authStore.role === 'admin');
    const name = computed(() => authStore.name);

    const isActive = (path) => {
      if (path === '/') {
        return route.path === path;
      } else {
        return route.path.startsWith(path);
      }
    };

    return {
      isActive,
      isAdmin,
      name,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
