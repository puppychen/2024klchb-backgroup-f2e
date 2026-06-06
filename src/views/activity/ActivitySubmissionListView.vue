<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <div class="page-meta">
          <nav class="breadcrumb-style-one" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">活動管理</a></li>
              <li class="breadcrumb-item active" aria-current="page">幼專活動填寫</li>
            </ol>
          </nav>
        </div>

        <div class="row" id="cancel-row">
          <div class="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
            <div class="widget-content widget-content-area br-8">
              <div class="row m-3">
                <div class="col-sm-5 my-2">
                  <label class="form-label">關鍵字搜尋</label>
                  <input type="text" class="form-control" v-model="searchQuery" placeholder="Line 名稱 / 姓名 / 寶寶姓名 / 診所">
                </div>
                <div class="col-sm-4 my-2">
                  <label class="form-label">幼兒專責狀態</label>
                  <select class="form-control" v-model="selectedStatus">
                    <option value="all">全部</option>
                    <option value="joined">已加入</option>
                    <option value="interested">有意願</option>
                    <option value="not_interested">無意願</option>
                  </select>
                </div>
              </div>

              <hr class="my-4">

              <div v-if="loading" class="loading-indicator">Loading...</div>

              <div v-else class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>填寫時間</th>
                      <th>Line 名稱</th>
                      <th>姓名</th>
                      <th>身分</th>
                      <th>出生/預產</th>
                      <th>幼兒專責</th>
                      <th>專責診所</th>
                      <th>同步</th>
                      <th>推播</th>
                      <th>證明圖</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in paginatedItems" :key="item.uuid">
                      <td>{{ formatDate(item.submittedAt) }}</td>
                      <td>{{ item.lineName || '-' }}</td>
                      <td>{{ item.name || '-' }}</td>
                      <td>
                        <span :class="identityBadge(item.identity)">{{ identityText(item.identity) }}</span>
                      </td>
                      <td>{{ item.babyBirth || item.dueDate || '-' }}</td>
                      <td>
                        <span :class="pediatricianBadge(item.pediatricianStatus)">
                          {{ pediatricianText(item.pediatricianStatus) }}
                        </span>
                      </td>
                      <td>{{ item.pediatricianClinicName || '-' }}</td>
                      <td>
                        <span :class="syncBadge(item.profileSyncStatus)">{{ syncText(item.profileSyncStatus) }}</span>
                      </td>
                      <td>
                        <span :class="pushBadge(item.linePushStatus)">{{ pushText(item.linePushStatus) }}</span>
                      </td>
                      <td>
                        <button v-if="item.hasProofImage" class="btn btn-sm btn-outline-primary" @click="viewProof(item)">
                          檢視
                        </button>
                        <span v-else class="text-muted">-</span>
                      </td>
                    </tr>
                    <tr v-if="paginatedItems.length === 0">
                      <td colspan="10" class="text-center text-muted py-4">無資料</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="pagination-controls">
                <button class="btn btn-outline-dark btn-rounded" @click="prevPage" :disabled="currentPage === 1">上一頁</button>
                <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
                <button class="btn btn-outline-dark btn-rounded" @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 證明圖 Modal -->
    <div v-if="showProofModal" class="modal" @click.self="showProofModal = false">
      <div class="modal-content">
        <span class="close" @click="showProofModal = false">&times;</span>
        <h2>證明照片</h2>
        <div v-if="proofLoading" class="loading-indicator">載入中...</div>
        <img v-else-if="proofUrl" :src="proofUrl" alt="證明照片" style="max-width:100%;border-radius:6px;" />
        <p v-else class="text-muted">無法取得圖片</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ActivityApi } from '@/services/api'
import type { ActivitySubmission } from '@/services/types'
import { format } from 'date-fns'

