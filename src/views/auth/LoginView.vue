<template>
  <div class="auth-container d-flex">

    <div class="container mx-auto align-self-center">

      <div class="row">

        <div class="col-xxl-4 col-xl-5 col-lg-5 col-md-8 col-12 d-flex flex-column align-self-center mx-auto">
          <div class="card mt-3 mb-3">
            <div class="card-body">

              <div class="row">
                <form @submit.prevent="login">
                <div class="col-md-12 mb-3">

                  <h2>Sign In</h2>
                  <p>Enter your email and password to login</p>

                </div>
                <div class="col-md-12">
                  <div class="mb-3">
                    <label class="form-label">Username</label>
                    <input type="text" v-model="username" id="username" class="form-control">
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-4">
                    <label class="form-label">Password</label>
                    <input type="password" v-model="password" id="password" class="form-control">
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-4">
                    <button type="submit" class="btn btn-secondary w-100" >SIGN IN</button>
                  </div>
                </div>
              </form>

              </div>

            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/utils/axios';

const username = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  try {
    const response = await apiClient.post('/auth/login', {
      username: username.value,
      password: password.value,
    });

    if (response.data.access_token) {
      authStore.setToken(response.data.access_token);
      router.push('/'); // 導向首頁或其他目標頁面
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login error occurred');
  }
};
</script>

<style scoped>
.auth-container {
  width: 100%;
}
</style>