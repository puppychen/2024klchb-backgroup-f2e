<template>
  <HeaderComponent v-if="!isLoginPage" />
  <div class="main-container" id="container">
    <Sidebar v-if="!isLoginPage" />
    <router-view />
  </div>
  <Footer v-if="!isLoginPage" />
</template>

<script>
import HeaderComponent from './components/layout/Header.vue';
import Sidebar from './components/layout/Sidebar.vue';
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

export default {
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    HeaderComponent,
    Sidebar,
    // eslint-disable-next-line vue/no-reserved-component-names
  },
  setup() {
    const route = useRoute();
    const isLoginPage = ref(route.path === '/login');

    watch(route, (newRoute) => {
      isLoginPage.value = newRoute.path === '/login';
    });

    return {
      isLoginPage,
    };
  }
};
</script>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 保證 Loading 層在最上層 */
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
