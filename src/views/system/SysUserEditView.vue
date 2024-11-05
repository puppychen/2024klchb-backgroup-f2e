<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <!-- BREADCRUMB -->
        <div class="page-meta">
          <nav class="breadcrumb-style-one" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">系統維護與設定</a></li>
              <li class="breadcrumb-item"><a href="#">使用者管理</a></li>
              <li class="breadcrumb-item active" aria-current="page">編輯使用者</li>
            </ol>
          </nav>
        </div>
        <!-- /BREADCRUMB -->

        <AdminForm
          :formData="formData"
          :errorMessage="errorMessage"
          submitButtonText="更新"
          @clear="clearForm"
          @submit="submitData"
        />
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import FooterComponent from '@/components/layout/Footer.vue';
import AdminForm from '@/components/AdminForm.vue';
import { ref, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import Swal from 'sweetalert2';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'SysUserEditView',
  components: {
    FooterComponent,
    AdminForm
  },
  data() {
    return {
      formData: {
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    clearForm() {
      this.formData = {
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: ''
      };
      this.errorMessage = '';
    },
    async fetchUserData() {
      const userId = this.$route.params.uuid;
      try {
        const response = await apiClient.get(`/admin/${userId}`);
        this.formData = response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        this.errorMessage = '無法獲取使用者資料';
      }
    },
    async submitData() {
      if (!this.formData.username || !this.formData.name || !this.formData.email) {
        this.errorMessage = '請輸入使用者資料';
        if (!this.formData.username) this.errorMessage += '：帳號';
        if (!this.formData.name) this.errorMessage += '、姓名';
        if (!this.formData.email) this.errorMessage += '、Email';
        return;
      }

      try {
        const userId = this.$route.params.uuid;
        const response = await apiClient.patch(`/admin/${userId}`, this.formData);
        console.log('User updated:', response.data);
        this.clearForm();
        Swal.fire({
          icon: 'success',
          title: '更新成功',
          text: '使用者資料已成功更新',
          confirmButtonText: '確定'
        }).then(() => {
          this.$router.push('/SysUserList');
        });
      } catch (error) {
        console.error('Error updating user:', error);
        this.errorMessage = '更新使用者失敗';
      }
    }
  },
  mounted() {
    this.fetchUserData();
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
