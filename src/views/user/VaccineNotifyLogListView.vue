<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <div class="page-meta">
          <nav class="breadcrumb-style-one" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">諮詢記錄管理</a></li>
              <li class="breadcrumb-item active" aria-current="page">疫苗提醒記錄</li>
            </ol>
          </nav>
        </div>

        <div class="row layout-top-spacing">
          <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
            <div class="widget-content widget-content-area br-8">
              <div class="d-flex justify-content-between align-items-center mb-3 px-3 pt-3">
                <div>
                  <span class="badge badge-light-primary me-2">全部 {{ logs.length }}</span>
                  <span class="badge badge-light-success me-2">成功 {{ sentCount }}</span>
                  <span class="badge badge-light-danger me-2">失敗 {{ failedCount }}</span>
                </div>
              </div>

              <div class="d-flex gap-2 px-3 mb-3 flex-wrap">
                <input
                  type="text"
                  class="form-control"
                  placeholder="搜尋使用者、小朋友、疫苗、訊息內容..."
                  v-model="searchQuery"
                  style="max-width: 420px;"
                >
                <select class="form-select" v-model="statusFilter" style="max-width: 150px;">
                  <option value="">全部狀態</option>
                  <option value="sent">成功</option>
                  <option value="failed">失敗</option>
                </select>
              </div>

              <div v-if="loading" class="loading-indicator px-3 pb-3">
                Loading...
              </div>

              <div v-else class="table-responsive">
                <table class="table dt-table-hover" style="width:100%">
                  <thead>
                    <tr>
                      <th>發送時間</th>
                      <th>狀態</th>
                      <th>使用者</th>
                      <th>小朋友</th>
                      <th>出生年月</th>
                      <th>疫苗項目</th>
                      <th>訊息</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in paginatedItems" :key="log.id">
                      <td>{{ formatDate(log.sentAt || log.createdAt) }}</td>
                      <td>
                        <span :class="statusBadgeClass(log.status)">
                          {{ statusLabel(log.status) }}
                        </span>
                      </td>
                      <td>{{ log.userName || '未設定' }}</td>
                      <td>
                        {{ log.childName }}
                        <small class="text-muted d-block">{{ log.childBirthday }}</small>
                      </td>
                      <td>{{ formatBirthYearMonth(log.childBirthday) }}</td>
                      <td>{{ log.vaccineNames.join('、') || '-' }}</td>
                      <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openDetail(log)">
                          查看內容
                        </button>
                      </td>
                    </tr>
                    <tr v-if="filteredItems.length === 0">
                      <td colspan="7" class="text-center text-muted py-4">
                        無可追蹤的疫苗提醒記錄
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

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
    <FooterComponent />

    <div v-if="selectedLog" class="modal" @click.self="closeDetail">
      <div class="modal-content modal-log-detail">
        <span class="close" @click="closeDetail">&times;</span>
        <h2>疫苗提醒訊息內容</h2>
        <div class="mb-3">
          <span :class="statusBadgeClass(selectedLog.status)">
            {{ statusLabel(selectedLog.status) }}
          </span>
          <span class="text-muted ms-2">{{ formatDate(selectedLog.sentAt || selectedLog.createdAt) }}</span>
        </div>
        <dl class="row">
          <dt class="col-sm-3">使用者</dt>
          <dd class="col-sm-9">{{ selectedLog.userName || '未設定' }}</dd>
          <dt class="col-sm-3">小朋友</dt>
          <dd class="col-sm-9">{{ selectedLog.childName }}（{{ selectedLog.childBirthday }}）</dd>
          <dt class="col-sm-3">出生年月</dt>
          <dd class="col-sm-9">{{ formatBirthYearMonth(selectedLog.childBirthday) }}</dd>
          <dt class="col-sm-3">疫苗項目</dt>
          <dd class="col-sm-9">{{ selectedLog.vaccineNames.join('、') || '-' }}</dd>
          <dt class="col-sm-3">發送批次</dt>
          <dd class="col-sm-9"><code>{{ selectedLog.sendBatchId }}</code></dd>
        </dl>
        <h6>訊息內容</h6>
        <pre class="message-content">{{ selectedLog.message || '無訊息內容' }}</pre>
        <div v-if="selectedLog.errorMessage" class="mt-3">
          <h6>錯誤原因</h6>
          <pre class="error-content">{{ selectedLog.errorMessage }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { format } from 'date-fns'
import FooterComponent from '@/components/layout/Footer.vue'
import { UserApi } from '@/services/api'
import type { VaccineNotifyLog } from '@/services/types'

export default defineComponent({
  name: 'VaccineNotifyLogListView',
  components: {
    FooterComponent,
  },
  data() {
    return {
      logs: [] as VaccineNotifyLog[],
      selectedLog: null as VaccineNotifyLog | null,
      loading: false,
      searchQuery: '',
      statusFilter: '',
      currentPage: 1,
      itemsPerPage: 50,
    }
  },
  computed: {
    sentCount(): number {
      return this.logs.filter((log) => log.status === 'sent').length
    },
    failedCount(): number {
      return this.logs.filter((log) => log.status === 'failed').length
    },
    filteredItems(): VaccineNotifyLog[] {
      let items = this.logs

      if (this.statusFilter) {
        items = items.filter((log) => log.status === this.statusFilter)
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        items = items.filter((log) =>
          (log.userName || '').toLowerCase().includes(query) ||
          log.childName.toLowerCase().includes(query) ||
          log.childBirthday.toLowerCase().includes(query) ||
          this.formatBirthYearMonth(log.childBirthday).toLowerCase().includes(query) ||
          log.vaccineNames.join(' ').toLowerCase().includes(query) ||
          (log.message || '').toLowerCase().includes(query) ||
          (log.errorMessage || '').toLowerCase().includes(query)
        )
      }

      return items
    },
    totalPages(): number {
      return Math.max(1, Math.ceil(this.filteredItems.length / this.itemsPerPage))
    },
    paginatedItems(): VaccineNotifyLog[] {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredItems.slice(start, start + this.itemsPerPage)
    },
  },
  watch: {
    searchQuery() { this.currentPage = 1 },
    statusFilter() { this.currentPage = 1 },
  },
  async mounted() {
    await this.fetchLogs()
  },
  methods: {
    async fetchLogs(): Promise<void> {
      this.loading = true
      try {
        const data = await UserApi.getVaccineNotifyLogs()
        this.logs = data.slice().sort(
          (a, b) =>
            new Date(b.sentAt || b.createdAt).getTime() -
            new Date(a.sentAt || a.createdAt).getTime()
        )
      } catch (error) {
        console.error('Failed to fetch vaccine notify logs:', error)
      } finally {
        this.loading = false
      }
    },
    openDetail(log: VaccineNotifyLog): void {
      this.selectedLog = log
    },
    closeDetail(): void {
      this.selectedLog = null
    },
    formatDate(dateStr: string | null): string {
      if (!dateStr) return '-'
      return format(new Date(dateStr), 'yyyy/MM/dd HH:mm')
    },
    formatBirthYearMonth(birthday: string | null): string {
      if (!birthday) return '-'
      const match = birthday.match(/^(\d{4})[-/](\d{1,2})/)
      if (!match) return '-'
      return `${match[1]}/${match[2].padStart(2, '0')}`
    },
    statusLabel(status: string): string {
      if (status === 'sent') return '成功'
      if (status === 'failed') return '失敗'
      return status
    },
    statusBadgeClass(status: string): string {
      if (status === 'sent') return 'badge badge-light-success'
      if (status === 'failed') return 'badge badge-light-danger'
      return 'badge badge-light-secondary'
    },
  },
})
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
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
}

.modal-log-detail {
  max-width: 900px;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5em;
  cursor: pointer;
  color: #999;
}

.close:hover {
  color: #000;
}

.message-content,
.error-content {
  white-space: pre-wrap;
  word-break: break-word;
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  max-height: 280px;
  overflow-y: auto;
}
</style>
