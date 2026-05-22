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
                      <a class="badge badge-light-info text-start me-2 action-view" @click="openModal(item)" title="查看詳細資料">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </a>
                      <a class="badge badge-light-warning text-start me-2 action-notes" @click="openNotesModal(item)" :class="{ 'disabled': !item.userUuid }" :title="item.userUuid ? '記事本管理' : '無用戶UUID，無法管理記事本'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text">
                          <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
                          <line x1="9" y1="9" x2="10" y2="9"></line>
                          <line x1="9" y1="13" x2="15" y2="13"></line>
                          <line x1="9" y1="17" x2="15" y2="17"></line>
                        </svg>
                      </a>
                      <a class="badge badge-info text-start me-2 action-chat" @click="openChatMessagesDrawer(item)" :class="{ 'disabled': !item.userUuid }" :title="item.userUuid ? '對話記錄' : '無用戶UUID，無法查看對話記錄'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
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

    <!-- Consultation Detail Modal -->
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

    <!-- Chat Messages Drawer -->
    <div v-if="showChatMessagesDrawer" class="chat-drawer-backdrop" @click.self="closeChatMessagesDrawer">
      <aside class="chat-drawer" role="dialog" aria-modal="true" aria-label="對話記錄">
        <div class="chat-drawer-header">
          <div>
            <h2>對話記錄</h2>
            <p>{{ selectedChatUserName || '未設定姓名' }}</p>
          </div>
          <button type="button" class="chat-drawer-close" @click="closeChatMessagesDrawer" aria-label="關閉">
            &times;
          </button>
        </div>

        <div ref="chatMessagesBody" class="chat-drawer-body">
          <div ref="chatTopSentinel" class="chat-top-sentinel"></div>

          <div v-if="chatMessagesHasMore" class="chat-load-more">
            <button
              class="btn btn-outline-secondary btn-sm"
              :disabled="chatMessagesLoadingMore"
              @click="loadChatMessages(true)"
            >
              {{ chatMessagesLoadingMore ? '載入中...' : '載入更早訊息' }}
            </button>
          </div>

          <div v-if="chatMessagesLoading" class="loading-indicator">
            載入中...
          </div>

          <div v-else-if="chatMessages.length === 0" class="chat-empty text-muted">
            此使用者暫無對話訊息記錄
          </div>

          <div v-else class="chat-message-list">
            <div
              v-for="message in chatMessages"
              :key="message.uuid"
              :class="['chat-message', `chat-message-${message.senderType}`]"
            >
              <div class="chat-room-label">
                {{ message.chatRoomTitle || '未命名聊天室' }}
              </div>
              <div class="chat-message-meta">
                <span>{{ message.senderName }}</span>
                <span>{{ formatDate(message.createdAt) }}</span>
              </div>
              <div v-if="message.content" class="chat-message-content">
                {{ message.content }}
              </div>
              <div v-if="message.attachments.length > 0" class="chat-attachments">
                <div
                  v-for="attachment in message.attachments"
                  :key="attachment.uuid"
                  class="chat-attachment"
                >
                  <img
                    v-if="isImageAttachment(attachment) && attachment.downloadUrl"
                    :src="attachment.downloadUrl"
                    :alt="attachment.fileName"
                    class="chat-attachment-image"
                  />
                  <button
                    type="button"
                    class="chat-attachment-link"
                    :disabled="!attachment.downloadUrl"
                    @click="openAttachment(attachment)"
                  >
                    <span>{{ attachment.fileName }}</span>
                    <small>{{ formatFileSize(attachment.fileSize) }}</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
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
import FooterComponent from '@/components/layout/Footer.vue';
import apiClient from '@/utils/axios';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { UserService } from '@/services';
import type { User, Note, CreateNoteDto, UpdateNoteDto, ChatMessageLog, ChatAttachmentLog } from '@/services/types';