export default {
  name: 'ActivitySubmissionListView',
  data() {
    return {
      items: [] as ActivitySubmission[],
      loading: true,
      searchQuery: '',
      selectedStatus: 'all',
      currentPage: 1,
      itemsPerPage: 50,
      showProofModal: false,
      proofLoading: false,
      proofUrl: '' as string,
    }
  },
  computed: {
    filteredItems(): ActivitySubmission[] {
      let list = this.items
      if (this.selectedStatus !== 'all') {
        list = list.filter((i) => i.pediatricianStatus === this.selectedStatus)
      }
      const q = this.searchQuery.trim().toLowerCase()
      if (!q) return list
      return list.filter((i) =>
        [i.lineName, i.name, i.pediatricianClinicName]
          .some((v) => v && v.toLowerCase().includes(q)),
      )
    },
    totalPages(): number {
      return Math.max(1, Math.ceil(this.filteredItems.length / this.itemsPerPage))
    },
    paginatedItems(): ActivitySubmission[] {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredItems.slice(start, start + this.itemsPerPage)
    },
  },
  watch: {
    searchQuery() { this.currentPage = 1 },
    selectedStatus() { this.currentPage = 1 },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        this.items = await ActivityApi.getSubmissions()
      } catch (e) {
        console.error('Failed to fetch activity submissions:', e)
      } finally {
        this.loading = false
      }
    },
    formatDate(d: string): string {
      try { return format(new Date(d), 'yyyy/MM/dd HH:mm') } catch { return d }
    },
    pediatricianText(s: string | null): string {
      const map: Record<string, string> = {
        joined: '已加入', interested: '有意願', not_interested: '無意願',
      }
      return s ? (map[s] || s) : '-'
    },
    pediatricianBadge(s: string | null): string {
      if (s === 'joined') return 'badge badge-light-success'
      if (s === 'interested') return 'badge badge-light-warning'
      if (s === 'not_interested') return 'badge badge-light-secondary'
      return 'text-muted'
    },
    syncBadge(s: string | null): string {
      if (s === 'synced') return 'badge badge-light-success'
      if (s === 'conflict') return 'badge badge-light-danger'
      if (s === 'failed') return 'badge badge-light-danger'
      return 'badge badge-light-secondary'
    },
    pushBadge(s: string | null): string {
      if (s === 'sent') return 'badge badge-light-success'
      if (s === 'failed') return 'badge badge-light-danger'
      return 'badge badge-light-secondary'
    },
    identityText(s: string | null): string {
      const map: Record<string, string> = {
        孕期中: '孕期中（待產）',
        家長: '0–3歲幼兒家長',
        其他: '其他',
      }
      return s ? (map[s] || s) : '-'
    },
    identityBadge(s: string | null): string {
      if (s === '孕期中') return 'badge badge-light-info'
      if (s === '家長') return 'badge badge-light-success'
      return 'badge badge-light-secondary'
    },
    syncText(s: string | null): string {
      const map: Record<string, string> = {
        synced: '已同步',
        conflict: '衝突未覆寫',
        skipped: '不適用',
        failed: '失敗',
      }
      return s ? (map[s] || s) : '-'
    },
    pushText(s: string | null): string {
      const map: Record<string, string> = {
        sent: '已推播',
        failed: '失敗',
        skipped: '未推播',
      }
      return s ? (map[s] || s) : '-'
    },
    async viewProof(item: ActivitySubmission) {
      this.showProofModal = true
      this.proofLoading = true
      this.proofUrl = ''
      try {
        this.proofUrl = (await ActivityApi.getProofUrl(item.uuid)) || ''
      } catch (e) {
        console.error('Failed to get proof url:', e)
      } finally {
        this.proofLoading = false
      }
    },
    prevPage() { if (this.currentPage > 1) this.currentPage-- },
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++ },
  },
}
</script>

<style scoped>
/* 自訂 modal（避免被 Bootstrap 的 .modal{display:none} 藏住） */
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
  z-index: 1050;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
}
.close {
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 1.6em;
  line-height: 1;
  cursor: pointer;
  color: #999;
}
.close:hover {
  color: #000;
}
</style>
