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
                    <input type="text" class="form-control" v-model="searchQuery" id="inputSearch" placeholder="關鍵字搜尋">
                  </div>
                </div>
                <div class="col-sm-8 my-2 d-flex justify-content-end align-items-end">
                  <button type="button" class="btn btn-primary" onclick="window.location.href='/SysUserAdd'">新增使用者</button>
                </div>
              </div>

              <hr class="my-5">

              <div v-if="loading" class="loading-indicator">
                Loading...
              </div>

              <table v-else id="emtriage-list" class="table dt-table-hover" style="width:100%">
                <thead>
                  <tr>
                    <th>帳號</th>
                    <th>姓名</th>
                    <th>建立日期</th>
                    <th>更新日期</th>
                    <th>功能</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in paginatedItems" :key="item.uuid">
                    <td><span class="em-sex">{{ item.username }}</span></td>
                    <td><span class="em-ages">{{ item.name }}</span></td>
                    <td><span class="em-date1">{{ formatDate(item.createdAt) }}</span></td>
                    <td><span class="em-date2">{{ formatDate(item.updatedAt) }}</span></td>
                    <td>
                      <a class="badge badge-light-primary text-start me-2 action-edit" :href="`/SysUserEdit/${item.uuid}`">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </a>
                      <a class="badge badge-light-danger text-start action-delete" href="javascript:void(0);" @click="confirmDelete(item.uuid)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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
import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

interface UserItem {
  uuid: string;
  username: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default {
  name: 'SysUserListView',
  components: {
    FooterComponent
  },
  data() {
    return {
      items: [] as UserItem[],
      currentPage: 1,
      itemsPerPage: 20,
      loading: false,
      searchQuery: ''
    };
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
    filteredItems() {
      const query = this.searchQuery.toLowerCase();
      return this.items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.username.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async fetchUserData() {
      this.loading = true;
      try {
        const response = await apiClient.get('/admin');
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        this.loading = false;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    formatDate(dateString: string) {
      return format(new Date(dateString), 'yyyy/MM/dd HH:mm');
    },
    search() {
      this.currentPage = 1;
    },
    async deleteUser(uuid: string) {
      try {
        await apiClient.delete(`/admin/${uuid}`);
        this.fetchUserData();
        Swal.fire({
          icon: 'success',
          title: '刪除成功',
          text: '使用者已成功刪除',
          confirmButtonText: '確定'
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire({
          icon: 'error',
          title: '刪除失敗',
          text: '無法刪除使用者',
          confirmButtonText: '確定'
        });
      }
    },
    confirmDelete(uuid: string) {
      Swal.fire({
        title: '確認刪除',
        text: '您確定要刪除此使用者嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '是的，刪除它！',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteUser(uuid);
        }
      });
    }
  },
  mounted() {
    this.fetchUserData();
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

.loading-indicator {
  text-align: center;
  font-size: 1.5em;
  margin: 20px 0;
}
</style>