interface ConsultationItem {
  uuid: string;
  userId?: number;
  userUuid?: string;
  lineName: string;
  name: string;
  phone: string;
  address: string;
  childName: string;
  yearSelected: string;
  weight: string;
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
      selectedItem: null as ConsultationItem | null,
      // Notes modal data
      showNotesModal: false,
      selectedUser: null as User | null,
      notes: [] as Note[],
      notesLoading: false,
      showNoteEditModal: false,
      editingNote: null as Note | null,
      editingNoteId: null as string | null,
      editNoteContent: '',
      showNoteHistoryModal: false,
      selectedNote: null as Note | null,
      // Chat messages drawer data
      selectedChatUserUuid: null as string | null,
      selectedChatUserName: '',
      chatMessages: [] as ChatMessageLog[],
      chatMessagesLoading: false,
      chatMessagesLoadingMore: false,
      showChatMessagesDrawer: false,
      chatMessagesHasMore: false,
      chatMessagesNextCursor: null as string | null,
      chatObserver: null as IntersectionObserver | null,
      noteForm: {
        content: ''
      }
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
          this.safeText(item.lineName).toLowerCase().includes(query) ||
          this.safeText(item.name).toLowerCase().includes(query) ||
          this.safeText(item.phone).toLowerCase().includes(query) ||
          this.safeText(item.yearSelected).toLowerCase().includes(query) ||
          this.safeText(item.content).toLowerCase().includes(query)
        );
      });
    }
  },
  methods: {
    async fetchConsultationData() {
      this.loading = true;
      try {
        const response = await apiClient.get('/consultation');
        this.items = response.data.map((item: Partial<ConsultationItem>) =>
          this.normalizeConsultationItem(item)
        );
      } catch (error) {
        console.error('Error fetching consultation data:', error);
      } finally {
        this.loading = false;
      }
    },
    normalizeConsultationItem(item: Partial<ConsultationItem>): ConsultationItem {
      return {
        uuid: this.safeText(item.uuid),
        userId: item.userId,
        userUuid: item.userUuid,
        lineName: this.safeText(item.lineName),
        name: this.safeText(item.name),
        phone: this.safeText(item.phone),
        address: this.safeText(item.address),
        childName: this.safeText(item.childName),
        yearSelected: this.safeText(item.yearSelected),
        weight: this.safeText(item.weight),
        primaryMedical: this.safeText(item.primaryMedical),
        topicSelected: this.safeText(item.topicSelected),
        content: this.safeText(item.content),
        createdAt: this.safeText(item.createdAt),
        updatedAt: this.safeText(item.updatedAt)
      };
    },
    safeText(value: unknown): string {
      return typeof value === 'string' ? value : '';
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
    },

    // Notes management methods
    async openNotesModal(item: ConsultationItem) {
      if (!item.userUuid) {
        await Swal.fire({
          title: '無法操作！',
          text: '此諮詢記錄沒有關聯的用戶UUID，無法管理記事本',
          icon: 'warning',
          confirmButtonText: '確定'
        })
        return
      }

      try {
        // Fetch user data first
        this.selectedUser = await UserService.getUserByUuid(item.userUuid)
        this.notes = []
        this.notesLoading = true
        this.showNotesModal = true

        // Then fetch notes
        this.notes = await UserService.getUserNotes(item.userUuid)
      } catch (error) {
        console.error('Failed to fetch user or notes:', error)
        await Swal.fire({
          title: '錯誤！',
          text: '無法載入用戶或記事本資料，請再試一次',
          icon: 'error',
          confirmButtonText: '確定'
        })
        this.closeNotesModal()
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
    },

    async openChatMessagesDrawer(item: ConsultationItem) {
      if (!item.userUuid) {
        await Swal.fire({
          title: '無法操作！',
          text: '此諮詢記錄沒有關聯的用戶UUID，無法查看對話記錄',
          icon: 'warning',
          confirmButtonText: '確定'
        })
        return
      }

      this.selectedChatUserUuid = item.userUuid
      this.selectedChatUserName = item.name || item.lineName || '未設定姓名'
      this.chatMessages = []
      this.chatMessagesHasMore = false
      this.chatMessagesNextCursor = null
      this.showChatMessagesDrawer = true
      document.addEventListener('keydown', this.handleChatDrawerKey)
      await this.loadChatMessages(false)
      this.$nextTick(() => {
        this.setupChatObserver()
      })
    },

    closeChatMessagesDrawer() {
      this.disconnectChatObserver()
      document.removeEventListener('keydown', this.handleChatDrawerKey)
      this.showChatMessagesDrawer = false
      this.selectedChatUserUuid = null
      this.selectedChatUserName = ''
      this.chatMessages = []
      this.chatMessagesHasMore = false
      this.chatMessagesNextCursor = null
    },

    handleChatDrawerKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && this.showChatMessagesDrawer) {
        this.closeChatMessagesDrawer()
      }
    },

    async loadChatMessages(loadMore = false) {
      if (!this.selectedChatUserUuid) return
      if (loadMore && (!this.chatMessagesHasMore || !this.chatMessagesNextCursor)) return
      if (this.chatMessagesLoading || this.chatMessagesLoadingMore) return

      const body = this.$refs.chatMessagesBody as HTMLElement | undefined
      const previousScrollHeight = body?.scrollHeight || 0

      if (loadMore) {
        this.chatMessagesLoadingMore = true
      } else {
        this.chatMessagesLoading = true
      }

      try {
        const page = await UserService.getUserChatMessages(this.selectedChatUserUuid, {
          limit: 100,
          before: loadMore ? this.chatMessagesNextCursor : null
        })
        const displayMessages = page.items.slice().reverse()

        if (loadMore) {
          this.chatMessages = [...displayMessages, ...this.chatMessages]
        } else {
          this.chatMessages = displayMessages
        }
        this.chatMessagesHasMore = page.hasMore
        this.chatMessagesNextCursor = page.nextCursor

        this.$nextTick(() => {
          const currentBody = this.$refs.chatMessagesBody as HTMLElement | undefined
          if (!currentBody) return

          if (loadMore) {
            currentBody.scrollTop += currentBody.scrollHeight - previousScrollHeight
          } else {
            currentBody.scrollTop = currentBody.scrollHeight
          }
        })
      } catch (error) {
        console.error('Failed to fetch chat messages:', error)
        await Swal.fire({
          title: '錯誤！',
          text: '無法載入對話訊息，請再試一次',
          icon: 'error',
          confirmButtonText: '確定'
        })
      } finally {
        this.chatMessagesLoading = false
        this.chatMessagesLoadingMore = false
      }
    },

    setupChatObserver() {
      this.disconnectChatObserver()
      const sentinel = this.$refs.chatTopSentinel as HTMLElement | undefined
      const body = this.$refs.chatMessagesBody as HTMLElement | undefined
      if (!sentinel || !body) return

      this.chatObserver = new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (
          entry.isIntersecting &&
          this.chatMessagesHasMore &&
          !this.chatMessagesLoading &&
          !this.chatMessagesLoadingMore
        ) {
          this.loadChatMessages(true)
        }
      }, {
        root: body,
        threshold: 0.1
      })
      this.chatObserver.observe(sentinel)
    },

    disconnectChatObserver() {
      if (this.chatObserver) {
        this.chatObserver.disconnect()
        this.chatObserver = null
      }
    },

    isImageAttachment(attachment: ChatAttachmentLog) {
      return attachment.attachmentType === 'image' || Boolean(attachment.fileType?.startsWith('image/'))
    },

    openAttachment(attachment: ChatAttachmentLog) {
      if (!attachment.downloadUrl) return
      window.open(attachment.downloadUrl, '_blank', 'noopener')
    },

    formatFileSize(fileSize: number | null) {
      if (!fileSize) return '大小未知'
      if (fileSize < 1024) return `${fileSize} B`
      if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`
      return `${(fileSize / 1024 / 1024).toFixed(1)} MB`
    }
  },
  mounted() {
    this.fetchConsultationData();
  },
  beforeUnmount() {
    this.disconnectChatObserver()
    document.removeEventListener('keydown', this.handleChatDrawerKey)
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
  color: #999;
}

.close:hover {
  color: #000;
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

.badge {
  cursor: pointer;
  margin-right: 0.25rem;
}

.badge:hover {
  opacity: 0.8;
}

.badge.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
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

.action-chat {
  background-color: #e7f5ff;
  color: #1971c2;
}

.chat-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(17, 24, 39, 0.48);
  display: flex;
  justify-content: flex-end;
}

.chat-drawer {
  width: min(560px, 100vw);
  height: 100vh;
  background: #f8fafc;
  box-shadow: -18px 0 40px rgba(15, 23, 42, 0.22);
  display: flex;
  flex-direction: column;
  animation: chat-drawer-slide-in 0.18s ease-out;
}

@keyframes chat-drawer-slide-in {
  from {
    transform: translateX(40px);
    opacity: 0.4;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.chat-drawer-header {
  background: #fff;
  border-bottom: 1px solid #d9e2ef;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 22px;
  flex-shrink: 0;
}

.chat-drawer-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2a44;
}

.chat-drawer-header p {
  margin: 4px 0 0;
  color: #718096;
  font-size: 0.9rem;
}

.chat-drawer-close {
  border: none;
  background: transparent;
  color: #8a94a6;
  cursor: pointer;
  font-size: 2rem;
  line-height: 1;
  padding: 0;
}

.chat-drawer-close:hover {
  color: #1f2937;
}

.chat-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 18px 16px 24px;
}

.chat-top-sentinel {
  height: 1px;
}

.chat-load-more {
  text-align: center;
  margin-bottom: 14px;
}

.chat-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.chat-message-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chat-message {
  max-width: 82%;
  border-radius: 14px;
  padding: 10px 12px;
  border-left: 4px solid #94a3b8;
  background: #fff;
  box-shadow: 0 1px 6px rgba(15, 23, 42, 0.08);
}

.chat-message-user {
  align-self: flex-start;
  border-left-color: #2563eb;
  background: #dbeafe;
}

.chat-message-consultant {
  align-self: flex-end;
  border-left-color: #0891b2;
  background: #cffafe;
}

.chat-message-system {
  align-self: center;
  border-left-color: #94a3b8;
  background: #f1f5f9;
}

.chat-room-label {
  color: #64748b;
  font-size: 0.74rem;
  margin-bottom: 5px;
}

.chat-message-meta {
  color: #475569;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  font-size: 0.78rem;
  margin-bottom: 6px;
}

.chat-message-content {
  color: #1f2937;
  font-size: 0.95rem;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-attachments {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-attachment {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chat-attachment-image {
  max-width: 240px;
  max-height: 180px;
  border-radius: 10px;
  object-fit: contain;
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.chat-attachment-link {
  border: 1px solid rgba(37, 99, 235, 0.24);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.62);
  color: #1d4ed8;
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  text-align: left;
  width: fit-content;
  max-width: 260px;
}

.chat-attachment-link:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}

.chat-attachment-link span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-attachment-link small {
  color: #64748b;
}

@media (max-width: 768px) {
  .chat-drawer {
    width: 100vw;
  }

  .chat-message {
    max-width: 92%;
  }
}
</style>
