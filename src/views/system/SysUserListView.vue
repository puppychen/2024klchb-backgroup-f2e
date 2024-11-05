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
              <li class="breadcrumb-item active" aria-current="page">使用者列表</li>
            </ol>
          </nav>
        </div>
        <!-- /BREADCRUMB -->

        <div class="row" id="cancel-row">

          <div class="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
            <div class="widget-content widget-content-area br-8">

              <div class="row m-3">
                <div class="col-sm-4 my-2">
                  <label for="inputSearch" class="form-label">關鍵字搜尋</label>
                  <div class="input-group">
                    <input type="text" class="form-control" id="inputSearch" placeholder="關鍵字搜尋">
                    <button type="button" class="btn btn-primary">查詢</button>
                  </div>
                </div>
                <div class="col-sm-8 my-2 d-flex justify-content-end align-items-end">
                  <button type="button" class="btn btn-primary" onclick="window.location.href='/SysUserAdd'">新增使用者
                  </button>
                </div>
              </div>

              <hr class="my-5">

              <table id="emtriage-list" class="table dt-table-hover" style="width:100%">
                <thead>
                <tr>
                  <th>流水號</th>
                  <th>醫屬醫療單位</th>
                  <th>姓名</th>
                  <th>帳號</th>
                  <th>建立日期</th>
                  <th>更新日期</th>
                  <th>功能</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>1</td>
                  <td><span class="em-number">ooo醫院</span></td>
                  <td><span class="em-ages">王oo</span></td>
                  <td><span class="em-sex">ABCD</span></td>
                  <td><span class="em-date1">2024-01-02</span></td>
                  <td><span class="em-date2">2024-01-02</span></td>
                  <td>
                    <a class="badge badge-light-info text-start me-2 action-view" href="./sys-user-view.html">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </a>
                    <a class="badge badge-light-primary text-start me-2 action-edit" href="./sys-user-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></a>
                    <a class="badge badge-light-danger text-start action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>
                  </td>
                </tr>

                <tr>
                  <td>1</td>
                  <td><span class="em-number">ooo醫院</span></td>
                  <td><span class="em-ages">王oo</span></td>
                  <td><span class="em-sex">ABCD</span></td>
                  <td><span class="em-date1">2024-01-02</span></td>
                  <td><span class="em-date2">2024-01-02</span></td>
                  <td>
                    <a class="badge badge-light-info text-start me-2 action-view" href="./sys-user-view.html">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </a>
                    <a class="badge badge-light-primary text-start me-2 action-edit" href="./sys-user-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></a>
                    <a class="badge badge-light-danger text-start action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>
                  </td>
                </tr>

                <tr>
                  <td>1</td>
                  <td><span class="em-number">ooo醫院</span></td>
                  <td><span class="em-ages">王oo</span></td>
                  <td><span class="em-sex">ABCD</span></td>
                  <td><span class="em-date1">2024-01-02</span></td>
                  <td><span class="em-date2">2024-01-02</span></td>
                  <td>
                    <a class="badge badge-light-info text-start me-2 action-view" href="./sys-user-view.html">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </a>
                    <a class="badge badge-light-primary text-start me-2 action-edit" href="./sys-user-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></a>
                    <a class="badge badge-light-danger text-start action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>
                  </td>
                </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>

    <FooterComponent />
  </div>
</template>

<script lang="ts">
import FooterComponent from '@/components/layout/Footer.vue';
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
