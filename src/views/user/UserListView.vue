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
                    <th class="line-id-column">Line ID</th>
                    <th class="line-name-column">Line名稱</th>
                    <th class="name-column">姓名</th>
                    <th class="phone-column">電話</th>
                    <th class="address-column">地址</th>
                    <th class="actions-column">功能</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in paginatedItems" :key="user.uuid">
                    <td class="line-id-column">{{ user.lineId }}</td>
                    <td class="line-name-column">
                      <a href="#" @click.prevent="openUserDetail(user)" class="text-primary text-decoration-none">
                        {{ user.name || '未設定' }}
                      </a>
                    </td>
                    <td class="name-column">{{ user.content?.name || '未設定' }}</td>
                    <td class="phone-column">{{ user.content?.phone || '未設定' }}</td>
                    <td class="address-column">{{ user.content?.address || '未設定' }}</td>
                    <td class="actions-column">
                      <a class="badge badge-light-info text-start me-2 action-view" @click="openUserDetail(user)" title="查看詳細資料">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </a>
                      <a class="badge badge-light-success text-start me-2 action-children" @click="openChildrenModal(user)" title="小朋友資訊">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </a>
                      <a class="badge badge-light-warning text-start me-2 action-notes" @click="openNotesModal(user)" title="筆記管理">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text">
                          <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
                          <line x1="9" y1="9" x2="10" y2="9"></line>
                          <line x1="9" y1="13" x2="15" y2="13"></line>
                          <line x1="9" y1="17" x2="15" y2="17"></line>
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
          <p><strong>用戶 UUID:</strong> {{ selectedUser.uuid }}</p>
          <p><strong>LINE ID:</strong> {{ selectedUser.lineId }}</p>
          <p><strong>Line名稱:</strong> {{ selectedUser.name || '未設定' }}</p>
          <p><strong>姓名:</strong> {{ selectedUser.content?.name || '未設定' }}</p>
          <p><strong>電話:</strong> {{ selectedUser.content?.phone || '未設定' }}</p>
          <p><strong>地址:</strong> {{ selectedUser.content?.address || '未設定' }}</p>
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
          
          <div v-if="childrenLoading" class="loading-indicator">
            載入中...
          </div>

          <div v-else-if="children.length > 0">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>出生日期</th>
                  <th>年齡</th>
                  <th>建立時間</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="child in children" :key="child.uuid">
                  <td>{{ child.name }}</td>
                  <td>{{ formatDate(child.birthDate) }}</td>
                  <td>{{ calculateAge(child.birthDate) }} 歲</td>
                  <td>{{ formatDate(child.createdAt) }}</td>
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
          <h2>{{ selectedUser.content?.name || selectedUser.name || '未設定姓名' }} 的筆記</h2>
        </div>
        
        <div class="notes-add-section">
          <button class="btn btn-primary btn-sm" @click="openAddNoteModal">新增筆記</button>
        </div>
        
        <div class="notes-container">
          <div v-if="notesLoading" class="loading-indicator">
            載入中...
          </div>

          <div v-else-if="notes.length > 0" class="notes-list">
            <div v-for="(note, index) in notes" :key="note.uuid" class="note-item">
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
            <p>暫無筆記資料</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Note Modal -->
    <div v-if="showNoteEditModal" class="modal" @click.self="closeNoteEditModal">
      <div class="modal-content">
        <span class="close" @click="closeNoteEditModal">&times;</span>
        <h2>{{ editingNote ? '編輯筆記' : '新增筆記' }}</h2>
        <form @submit.prevent="saveNote">
          <div class="mb-3">
            <label class="form-label">標題</label>
            <input type="text" class="form-control" v-model="noteForm.title" required>
          </div>
          <div class="mb-3">
            <label class="form-label">內容</label>
            <textarea class="form-control" v-model="noteForm.content" rows="5" required></textarea>
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
          <h2>筆記編輯歷史</h2>
        </div>
        
        <div v-if="selectedNote" class="history-container">
          <div class="current-note-info mb-4">
            <h5>{{ selectedNote.title }}</h5>
            <div class="note-meta">
              <span class="text-muted">建立時間：{{ formatDate(selectedNote.createdAt) }}</span>
              <span class="text-muted ms-3">最後更新：{{ formatDate(selectedNote.updatedAt) }}</span>
            </div>
          </div>

          <div v-if="selectedNote.NoteEditHistory && selectedNote.NoteEditHistory.length > 0" class="history-list">
            <h6 class="mb-3">編輯記錄 ({{ selectedNote.NoteEditHistory.length }} 筆)</h6>
            <div class="history-timeline">
              <div v-for="(history, index) in selectedNote.NoteEditHistory" :key="history.uuid" class="history-item">
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
              <p class="mb-0">此筆記暫無編輯歷史記錄</p>
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

