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
              <li class="breadcrumb-item active" aria-current="page">新增使用者</li>
            </ol>
          </nav>
        </div>
        <!-- /BREADCRUMB -->

        <AdminForm
          :formData="formData"
          :errorMessage="errorMessage"
          submitButtonText="新增"
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
import { ref } from 'vue';
import apiClient from '@/utils/axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

export default {
  name: 'SysUserAddView',
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
    async submitData() {
      if (!this.formData.username || !this.formData.name || !this.formData.email) {
        this.errorMessage = '請輸入使用者資料';
        if (!this.formData.username) this.errorMessage += '：帳號';
        if (!this.formData.name) this.errorMessage += '、姓名';
        if (!this.formData.email) this.errorMessage += '、Email';
        return;
      }

      try {
        const response = await apiClient.post('/admin', this.formData);
        console.log('User added:', response.data);
        this.clearForm();
        Swal.fire({
          icon: 'success',
          title: '新增成功',
          text: '使用者已成功新增',
          confirmButtonText: '確定'
        }).then(() => {
          this.$router.push('/SysUserList');
        });
      } catch (error) {
        console.error('Error adding user:', error);
        this.errorMessage = '新增使用者失敗';
      }
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
