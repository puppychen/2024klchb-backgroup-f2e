<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <!-- BREADCRUMB -->
        <div class="page-meta">
          <nav class="breadcrumb-style-one" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">就醫資訊管理</a></li>
              <li class="breadcrumb-item active" aria-current="page">醫療機構列表</li>
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
              </div>

              <hr class="my-5">

              <div v-if="loading" class="loading-indicator">
                Loading...
              </div>

              <table v-else id="emtriage-list" class="table dt-table-hover" style="width:100%">
                <thead>
                  <tr>
                    <th class="code-column">機構代碼</th>
                    <th class="name-column">機構名稱</th>
                    <th class="type-column">機構類型</th>
                    <th class="phone-column">電話</th>
                    <th class="address-column">地址</th>
                    <th class="updated-column">更新日期</th>
                    <th class="actions-column">功能</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in paginatedItems" :key="item.id">
                    <td class="code-column">{{ item.code }}</td>
                    <td class="name-column">{{ item.name }}</td>
                    <td class="type-column">{{ item.type }}</td>
                    <td class="phone-column">{{ item.phone }}</td>
                    <td class="address-column">{{ item.address }}</td>
                    <td class="updated-column">{{ formatDate(item.updatedAt) }}</td>
                    <td class="actions-column">
                      <a class="badge badge-light-primary text-start me-2 action-edit"
                         :href="`/FacilityEdit/${item.id}`">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
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
import apiClient from '@/utils/axios';
import { format } from 'date-fns';

interface FacilityItem {
  id: number;
  code: string;
  name: string;
  type: string;
  phone: string;
  address: string;
  updatedAt: string;
}

export default {
  name: 'FacilityListView',
  components: {
    FooterComponent
  },
  data() {
    return {
      items: [] as FacilityItem[],
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
        item.type.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.address.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async fetchFacilityData() {
      this.loading = true;
      try {
        const response = await apiClient.get('/facility');
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching facility data:', error);
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
    }
  },
  mounted() {
    this.fetchFacilityData();
  }
};
</script>

<style scoped>
/* Add your styles here */
.code-column {
  width: 10%;
  word-wrap: break-word;
  word-break: break-all;
}

.name-column {
  width: 15%;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.type-column {
  width: 10%;
  word-wrap: break-word;
  word-break: break-all;
}

.phone-column {
  width: 10%;
  word-wrap: break-word;
  word-break: break-all;
}

.address-column {
  width: 20%;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.updated-column {
  width: 15%;
  word-wrap: break-word;
  word-break: break-all;
}

.actions-column {
  width: 10%;
  word-wrap: break-word;
  word-break: break-all;
}

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