interface UserContent {
  name?: string
  phone?: string
  address?: string
  email?: string
}

interface User {
  uuid: string
  lineId: string
  name: string | null
  content: UserContent | null
  createdAt: string
  updatedAt: string
}

interface Child {
  uuid: string
  name: string
  birthDate: string
  createdAt: string
  updatedAt: string
}

interface NoteEditHistory {
  uuid: string
  beforeContent: string | null
  afterContent: string | null
  createdAt: string
  updatedAt: string
}

interface Note {
  uuid: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  NoteEditHistory?: NoteEditHistory[]
}

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
      children: [] as Child[],
      notes: [] as Note[],
      loading: false,
      childrenLoading: false,
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
      itemsPerPage: 10,
      noteForm: {
        title: '',
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
        (user.content?.address && user.content.address.toLowerCase().includes(query))
      )
    }
  },
  methods: {

    // Mock data for development - replace with API calls later
    getMockUsers() {
      return [
        {
          uuid: '1',
          lineId: 'user001',
          name: '張小明',
          content: { 
            name: '張大明', 
            phone: '0912345678', 
            address: '台北市信義區忠孝東路123號',
            email: 'user001@example.com' 
          },
          createdAt: '2024-01-15T08:30:00Z',
          updatedAt: '2024-01-20T10:15:00Z'
        },
        {
          uuid: '2',
          lineId: 'user002',
          name: '李小華',
          content: { 
            name: '李大華',
            phone: '0987654321',
            address: '新北市板橋區中正路456號'
          },
          createdAt: '2024-01-16T09:00:00Z',
          updatedAt: '2024-01-22T14:30:00Z'
        },
        {
          uuid: '3',
          lineId: 'user003',
          name: null,
          content: null,
          createdAt: '2024-01-17T10:00:00Z',
          updatedAt: '2024-01-17T10:00:00Z'
        }
      ]
    },
    getMockChildren() {
      return [
        {
          uuid: 'child1',
          name: '張小寶',
          birthDate: '2020-05-15T00:00:00Z',
          createdAt: '2024-01-15T08:30:00Z',
          updatedAt: '2024-01-15T08:30:00Z'
        },
        {
          uuid: 'child2',
          name: '張小貝',
          birthDate: '2018-03-22T00:00:00Z',
          createdAt: '2024-01-15T08:30:00Z',
          updatedAt: '2024-01-15T08:30:00Z'
        }
      ]
    },
    getMockNotes() {
      return [
        {
          uuid: 'note1',
          title: '第一次諮詢記錄',
          content: '小朋友有些許發燒症狀，建議多休息並觀察體溫變化。建議每4小時量一次體溫，若持續高燒超過38.5度請就醫。',
          createdAt: '2024-01-16T09:00:00Z',
          updatedAt: '2024-01-16T15:30:00Z',
          NoteEditHistory: [
            {
              uuid: 'history1',
              beforeContent: '小朋友有發燒症狀',
              afterContent: '小朋友有些許發燒症狀，建議多休息並觀察體溫變化。建議每4小時量一次體溫，若持續高燒超過38.5度請就醫。',
              createdAt: '2024-01-16T15:30:00Z',
              updatedAt: '2024-01-16T15:30:00Z'
            }
          ]
        },
        {
          uuid: 'note2',
          title: '追蹤記錄',
          content: '體溫已恢復正常，精神狀況良好。家長表示孩子食欲正常，沒有其他症狀。',
          createdAt: '2024-01-18T10:30:00Z',
          updatedAt: '2024-01-18T10:30:00Z',
          NoteEditHistory: []
        }
      ]
    },

    async fetchUsers() {
      this.loading = true
      try {
        // TODO: Replace with actual API call
        // const response = await apiClient.get('/user')
        // this.users = response.data
        
        // Mock delay for development
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.users = this.getMockUsers()
      } catch (error) {
        console.error('Failed to fetch users:', error)
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

    async openChildrenModal(user: User) {
      this.selectedUser = user
      this.children = []
      this.childrenLoading = true
      this.showChildrenModal = true

      try {
        // TODO: Replace with actual API call
        // const response = await apiClient.get(`/user/${user.uuid}/children`)
        // this.children = response.data
        
        // Mock delay for development
        await new Promise(resolve => setTimeout(resolve, 800))
        this.children = user.uuid === '1' ? this.getMockChildren() : []
      } catch (error) {
        console.error('Failed to fetch children:', error)
      } finally {
        this.childrenLoading = false
      }
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
        // TODO: Replace with actual API call
        // const response = await apiClient.get(`/user/${user.uuid}/notes`)
        // this.notes = response.data
        
        // Mock delay for development
        await new Promise(resolve => setTimeout(resolve, 800))
        this.notes = user.uuid === '1' ? this.getMockNotes() : []
      } catch (error) {
        console.error('Failed to fetch notes:', error)
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
        title: '',
        content: ''
      }
      this.showNoteEditModal = true
    },

    editNote(note: Note) {
      this.editingNote = note
      this.noteForm = {
        title: note.title,
        content: note.content
      }
      this.showNoteEditModal = true
    },

    closeNoteEditModal() {
      this.showNoteEditModal = false
      this.editingNote = null
      this.noteForm = {
        title: '',
        content: ''
      }
    },

    async saveNote() {
      try {
        if (this.editingNote) {
          // TODO: Replace with actual API call
          // await apiClient.patch(`/user/${this.selectedUser.uuid}/notes/${this.editingNote.uuid}`, this.noteForm)
          
          // Mock update
          const index = this.notes.findIndex(n => n.uuid === this.editingNote!.uuid)
          if (index !== -1) {
            this.notes[index] = {
              ...this.notes[index],
              title: this.noteForm.title,
              content: this.noteForm.content,
              updatedAt: new Date().toISOString()
            }
          }
          
          await Swal.fire({
            title: '成功！',
            text: '筆記已更新',
            icon: 'success',
            confirmButtonText: '確定'
          })
        } else {
          // TODO: Replace with actual API call
          // await apiClient.post(`/user/${this.selectedUser.uuid}/notes`, this.noteForm)
          
          // Mock add
          const newNote: Note = {
            uuid: `note-${Date.now()}`,
            title: this.noteForm.title,
            content: this.noteForm.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            NoteEditHistory: []
          }
          this.notes.unshift(newNote)
          
          await Swal.fire({
            title: '成功！',
            text: '筆記已新增',
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
        text: `確定要刪除筆記「${note.title}」嗎？此操作無法復原。`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        confirmButtonColor: '#d33'
      })

      if (result.isConfirmed) {
        try {
          // TODO: Replace with actual API call
          // await apiClient.delete(`/user/${this.selectedUser.uuid}/notes/${note.uuid}`)
          
          // Mock delete
          const index = this.notes.findIndex(n => n.uuid === note.uuid)
          if (index !== -1) {
            this.notes.splice(index, 1)
          }
          
          await Swal.fire({
            title: '已刪除！',
            text: '筆記已成功刪除',
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

    viewNoteDetail(note: Note) {
      this.selectedNote = note
      this.showNoteDetailModal = true
    },

    closeNoteDetailModal() {
      this.showNoteDetailModal = false
      this.selectedNote = null
    },

    truncateContent(content: string, maxLength: number = 50) {
      if (!content) return ''
      return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
    },

    formatDate(dateString: string) {
      if (!dateString) return ''
      return format(new Date(dateString), 'yyyy/MM/dd HH:mm')
    },

    calculateAge(birthDate: string) {
      if (!birthDate) return 0
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      
      return age
    },

    // Inline editing methods
    startEditNote(note: Note) {
      this.editingNoteId = note.uuid
      this.editNoteContent = note.content
    },

    async saveEditNote(note: Note) {
      try {
        // TODO: Replace with actual API call
        // await apiClient.patch(`/user/${this.selectedUser.uuid}/notes/${note.uuid}`, { content: this.editNoteContent })
        
        // Mock update
        const index = this.notes.findIndex(n => n.uuid === note.uuid)
        if (index !== -1) {
          this.notes[index] = {
            ...this.notes[index],
            content: this.editNoteContent,
            updatedAt: new Date().toISOString()
          }
        }
        
        this.editingNoteId = null
        this.editNoteContent = ''
        
        await Swal.fire({
          title: '成功！',
          text: '筆記已更新',
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
    viewNoteHistory(note: Note) {
      this.selectedNote = note
      this.showNoteHistoryModal = true
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
.line-id-column {
  width: 10%;
  word-wrap: break-word;
  word-break: break-all;
}

.line-name-column {
  width: 15%;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.name-column {
  width: 15%;
  word-wrap: break-word;
  word-break: break-all;
}

.phone-column {
  width: 12%;
  word-wrap: break-word;
  word-break: break-all;
}

.address-column {
  width: 25%;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.actions-column {
  width: 18%;
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

.modal-large {
  width: 90%;
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
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 600;
  margin-bottom: 15px;
  background: #fff;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #dee2e6;
  display: inline-flex;
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