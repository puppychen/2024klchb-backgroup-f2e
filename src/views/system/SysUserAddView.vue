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
        <div class="alert alert-danger mt-2" role="alert">
          請輸入使用者資料
        </div>
        <!-- /BREADCRUMB -->

        <div class="row" id="cancel-row">

          <div class="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
            <div class="widget-content widget-content-area br-8">

              <div class="row m-3">
                <div class="col-sm-4 my-2">
                  <label for="inputID" class="form-label">帳號</label>
                  <input type="text" class="form-control" id="inputID" placeholder="設定帳號ID">
                </div>
                <div class="col-sm-4 my-2">
                  <label for="inputPwd1" class="form-label">密碼</label>
                  <input type="text" class="form-control" id="inputPwd1" placeholder="輸入密碼">
                </div>
                <div class="col-sm-4 my-2">
                  <label for="inputPwd2" class="form-label">確認密碼</label>
                  <input type="text" class="form-control" id="inputPwd2" placeholder="再次輸入密碼">
                </div>
              </div>

              <div class="row m-3">
                <div class="col-sm-4 my-2">
                  <label>選擇醫療院所</label>
                  <select class="form-select" aria-label="Default select example">
                    <option selected>請選擇..</option>
                    <option value="1">台大醫院</option>
                    <option value="2">中國附醫</option>
                    <option value="3">台北榮總</option>
                  </select>
                </div>
                <div class="col-sm-4 my-2">
                  <label for="inputName">姓名</label>
                  <input type="text" class="form-control" id="inputName" placeholder="姓名">
                </div>
                <div class="col-sm-4 my-2 d-flex justify-content-end align-items-end">
                  <button type="button" class="btn btn-outline-dark me-2">清除</button>
                  <button type="button" class="btn btn-primary">新增</button>
                </div>
              </div>

              <br><br><br>

            </div>
          </div>

        </div>

      </div>

    </div>

    <FooterComponent />
  </div>
</template>

<script>
import FooterComponent from '@/components/Footer.vue';
export default {
  name: 'MainContentComponent',
  methods: {
    submitData() {
      // Handle form submission
    }
  },
  components: {
    FooterComponent
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>