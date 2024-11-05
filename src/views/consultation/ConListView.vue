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
                    <th @click="sortBy('createdAt')">
                      諮詢時間
                      <i v-if="sortKey === 'createdAt'" :class="sortOrder === 1 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i>
                    </th>
                    <th @click="sortBy('lineName')">
                      Line名稱
                      <i v-if="sortKey === 'lineName'" :class="sortOrder === 1 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i>
                    </th>
                    <th>姓名</th>
                    <th>電話</th>
                    <th>小朋友姓名</th>
                    <th>年齡</th>
                    <th @click="sortBy('content')">
                      諮詢問題
                      <i v-if="sortKey === 'content'" :class="sortOrder === 1 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i>
                    </th>
                    <th>功能</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in paginatedItems" :key="item.uuid">
                    <td>{{ formatDate(item.createdAt) }}</td>
                    <td><span class="em-number">{{ item.lineName }}</span></td>
                    <td><span class="em-ages">{{ item.name }}</span></td>
                    <td><span class="em-sex">{{ item.phone }}</span></td>
                    <td><span class="em-date1">{{ item.childName }}</span></td>
                    <td><span class="em-date1">{{ item.yearSelected }}</span></td>
                    <td><span class="em-date2">{{ item.topicSelected }}</span></td>
                    <td>
                      <a class="badge badge-light-info text-start me-2 action-view" @click="openModal(item)">
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

    <!-- Modal -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>詳細內容</h2>
        <p><strong>諮詢時間:</strong> {{ formatDate(selectedItem?.createdAt || '') }}</p>
        <p><strong>Line名稱:</strong> {{ selectedItem?.lineName }}</p>
        <p><strong>姓名:</strong> {{ selectedItem?.name }}</p>
        <p><strong>電話:</strong> {{ selectedItem?.phone }}</p>
        <p><strong>地址:</strong> {{ selectedItem?.address }}</p>
        <p><strong>小朋友姓名:</strong> {{ selectedItem?.childName }}</p>
        <p><strong>年齡:</strong> {{ selectedItem?.yearSelected }}</p>
        <p><strong>諮詢問題:</strong> {{ selectedItem?.topicSelected }}</p>
        <p><strong>詳細內容:</strong> {{ selectedItem?.content }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FooterComponent from '@/components/layout/Footer.vue';
import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import { format } from 'date-fns';

interface ConsultationItem {
  uuid: string;
  userId: number;
  lineName: string;
  name: string;
  phone: string;
  address: string;
  childName: string;
  yearSelected: string;
  weight: number | null;
  primaryMedical: string;
  topicSelected: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

type ConsultationItemKey = keyof ConsultationItem;

export default {
  name: 'MainContentComponent',
  components: {
    FooterComponent
  },
  data() {
    return {
      items: [] as ConsultationItem[],
      currentPage: 1,
      itemsPerPage: 10,
      loading: false,
      sortKey: '' as ConsultationItemKey,
      sortOrder: 1,
      searchQuery: '',
      showModal: false,
      selectedItem: null as ConsultationItem | null
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
    sortedItems() {
      return this.items.slice().sort((a, b) => {
        let result = 0;
        const aValue = a[this.sortKey as keyof ConsultationItem];
        const bValue = b[this.sortKey as keyof ConsultationItem];
        if (aValue && bValue) {
          if (aValue < bValue) {
            result = -1;
          } else if (aValue > bValue) {
            result = 1;
          }
        }
        return result * this.sortOrder;
      });
    },
    filteredItems() {
      return this.sortedItems.filter(item => {
        const query = this.searchQuery.toLowerCase();
        return (
          item.lineName.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.phone.toLowerCase().includes(query) ||
          item.yearSelected.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
        );
      });
    }
  },
  methods: {
    async fetchConsultationData() {
      this.loading = true;
      try {
        const response = await apiClient.get('/consultation');
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching consultation data:', error);
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
    sortBy(key: ConsultationItemKey) {
      if (this.sortKey === key) {
        this.sortOrder *= -1;
      } else {
        this.sortKey = key;
        this.sortOrder = 1;
      }
    },
    openModal(item: ConsultationItem) {
      this.selectedItem = item;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedItem = null;
    },
    search() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchConsultationData();
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

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5em;
  cursor: pointer;
}
</style>
