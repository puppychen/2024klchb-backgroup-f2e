<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <!-- BREADCRUMB -->
        <div class="page-meta">
          <nav class="breadcrumb-style-one" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">諮詢記錄管理</a></li>
              <li class="breadcrumb-item active" aria-current="page">幼兒專則關聯資訊</li>
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
                    <input type="text" class="form-control" v-model="searchQuery" id="inputSearch" placeholder="搜尋使用者名稱、LINE ID、來源名稱">
                  </div>
                </div>
              </div>

              <hr class="my-5">

              <div v-if="loading" class="loading-indicator">
                Loading...
              </div>

              <table v-else id="source-user-list" class="table dt-table-hover" style="width:100%">
                <thead>
                  <tr>
                    <th>使用者名稱</th>
                    <th>LINE ID</th>
                    <th>來源名稱</th>
                    <th>關聯時間</th>
                    <th>加入時間</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in paginatedItems" :key="user.uuid">
                    <td>{{ user.userName || '未設定' }}</td>
                    <td>{{ user.lineId }}</td>
                    <td>{{ user.sourceName }}</td>
                    <td>{{ formatDate(user.sourceKeywordAt) }}</td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>

              <div v-if="!loading && filteredItems.length === 0" class="text-center py-4 text-muted">
                <p>暫無來源關聯資料</p>
              </div>

              <div class="pagination-controls" v-if="totalPages > 0">
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
import FooterComponent from '@/components/layout/Footer.vue'
import { format } from 'date-fns'
import { UserApi } from '@/services/api'
import type { SourceUser } from '@/services/types'

export default {
  name: 'SourceUserListView',
  components: {
    FooterComponent
  },
  data() {
    return {
      sourceUsers: [] as SourceUser[],
      loading: false,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 50,
    }
  },
  computed: {
    filteredItems(): SourceUser[] {
      if (!this.searchQuery) {
        return this.sourceUsers
      }
      const query = this.searchQuery.toLowerCase()
      return this.sourceUsers.filter((user: SourceUser) =>
        (user.userName && user.userName.toLowerCase().includes(query)) ||
        user.lineId.toLowerCase().includes(query) ||
        user.sourceName.toLowerCase().includes(query)
      )
    },
    totalPages(): number {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage)
    },
    paginatedItems(): SourceUser[] {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredItems.slice(start, end)
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    }
  },
  methods: {
    async fetchSourceUsers() {
      this.loading = true
      try {
        this.sourceUsers = await UserApi.getSourceUsers()
      } catch (error) {
        console.error('Failed to fetch source users:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString: string | null) {
      if (!dateString) return '-'
      return format(new Date(dateString), 'yyyy/MM/dd HH:mm')
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    }
  },
  mounted() {
    this.fetchSourceUsers()
  }
}
</script>

<style scoped>
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
