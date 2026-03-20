<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <!-- BREADCRUMB -->
        <div class="page-meta">
          <nav class="breadcrumb-style-one" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">諮詢記錄管理</a></li>
              <li class="breadcrumb-item active" aria-current="page">用戶列表</li>
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

              <table v-else id="user-list" class="table dt-table-hover" style="width:100%">
                <thead>
                  <tr>
                    <th class="line-name-column">Line 名稱</th>
                    <th class="set-name-column">設定名稱</th>
                    <th class="address-column">地址</th>
                    <th class="source-column">來源</th>
                    <th class="info-column">資訊</th>
                    <th class="date-column">加入時間</th>
                    <th class="actions-column">功能</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in paginatedItems" :key="user.uuid">
                    <td class="line-name-column">
                      <div class="user-cell">
                        <img
                          :src="user.pictureUrl || defaultAvatar"
                          class="user-avatar"
                          @error="onAvatarError($event)"
                          alt="avatar"
                        />
                        <a href="#" @click.prevent="openUserDetail(user)" class="user-line-name">
                          {{ user.name || '未設定' }}
                        </a>
                      </div>
                    </td>
                    <td class="set-name-column">
                      <span v-if="user.content?.name">{{ user.content.name }}</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td class="address-column">
                      <span v-if="user.content?.address" :title="user.content.address">{{ user.content.address.substring(0, 5) }}</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td class="source-column">
                      <span v-if="user.sourceName" class="badge badge-light-primary">{{ user.sourceName }}</span>
                      <span v-else-if="user.sourceKeyword" class="badge badge-light-secondary">{{ user.sourceKeyword }}</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td class="info-column">
                      <span v-if="user.content?.name" class="badge badge-light-success me-1">已填資料</span>
                      <span v-if="user.content?.childes && user.content.childes.length > 0" class="badge badge-light-info me-1">{{ user.content.childes.length }} 位孩子</span>
                      <span v-if="user.Note && user.Note.length > 0" class="badge badge-light-warning me-1">{{ user.Note.length }} 筆記事</span>
                      <span v-if="!user.content?.name && (!user.content?.childes || user.content.childes.length === 0) && (!user.Note || user.Note.length === 0)" class="text-muted">-</span>
                    </td>
                    <td class="date-column">{{ formatShortDate(user.createdAt) }}</td>
                    <td class="actions-column">
                      <a class="badge badge-light-info text-start me-2 action-view" @click="openUserDetail(user)" title="查看詳細資料">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </a>
                      <a v-if="user.content?.childes && user.content.childes.length > 0"
                         class="badge badge-success text-start me-2 action-children position-relative"
                         @click="openChildrenModal(user)"
                         :title="`${user.content.childes.length} 位小朋友`"
                         style="color: #fff;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style="font-size: 10px;">
                          {{ user.content.childes.length }}
                        </span>
                      </a>
                      <a v-else
                         class="badge badge-light-secondary text-start me-2 action-children"
                         @click="openChildrenModal(user)"
                         title="尚無小朋友資料"
                         style="opacity: 0.4;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </a>
                      <a v-if="user.Note && user.Note.length > 0"
                         class="badge badge-warning text-start me-2 action-notes position-relative"
                         @click="openNotesModal(user)"
                         :title="`${user.Note.length} 筆記事`"
                         style="color: #fff;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
                        </svg>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style="font-size: 10px;">
                          {{ user.Note.length }}
                        </span>
                      </a>
                      <a v-else
                         class="badge badge-light-secondary text-start me-2 action-notes"
                         @click="openNotesModal(user)"
                         title="尚無記事"
                         style="opacity: 0.4;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
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

    <!-- User Detail Modal -->
    <div v-if="showUserDetailModal" class="modal" @click.self="closeUserDetailModal">
      <div class="modal-content">
        <span class="close" @click="closeUserDetailModal">&times;</span>
        <h2>用戶詳細資料</h2>
        <div v-if="selectedUser">
          <div class="detail-avatar-section">
            <img
              :src="selectedUser.pictureUrl || defaultAvatar"
              class="detail-avatar"
              @error="onAvatarError($event)"
              alt="avatar"
            />
            <div>
              <h5 class="mb-1">{{ selectedUser.name || '未設定' }}</h5>
              <span v-if="selectedUser.content?.name" class="text-muted">{{ selectedUser.content.name }}</span>
            </div>
          </div>
          <hr />
          <p><strong>用戶 UUID:</strong> {{ selectedUser.uuid }}</p>
          <p><strong>LINE ID:</strong> {{ selectedUser.lineId }}</p>
          <p><strong>Line名稱:</strong> {{ selectedUser.name || '未設定' }}</p>
          <p><strong>姓名:</strong> {{ selectedUser.content?.name || '未設定' }}</p>
          <p><strong>電話:</strong> {{ selectedUser.content?.phone || '未設定' }}</p>
          <p><strong>地址:</strong> {{ selectedUser.content?.address || '未設定' }}</p>
          <p><strong>來源:</strong> {{ selectedUser.sourceKeyword || '未設定' }}</p>
          <p><strong>建立時間:</strong> {{ formatDate(selectedUser.createdAt) }}</p>
          <p><strong>更新時間:</strong> {{ formatDate(selectedUser.updatedAt) }}</p>
          <div v-if="selectedUser.content" class="mt-4">
            <h6>完整附加資料</h6>
            <pre class="bg-light p-3 rounded">{{ JSON.stringify(selectedUser.content, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Children Modal -->
    <div v-if="showChildrenModal" class="modal" @click.self="closeChildrenModal">
      <div class="modal-content">
        <span class="close" @click="closeChildrenModal">&times;</span>
        <h2>小朋友資訊</h2>
        <div v-if="selectedUser">
          <h6 class="mb-3">{{ selectedUser.content?.name || selectedUser.name || '未設定姓名' }} 的小朋友資訊</h6>

          <div v-if="children.length > 0">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>出生日期</th>
                  <th>年齡</th>
                  <th>體重(kg)</th>
                  <th>主要醫療院所</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(child, index) in children" :key="index">
                  <td>{{ child.name || '-' }}</td>
                  <td>{{ child.birthDate || '-' }}</td>
                  <td>{{ child.age || (child.birthDate ? calculateAge(child.birthDate) + ' 歲' : '-') }}</td>
                  <td>{{ child.weight || '-' }}</td>
                  <td>{{ child.primary_medical || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center py-4 text-muted">
            <p>暫無小朋友資料</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes Modal -->
    <div v-if="showNotesModal" class="modal" @click.self="closeNotesModal">
      <div class="modal-content modal-notes">
        <span class="close" @click="closeNotesModal">&times;</span>
        <div class="notes-header">
          <h2>{{ selectedUser?.content?.name || selectedUser?.name || '未設定姓名' }} 的記事本</h2>
        </div>

        <div class="notes-add-section">
          <button class="btn btn-primary btn-sm" @click="openAddNoteModal">新增記事本</button>
        </div>

        <div class="notes-container">
          <div v-if="notesLoading" class="loading-indicator">
            載入中...
          </div>

          <div v-else-if="notes.length > 0" class="notes-list">
            <div v-for="note in notes" :key="note.uuid" class="note-item">
              <!-- Display Mode -->
              <div v-if="editingNoteId !== note.uuid" class="note-display">
                <div class="note-content">
                  {{ note.content }}
                </div>
                <div class="note-footer">
                  <div class="note-date">
                    更新時間：{{ formatDate(note.updatedAt) }}
                  </div>
                  <div class="note-actions">
                    <button class="btn-icon" @click="startEditNote(note)" title="編輯">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                    <button class="btn-icon btn-history" @click="viewNoteHistory(note)" title="歷史記錄">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                    </button>
                    <button class="btn-icon btn-delete" @click="deleteNote(note)" title="刪除">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Edit Mode -->
              <div v-else class="note-edit">
                <textarea
                  v-model="editNoteContent"
                  class="note-textarea"
                  rows="4"
                  @keydown.escape="cancelEditNote"
                ></textarea>
                <div class="note-edit-actions">
                  <button class="btn btn-secondary btn-sm me-2" @click="cancelEditNote">
                    取消
                  </button>
                  <button class="btn btn-success btn-sm" @click="saveEditNote(note)">
                    儲存
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-notes">
            <p>暫無記事本資料</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Note Modal -->
    <div v-if="showNoteEditModal" class="modal" @click.self="closeNoteEditModal">
      <div class="modal-content">
        <span class="close" @click="closeNoteEditModal">&times;</span>
        <h2>{{ editingNote ? '編輯記事本' : '新增記事本' }}</h2>
        <form @submit.prevent="saveNote">
          <div class="mb-3">
            <label class="form-label">內容</label>
            <textarea class="form-control" v-model="noteForm.content" rows="8" required></textarea>
          </div>
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" @click="closeNoteEditModal">取消</button>
            <button type="submit" class="btn btn-primary">{{ editingNote ? '更新' : '新增' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Note History Modal -->
    <div v-if="showNoteHistoryModal" class="modal" @click.self="closeNoteHistoryModal">
      <div class="modal-content modal-history">
        <span class="close" @click="closeNoteHistoryModal">&times;</span>
        <div class="history-header">
          <button class="btn btn-outline-secondary btn-sm me-3" @click="backToNotesList">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left me-1">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12,19 5,12 12,5"></polyline>
            </svg>
            返回
          </button>
          <h2>記事本編輯歷史</h2>
        </div>

        <div v-if="selectedNote" class="history-container">
          <div class="current-note-info mb-4">
            <div class="note-meta">
              <span class="text-muted">建立時間：{{ formatDate(selectedNote.createdAt) }}</span>
              <span class="text-muted ms-3">最後更新：{{ formatDate(selectedNote.updatedAt) }}</span>
            </div>
          </div>

          <div v-if="selectedNote.NoteEditHistory && selectedNote.NoteEditHistory.length > 0" class="history-list">
            <h6 class="mb-3">編輯記錄 ({{ selectedNote.NoteEditHistory.length }} 筆)</h6>
            <div class="history-timeline">
              <div v-for="history in selectedNote.NoteEditHistory" :key="history.uuid" class="history-item">
                <div class="history-date">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock me-1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  {{ formatDate(history.createdAt) }}
                </div>

                <div class="history-changes">
                  <div class="change-section">
                    <div class="change-label">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minus-circle me-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                      修改前
                    </div>
                    <div class="change-content before-content">
                      {{ history.beforeContent || '無內容' }}
                    </div>
                  </div>

                  <div class="change-section">
                    <div class="change-label">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle me-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                      修改後
                    </div>
                    <div class="change-content after-content">
                      {{ history.afterContent || '無內容' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="no-history">
            <div class="text-center py-5 text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock mb-3">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
              <p class="mb-0">此記事本暫無編輯歷史記錄</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FooterComponent from '@/components/layout/Footer.vue'
import { format } from 'date-fns'
import Swal from 'sweetalert2'
import { UserService } from '@/services'
import type { User, Note, CreateNoteDto, UpdateNoteDto } from '@/services/types'

export default {
  name: 'UserListView',
  components: {
    FooterComponent
  },
  data() {
    return {
      users: [] as User[],
      selectedUser: null as User | null,
      selectedNote: null as Note | null,
      children: [] as any[],
      notes: [] as Note[],
      loading: false,
      notesLoading: false,
      showUserDetailModal: false,
      showChildrenModal: false,
      showNotesModal: false,
      showNoteEditModal: false,
      showNoteDetailModal: false,
      showNoteHistoryModal: false,
      editingNote: null as Note | null,
      editingNoteId: null as string | null,
      editNoteContent: '',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 50,
      defaultAvatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjY2NjIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAzYzEuNjYgMCAzIDEuMzQgMyAzcy0xLjM0IDMtMyAzLTMtMS4zNC0zLTMgMS4zNC0zIDMtM3ptMCAxNC4yYy0yLjUgMC00LjcxLTEuMjgtNi0zLjIyLjAzLTEuOTkgNC0zLjA4IDYtMy4wOCAxLjk5IDAgNS45NyAxLjA5IDYgMy4wOC0xLjI5IDEuOTQtMy41IDMuMjItNiAzLjIyeiIvPjwvc3ZnPg==',
      noteForm: {
        content: ''
      }
    }
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredItems.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage)
    },
    filteredItems() {
      if (!this.searchQuery) {
        return this.users
      }
      const query = this.searchQuery.toLowerCase()
      return this.users.filter((user: User) =>
        user.lineId.toLowerCase().includes(query) ||
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.content?.name && user.content.name.toLowerCase().includes(query)) ||
        (user.content?.phone && user.content.phone.toLowerCase().includes(query)) ||
        (user.content?.address && user.content.address.toLowerCase().includes(query)) ||
        (user.sourceKeyword && user.sourceKeyword.toLowerCase().includes(query))
      )
    }
  },
  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        this.users = await UserService.getUserList()
      } catch (error) {
        console.error('Failed to fetch users:', error)
        await Swal.fire({
          title: '錯誤！',
          text: '無法載入用戶列表，請再試一次',
          icon: 'error',
          confirmButtonText: '確定'
        })
      } finally {
        this.loading = false
      }
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
    },

    openUserDetail(user: User) {
      this.selectedUser = user
      this.showUserDetailModal = true
    },

    closeUserDetailModal() {
      this.showUserDetailModal = false
      this.selectedUser = null
    },

    openChildrenModal(user: User) {
      this.selectedUser = user
      this.children = user.content?.childes || []
      this.showChildrenModal = true
    },

    closeChildrenModal() {
      this.showChildrenModal = false
      this.selectedUser = null
      this.children = []
    },

    async openNotesModal(user: User) {
      this.selectedUser = user
      this.notes = []
      this.notesLoading = true
      this.showNotesModal = true

      try {
        this.notes = await UserService.getUserNotes(user.uuid)
      } catch (error) {
        console.error('Failed to fetch notes:', error)
        await Swal.fire({
          title: '錯誤！',
          text: '無法載入記事本資料，請再試一次',
          icon: 'error',
          confirmButtonText: '確定'
        })
      } finally {
        this.notesLoading = false
      }
    },

    closeNotesModal() {
      this.showNotesModal = false
      this.selectedUser = null
      this.notes = []
    },

    openAddNoteModal() {
      this.editingNote = null
      this.noteForm = {
        content: ''
      }
      this.showNoteEditModal = true
    },


    closeNoteEditModal() {
      this.showNoteEditModal = false
      this.editingNote = null
      this.noteForm = {
        content: ''
      }
    },

    async saveNote() {
      try {
        if (this.editingNote) {
          const updatedNote = await UserService.updateNote(
            this.selectedUser!.uuid,
            this.editingNote.uuid,
            { content: this.noteForm.content } as UpdateNoteDto
          )

          const index = this.notes.findIndex(n => n.uuid === this.editingNote!.uuid)
          if (index !== -1) {
            this.notes[index] = updatedNote
          }

          await Swal.fire({
            title: '成功！',
            text: '記事本已更新',
            icon: 'success',
            confirmButtonText: '確定'
          })
        } else {
          const newNote = await UserService.createNote(
            this.selectedUser!.uuid,
            { content: this.noteForm.content } as CreateNoteDto
          )

          this.notes.unshift(newNote)

          await Swal.fire({
            title: '成功！',
            text: '記事本已新增',
            icon: 'success',
            confirmButtonText: '確定'
          })
        }

        this.closeNoteEditModal()
      } catch (error) {
        console.error('Failed to save note:', error)
        await Swal.fire({
          title: '錯誤！',
          text: '操作失敗，請再試一次',
          icon: 'error',
          confirmButtonText: '確定'
        })
      }
    },

    async deleteNote(note: Note) {
      const result = await Swal.fire({
        title: '確認刪除？',
        text: `確定要刪除這筆記事本嗎？此操作無法復原。`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        confirmButtonColor: '#d33'
      })

      if (result.isConfirmed) {
        try {
          await UserService.deleteNote(this.selectedUser!.uuid, note.uuid)

          const index = this.notes.findIndex(n => n.uuid === note.uuid)
          if (index !== -1) {
            this.notes.splice(index, 1)
          }

          await Swal.fire({
            title: '已刪除！',
            text: '記事本已成功刪除',
            icon: 'success',
            confirmButtonText: '確定'
          })
        } catch (error) {
          console.error('Failed to delete note:', error)
          await Swal.fire({
            title: '錯誤！',
            text: '刪除失敗，請再試一次',
            icon: 'error',
            confirmButtonText: '確定'
          })
        }
      }
    },


    formatDate(dateString: string) {
      if (!dateString) return ''
      return format(new Date(dateString), 'yyyy/MM/dd HH:mm')
    },

    formatShortDate(dateString: string) {
      if (!dateString) return ''
      return format(new Date(dateString), 'yyyy/MM/dd')
    },

    onAvatarError(event: Event) {
      const img = event.target as HTMLImageElement
      img.src = this.defaultAvatar
    },

    calculateAge(birthDate: string) {
      return UserService.calculateAge(birthDate)
    },

    // Inline editing methods
    startEditNote(note: Note) {
      this.editingNoteId = note.uuid
      this.editNoteContent = note.content
    },

    async saveEditNote(note: Note) {
      try {
        const updatedNote = await UserService.updateNoteContent(
          this.selectedUser!.uuid,
          note.uuid,
          this.editNoteContent
        )

        const index = this.notes.findIndex(n => n.uuid === note.uuid)
        if (index !== -1) {
          this.notes[index] = updatedNote
        }

        this.editingNoteId = null
        this.editNoteContent = ''

        await Swal.fire({
          title: '成功！',
          text: '記事本已更新',
          icon: 'success',
          confirmButtonText: '確定',
          timer: 1500,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Failed to save note:', error)
        await Swal.fire({
          title: '錯誤！',
          text: '更新失敗，請再試一次',
          icon: 'error',
          confirmButtonText: '確定'
        })
      }
    },

    cancelEditNote() {
      this.editingNoteId = null
      this.editNoteContent = ''
    },

    // Note history methods
    async viewNoteHistory(note: Note) {
      try {
        // Get the note with full edit history
        this.selectedNote = await UserService.getNoteDetail(this.selectedUser!.uuid, note.uuid)
        this.showNoteHistoryModal = true
      } catch (error) {
        console.error('Failed to fetch note history:', error)
        await Swal.fire({
          title: '錯誤！',
          text: '無法載入編輯歷史，請再試一次',
          icon: 'error',
          confirmButtonText: '確定'
        })
      }
    },

    closeNoteHistoryModal() {
      this.showNoteHistoryModal = false
      this.selectedNote = null
    },

    backToNotesList() {
      this.showNoteHistoryModal = false
      // Keep the notes modal open so user can continue operating
      // this.selectedNote = null - we keep the selected note in case user wants to see history again
    }
  },

  mounted() {
    this.fetchUsers()
  }
}
</script>

<style scoped>
.line-name-column {
  width: 18%;
  white-space: normal;
}

.set-name-column {
  width: 10%;
  white-space: normal;
}

.phone-column {
  width: 12%;
  word-wrap: break-word;
  word-break: break-all;
}

.source-column {
  width: 13%;
}

.info-column {
  width: 18%;
}

.date-column {
  width: 12%;
}

.actions-column {
  width: 15%;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background-color: #f0f0f0;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-line-name {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-line-name:hover {
  text-decoration: underline;
}

.user-real-name {
  font-size: 0.8rem;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-avatar-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.detail-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #f0f0f0;
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
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
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

.text-primary {
  cursor: pointer;
}

.text-primary:hover {
  text-decoration: underline !important;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

pre {
  font-size: 0.875rem;
  max-height: 300px;
  overflow-y: auto;
}

.badge {
  cursor: pointer;
  margin-right: 0.25rem;
}

.badge:hover {
  opacity: 0.8;
}

.form-control, .form-label {
  margin-bottom: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

/* Notes Modal Specific Styles */
.modal-notes {
  width: 90%;
  max-width: 1000px;
  min-height: 70vh;
  max-height: 90vh;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
}

.notes-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #495057;
}

.notes-add-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.notes-container {
  flex: 1;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.note-item {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 18px;
  transition: all 0.2s ease;
}

.note-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-color: #ced4da;
}

.note-item:last-child {
  margin-bottom: 0;
}

.note-display {
  width: 100%;
}

.note-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #212529;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 15px;
  padding: 0;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f1f3f4;
}

.note-date {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.btn-icon.btn-delete:hover {
  background-color: #f8d7da;
  color: #721c24;
}

.note-edit {
  width: 100%;
}

.note-textarea {
  width: 100%;
  border: 2px solid #ced4da;
  border-radius: 6px;
  padding: 12px;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 12px;
  font-family: inherit;
}

.note-textarea:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.note-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.empty-notes {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-notes p {
  font-size: 1.1rem;
  margin: 0;
}

.btn-icon.btn-history:hover {
  background-color: #e7f3ff;
  color: #0056b3;
}

/* History Modal Styles */
.modal-history {
  width: 90%;
  max-width: 1000px;
  min-height: 70vh;
  max-height: 90vh;
}

.history-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.history-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #495057;
}

.history-container {
  flex: 1;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
}

.current-note-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.current-note-info h5 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 1.25rem;
}

.note-meta span {
  font-size: 0.875rem;
}

.history-list h6 {
  color: #495057;
  font-weight: 600;
  margin-bottom: 20px;
}

.history-timeline {
  position: relative;
}

.history-item {
  position: relative;
  margin-bottom: 30px;
  padding-left: 0;
}

.history-item:before {
  content: '';
  position: absolute;
  left: 12px;
  top: 30px;
  width: 2px;
  height: calc(100% - 10px);
  background: #dee2e6;
}

.history-item:last-child:before {
  display: none;
}

.history-date {
  display: inline-flex;
  align-items: center;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 600;
  margin-bottom: 15px;
  background: #fff;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #dee2e6;
}

.history-changes {
  margin-left: 0;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.change-section {
  margin-bottom: 20px;
}

.change-section:last-child {
  margin-bottom: 0;
}

.change-label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #495057;
}

.change-content {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-left: 3px solid #dee2e6;
}

.before-content {
  border-left-color: #dc3545;
}

.after-content {
  border-left-color: #28a745;
}

.no-history {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.no-history svg {
  opacity: 0.5;
  margin-bottom: 15px;
}
</style>
