<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <!-- BREADCRUMB -->
        <div class="page-meta">
          <nav class="breadcrumb-style-one" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">諮詢記錄管理</a></li>
              <li class="breadcrumb-item active" aria-current="page">關聯記錄</li>
            </ol>
          </nav>
        </div>
        <!-- /BREADCRUMB -->

        <div class="row layout-top-spacing">
          <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
            <div class="widget-content widget-content-area br-8">
              <!-- Stats -->
              <div class="d-flex justify-content-between align-items-center mb-3 px-3 pt-3">
                <div>
                  <span class="badge badge-light-primary me-2">全部 {{ logs.length }}</span>
                  <span class="badge badge-light-success me-2">新增 {{ newCount }}</span>
                  <span class="badge badge-light-warning me-2">覆寫 {{ overwriteCount }}</span>
                </div>
              </div>

              <!-- Search + Filter -->
              <div class="d-flex gap-2 px-3 mb-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="搜尋 LINE ID、使用者、機構名稱..."
                  v-model="searchQuery"
                  style="max-width: 400px;"
                >
                <select class="form-select" v-model="actionFilter" style="max-width: 150px;">
                  <option value="">全部動作</option>
                  <option value="new">新增</option>
                  <option value="overwrite">覆寫</option>
                </select>
              </div>

              <div v-if="loading" class="loading-indicator px-3 pb-3">
                Loading...
              </div>

              <!-- Table -->
              <div v-else class="table-responsive">
                <table class="table dt-table-hover" style="width:100%">
                  <thead>
                    <tr>
                      <th>時間</th>
                      <th>LINE ID</th>
                      <th>使用者名稱</th>
                      <th>動作</th>
                      <th>新關聯機構</th>
                      <th>舊關聯機構</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in paginatedItems" :key="log.uuid">
                      <td>{{ formatDate(log.createdAt) }}</td>
                      <td><code>{{ log.lineId }}</code></td>
                      <td>{{ log.userName || '-' }}</td>
                      <td>
                        <span v-if="log.action === 'new'" class="badge badge-light-success">新增</span>
                        <span v-else-if="log.action === 'overwrite'" class="badge badge-light-warning">覆寫</span>
                        <span v-else class="badge badge-light-secondary">{{ log.action }}</span>
                      </td>
                      <td>
                        {{ log.newSourceName }}
                        <small class="text-muted">({{ log.newKeyword }})</small>
                      </td>
                      <td>
                        <template v-if="log.oldSourceName">
                          {{ log.oldSourceName }}
                          <small class="text-muted">({{ log.oldKeyword }})</small>
                        </template>
                        <template v-else>-</template>
                      </td>
                    </tr>
                    <tr v-if="filteredItems.length === 0">
                      <td colspan="6" class="text-center text-muted py-4">無符合條件的記錄</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="pagination-controls" v-if="totalPages > 1">
                <button
                  class="btn btn-outline-dark btn-rounded waves-effect waves-light"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >上一頁</button>
                <span>第 {{ currentPage }} / {{ totalPages }} 頁（共 {{ filteredItems.length }} 筆）</span>
                <button
                  class="btn btn-outline-dark btn-rounded waves-effect waves-light"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >下一頁</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { format } from 'date-fns'
import { SourceKeywordLogApi } from '@/services/api'
import type { SourceKeywordLog } from '@/services/types'

export default defineComponent({
  name: 'SourceLogListView',
  data() {
    return {
      logs: [] as SourceKeywordLog[],
      loading: false,
      searchQuery: '',
      actionFilter: '',
      currentPage: 1,
      itemsPerPage: 50,
    }
  },
  computed: {
    newCount(): number {
      return this.logs.filter(l => l.action === 'new').length
    },
    overwriteCount(): number {
      return this.logs.filter(l => l.action === 'overwrite').length
    },
    filteredItems(): SourceKeywordLog[] {
      let items = this.logs

      if (this.actionFilter) {
        items = items.filter(l => l.action === this.actionFilter)
      }

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        items = items.filter(l =>
          (l.lineId || '').toLowerCase().includes(q) ||
          (l.userName || '').toLowerCase().includes(q) ||
          (l.newKeyword || '').toLowerCase().includes(q) ||
          (l.newSourceName || '').toLowerCase().includes(q) ||
          (l.oldKeyword || '').toLowerCase().includes(q) ||
          (l.oldSourceName || '').toLowerCase().includes(q)
        )
      }

      return items
    },
    totalPages(): number {
      return Math.max(1, Math.ceil(this.filteredItems.length / this.itemsPerPage))
    },
    paginatedItems(): SourceKeywordLog[] {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredItems.slice(start, start + this.itemsPerPage)
    },
  },
  watch: {
    searchQuery() { this.currentPage = 1 },
    actionFilter() { this.currentPage = 1 },
  },
  async mounted() {
    await this.fetchLogs()
  },
  methods: {
    async fetchLogs(): Promise<void> {
      this.loading = true
      try {
        const data = await SourceKeywordLogApi.getLogs()
        this.logs = data.slice().sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      } catch (error) {
        console.error('Failed to fetch source keyword logs:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateStr: string): string {
      return format(new Date(dateStr), 'yyyy/MM/dd HH:mm')
    },
  },
})
</script>
