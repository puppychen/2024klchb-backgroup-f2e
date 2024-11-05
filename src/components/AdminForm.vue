<template>
  <div>
    <div v-if="errorMessage" class="alert alert-danger mt-2" role="alert">
      {{ errorMessage }}
    </div>
    <div class="row m-3">
      <div class="col-sm-4 my-2">
        <label for="inputUsername" class="form-label">帳號</label>
        <input type="text" class="form-control" v-model="formData.username" id="inputUsername" placeholder="設定帳號ID">
      </div>
      <div class="col-sm-4 my-2">
        <label for="inputPwd1" class="form-label">密碼</label>
        <input type="password" class="form-control" v-model="formData.password" id="inputPwd1" placeholder="輸入密碼">
      </div>
      <div class="col-sm-4 my-2">
        <label for="inputPwd2" class="form-label">確認密碼</label>
        <input type="password" class="form-control" v-model="formData.confirmPassword" id="inputPwd2" placeholder="再次輸入密碼">
      </div>
    </div>
    <div class="row m-3">
      <div class="col-sm-4 my-2">
        <label for="inputName">姓名</label>
        <input type="text" class="form-control" v-model="formData.name" id="inputName" placeholder="姓名">
      </div>
      <div class="col-sm-4 my-2">
        <label for="inputEmail">Email</label>
        <input type="email" class="form-control" v-model="formData.email" id="inputEmail" placeholder="Email">
      </div>
      <div class="col-sm-4 my-2 d-flex justify-content-end align-items-end">
        <button type="button" class="btn btn-outline-dark me-2" @click="clearForm">清除</button>
        <button type="button" class="btn btn-primary" @click="submitData">{{ submitButtonText }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AdminForm',
  props: {
    formData: {
      type: Object,
      required: true
    },
    errorMessage: {
      type: String,
      default: ''
    },
    submitButtonText: {
      type: String,
      default: '提交'
    },
    onSubmit: {
      type: Function,
      required: true
    }
  },
  methods: {
    clearForm() {
      this.$emit('clear');
    },
    submitData() {
      this.onSubmit();
    }
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
