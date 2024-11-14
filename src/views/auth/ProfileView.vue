<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <div class="page-meta">
          <nav class="breadcrumb-style-one" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">使用者</a></li>
              <li class="breadcrumb-item active" aria-current="page">個人資料設定</li>
            </ol>
          </nav>
        </div>
        <div v-if="errorMessage" class="alert alert-danger mt-2" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success mt-2" role="alert">
          {{ successMessage }}
        </div>
        <div class="row" id="cancel-row">
          <div class="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
            <div class="widget-content widget-content-area br-8">
              <div class="col-xl-12 col-lg-12 col-md-12 layout-spacing">
                <form class="section general-info" @submit.prevent="updateProfile">
                  <div class="info">
                    <h6 class="">個人資料編輯</h6>
                    <div class="row">
                      <div class="col-lg-11 mx-auto">
                        <div class="row">
                          <div class="col-xl-2 col-lg-12 col-md-4">
                            <div class="profile-image mt-4 pe-md-4">
                              登入帳號: {{ profile.username }}
                            </div>
                          </div>
                          <div class="col-xl-10 col-lg-12 col-md-8 mt-md-0 mt-4">
                            <div class="form">
                              <div class="row">
                                <div class="col-md-6 my-2">
                                  <label>Email</label>
                                  <input type="text" class="form-control" v-model="profile.email" placeholder="E-mail">
                                </div>
                                <div class="col-md-6 my-2">
                                  <label for="inputName">姓名</label>
                                  <input type="text" class="form-control" v-model="profile.name" placeholder="姓名">
                                </div>
                                <div class="col-md-6 my-2">
                                  <label for="inputPwd1" class="form-label">變更密碼</label>
                                  <input type="password" class="form-control" v-model="password" placeholder="輸入欲修改的密碼">
                                </div>
                                <div class="col-md-6 my-2">
                                  <label for="inputPwd2" class="form-label">確認密碼</label>
                                  <input type="password" class="form-control" v-model="confirmPassword" placeholder="再次輸入密碼">
                                </div>
                                <div class="col-md-12 my-2">
                                  <div class="form-group text-end">
                                    <button type="submit" class="btn btn-secondary">存檔</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import FooterComponent from '@/components/layout/Footer.vue';
import apiClient from '@/utils/axios';
import Swal from 'sweetalert2';

export default defineComponent({
  name: 'ProfileView',
  components: {
    FooterComponent
  },
  setup() {
    const profile = ref({
      username: '',
      email: '',
      name: ''
    });
    const password = ref('');
    const confirmPassword = ref('');
    const loading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    const fetchProfileData = async () => {
      loading.value = true;
      try {
        const response = await apiClient.get('/auth/profile');
        profile.value = response.data;
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        loading.value = false;
      }
    };

    const updateProfile = async () => {
      if (password.value && password.value !== confirmPassword.value) {
        errorMessage.value = '密碼不一致';
        return;
      }

      loading.value = true;
      try {
        const updateData = {
          email: profile.value.email,
          name: profile.value.name,
          ...(password.value && { password: password.value, confirmPassword: confirmPassword.value })
        };
        await apiClient.patch('/auth/profile', updateData);
        Swal.fire('成功', '資料更新完成', 'success');
        successMessage.value = '資料更新完成';
        errorMessage.value = '';
      } catch (error) {
        console.error('Error updating profile data:', error);
        errorMessage.value = '資料更新失敗';
        successMessage.value = '';
      } finally {
        loading.value = false;
      }
    };

    const cancel = () => {
      fetchProfileData();
    };

    onMounted(() => {
      fetchProfileData();
    });

    return {
      profile,
      password,
      confirmPassword,
      updateProfile,
      cancel,
      loading,
      errorMessage,
      successMessage
    };
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
