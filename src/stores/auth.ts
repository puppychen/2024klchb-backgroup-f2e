import { defineStore } from 'pinia';
import { decodeToken, isTokenExpired } from '@/utils/jwt'

interface AuthState {
  token: string | null;
  name: string | null;
  role: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const token = localStorage.getItem('token');
    let name = null;
    let role = null;

    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        name = decoded.name;
        role = decoded.role;
      }
    }

    return {
      token,
      name,
      role,
    };
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);

      // 解碼並設置角色
      const decoded = decodeToken(token);
      if (decoded) {
        this.role = decoded.role;
        this.name = decoded.name;
      }
    },
    clearToken() {
      this.token = null;
      this.name = null;
      this.role = null;
      localStorage.removeItem('token');
    },
    logout() {
      this.clearToken();
    },
  },
  getters: {
    isAuthenticated: (state): boolean => !!state.token && !isTokenExpired(state.token as string),
  },
});