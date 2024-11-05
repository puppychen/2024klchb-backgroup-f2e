import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router'; // 確保 router 可以被使用

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器，添加 JWT Token
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// 回應攔截器，處理 401 錯誤
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.clearToken();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;