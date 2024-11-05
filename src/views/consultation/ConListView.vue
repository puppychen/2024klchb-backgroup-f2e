<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <!-- BREADCRUMB -->
        <div class="page-meta">
          <nav class="breadcrumb-style-one" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">諮詢記錄管理</a></li>
              <li class="breadcrumb-item active" aria-current="page">諮詢列表</li>
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
                  <button type="button" class="btn btn-primary" onclick="window.location.href='/SysUserAdd'">新增使用者</button>
                </div>
              </div>

              <hr class="my-5">

              <table id="emtriage-list" class="table dt-table-hover" style="width:100%">
                <thead>
                  <tr>
                    <th>諮詢時間</th>
                    <th>Line名稱</th>
                    <th>姓名</th>
                    <th>電話</th>
                    <th>小朋友姓名</th>
                    <th>年齡</th>
                    <th>諮詢問題</th>
                    <th>功能</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in paginatedItems" :key="item.id">
                    <td>{{ item.consultationTime }}</td>
                    <td><span class="em-number">{{ item.lineName }}</span></td>
                    <td><span class="em-ages">{{ item.name }}</span></td>
                    <td><span class="em-sex">{{ item.phone }}</span></td>
                    <td><span class="em-date1">{{ item.childName }}</span></td>
                    <td><span class="em-date1">{{ item.age }}</span></td>
                    <td><span class="em-date2">{{ item.consultationQuestion }}</span></td>
                    <td>
                      <a class="badge badge-light-info text-start me-2 action-view" href="./sys-user-view.html">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="pagination-controls">
                <button class="btn btn-outline-dark btn-rounded waves-effect waves-light" @click="prevPage" :disabled="currentPage === 1">上一頁</button>
                <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
                <button class="btn btn-outline-dark btn-rounded waves-effect waves-light" @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
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
import FooterComponent from '@/components/layout/Footer.vue';
import { ref, computed } from 'vue';

export default {
  name: 'MainContentComponent',
  components: {
    FooterComponent
  },
  data() {
    return {
      items: [
        { id: 1, consultationTime: '2024-01-02', lineName: 'ooo醫院', name: '王oo', phone: 'ABCD', childName: '小朋友1', age: 5, consultationQuestion: '問題1' },
        { id: 2, consultationTime: '2024-01-02', lineName: 'ooo醫院', name: '王oo', phone: 'ABCD', childName: '小朋友2', age: 6, consultationQuestion: '問題2' },
        { id: 3, consultationTime: '2024-01-02', lineName: 'ooo醫院', name: '王oo', phone: 'ABCD', childName: '小朋友3', age: 7, consultationQuestion: '問題3' },
        // Add more items as needed
      ],
      currentPage: 1,
      itemsPerPage: 2
    };
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.items.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  margin: 0 10px;
}
</style>
