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
                <div class="col-sm-4 my-2">
                  <label for="sourceTagFilter" class="form-label">來源標籤</label>
                  <select id="sourceTagFilter" class="form-control" v-model="selectedSourceTag">
                    <option value="">全部來源標籤</option>
                    <option
                      v-for="tag in sourceTagOptions"
                      :key="tag.value"
                      :value="tag.value"
                    >
                      {{ tag.label }}（{{ tag.count }}）
                    </option>
                  </select>
                </div>
                <div class="col-sm-4 my-2">
                  <label for="pediatricianFilter" class="form-label">幼兒專責醫師</label>
                  <select id="pediatricianFilter" class="form-control" v-model="selectedPediatricianStatus">
                    <option value="all">全部</option>
                    <option value="joined">已加入</option>
                    <option value="interested">有興趣了解請聯絡</option>
                    <option value="not_interested">暫無意願</option>
                    <option value="unanswered">未作答</option>
                  </select>
                </div>
              </div>

              <hr class="my-5">

              <div v-if="loading" class="loading-indicator">
                Loading...
              </div>

              <div v-else class="user-table-scroll">
                <table id="user-list" class="table dt-table-hover user-table">
                  <thead>
                    <tr>
                      <th class="line-name-column">Line 名稱</th>
                      <th class="set-name-column">姓名</th>
                      <th class="phone-column">電話</th>
                      <th class="address-column">地址</th>
                      <th class="source-column">來源</th>
                      <th class="date-column">最新諮詢</th>
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
                      <td class="phone-column">
                        <span v-if="user.content?.phone">{{ user.content.phone }}</span>
                        <span v-else class="text-muted">-</span>
                      </td>
                      <td class="address-column">
                        <span v-if="user.content?.address" :title="user.content.address">{{ formatAddress(user.content.address) }}</span>
                        <span v-else class="text-muted">-</span>
                      </td>
                      <td class="source-column">
                        <span v-if="user.sourceName" class="badge badge-light-primary">{{ user.sourceName }}</span>
                        <span v-else-if="user.sourceKeyword" class="badge badge-light-secondary">{{ user.sourceKeyword }}</span>
                        <span v-else class="text-muted">-</span>
                      </td>
                      <td class="date-column">
                        <span v-if="user.latestConsultationAt">{{ formatShortDate(user.latestConsultationAt) }}</span>
                        <span v-else class="text-muted">{{ formatShortDate(user.createdAt) }}</span>
                      </td>
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
                      <a :class="vaccineNotifyActionClass(user)"
                         @click="openVaccineNotifyLogsModal(user)"
                         :title="vaccineNotifyActionTitle(user)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <span v-if="user.vaccineNotifyLogCount > 0"
                              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary"
                              style="font-size: 10px;">
                          {{ user.vaccineNotifyLogCount }}
                        </span>
                      </a>
                      <a :class="chatMessagesActionClass(user)"
                         @click="openChatMessagesDrawer(user)"
                         :title="chatMessagesActionTitle(user)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
                        </svg>
                        <span v-if="(user.chatMessageCount ?? 0) > 0"
                              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary"
                              style="font-size: 10px;">
                          {{ user.chatMessageCount }}
                        </span>
                      </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

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
          <p><strong>來源:</strong> {{ selectedUser.sourceName || selectedUser.sourceKeyword || '未設定' }}</p>
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
                  <th>幼兒專責醫師</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(child, index) in children" :key="index">
                  <td>{{ child.name || '-' }}</td>
                  <td>{{ child.birthDate || '-' }}</td>
                  <td>{{ child.age || (child.birthDate ? calculateAge(child.birthDate) + ' 歲' : '-') }}</td>
                  <td>{{ child.weight || '-' }}</td>
                  <td>{{ child.primary_medical || '-' }}</td>
                  <td>{{ pediatricianStatusText(child) }}</td>
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

    <!-- Vaccine Notify Logs Modal -->
    <div v-if="showVaccineNotifyLogsModal" class="modal" @click.self="closeVaccineNotifyLogsModal">
      <div class="modal-content modal-vaccine-logs">
        <div class="vaccine-logs-header">
          <h2>{{ selectedUser?.content?.name || selectedUser?.name || '未設定姓名' }} 的疫苗提醒記錄</h2>
          <button type="button" class="vaccine-logs-close" @click="closeVaccineNotifyLogsModal" aria-label="關閉">
            &times;
          </button>
        </div>

        <div v-if="vaccineNotifyLogsLoading" class="loading-indicator">
          載入中...
        </div>

        <div v-else-if="vaccineNotifyLogs.length > 0" class="vaccine-logs-table-wrap">
          <table class="table table-striped vaccine-logs-table">
            <thead>
              <tr>
                <th>發送時間</th>
                <th>狀態</th>
                <th>小朋友</th>
                <th>出生年月</th>
                <th>疫苗項目</th>
                <th>訊息內容</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in vaccineNotifyLogs" :key="log.id">
                <td>{{ formatDate(log.sentAt || log.createdAt) }}</td>
                <td>
                  <span :class="statusBadgeClass(log.status)">
                    {{ statusLabel(log.status) }}
                  </span>
                </td>
                <td>
                  {{ log.childName }}
                  <small class="text-muted d-block">{{ log.childBirthday }}</small>
                </td>
                <td>{{ formatBirthYearMonth(log.childBirthday) }}</td>
                <td class="vaccine-names-cell">{{ log.vaccineNames.join('、') || '-' }}</td>
                <td>
                  <pre class="vaccine-message">{{ log.message || '無訊息內容' }}</pre>
                  <div v-if="log.errorMessage" class="text-danger small mt-2">
                    錯誤：{{ log.errorMessage }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="vaccine-logs-empty text-muted">
          <p>此使用者暫無可追蹤的疫苗提醒記錄</p>
        </div>
      </div>
    </div>

    <!-- Chat Messages Drawer -->
    <div v-if="showChatMessagesDrawer" class="chat-drawer-backdrop" @click.self="closeChatMessagesDrawer">
      <aside class="chat-drawer" role="dialog" aria-modal="true" aria-label="對話記錄">
        <div class="chat-drawer-header">
          <div>
            <h2>對話記錄</h2>
            <p>{{ selectedUser?.content?.name || selectedUser?.name || '未設定姓名' }}</p>
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
import FooterComponent from '@/components/layout/Footer.vue'
import { format } from 'date-fns'
import Swal from 'sweetalert2'
import { UserService } from '@/services'
import type { User, Note, CreateNoteDto, UpdateNoteDto, VaccineNotifyLog, ChatMessageLog, ChatAttachmentLog, UserContentChild } from '@/services/types'

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
      vaccineNotifyLogs: [] as VaccineNotifyLog[],
      chatMessages: [] as ChatMessageLog[],
      loading: false,
      notesLoading: false,
      vaccineNotifyLogsLoading: false,
      chatMessagesLoading: false,
      chatMessagesLoadingMore: false,
      showUserDetailModal: false,
      showChildrenModal: false,
      showNotesModal: false,
      showVaccineNotifyLogsModal: false,
      showChatMessagesDrawer: false,
      showNoteEditModal: false,
      showNoteDetailModal: false,
      showNoteHistoryModal: false,
      chatMessagesHasMore: false,
      chatMessagesNextCursor: null as string | null,
      chatObserver: null as IntersectionObserver | null,
      editingNote: null as Note | null,
      editingNoteId: null as string | null,
      editNoteContent: '',
      searchQuery: '',
      selectedSourceTag: '',
      // 幼兒專責醫師篩選（UI sentinel，與資料層 '' 未作答分離）
      selectedPediatricianStatus: 'all' as 'all' | 'joined' | 'interested' | 'not_interested' | 'unanswered',
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
      let users = this.users
      if (this.selectedSourceTag) {
        users = users.filter((user: User) =>
          this.sourceTagValue(user) === this.selectedSourceTag
        )
      }

      // 幼兒專責醫師狀態篩選（per-child，任一小孩符合即列出）
      if (this.selectedPediatricianStatus !== 'all') {
        const target = this.selectedPediatricianStatus
        users = users.filter((user: User) => {
          const childes = user.content?.childes || []
          if (target === 'unanswered') {
            // 排除完全無小孩資料者（尚未填基本資料）；有小孩但任一未填 → 待追蹤
            return childes.length > 0 && childes.some((c) => !c.pediatricianStatus)
          }
          return childes.some((c) => c.pediatricianStatus === target)
        })
      }

      if (!this.searchQuery) {
        return users
      }
      const query = this.searchQuery.trim().toLowerCase()
      if (!query) {
        return users
      }
      return users.filter((user: User) => {
        if (this.matchesInfoTag(user, query)) {
          return true
        }

        return user.lineId.toLowerCase().includes(query) ||
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.content?.name && user.content.name.toLowerCase().includes(query)) ||
          (user.content?.phone && user.content.phone.toLowerCase().includes(query)) ||
          (user.content?.address && user.content.address.toLowerCase().includes(query)) ||
          (user.sourceKeyword && user.sourceKeyword.toLowerCase().includes(query)) ||
          (user.sourceName && user.sourceName.toLowerCase().includes(query))
      })
    },
    sourceTagOptions() {
      const tagMap = new Map<string, { value: string; label: string; count: number }>()
      this.users.forEach((user: User) => {
        const value = this.sourceTagValue(user)
        if (!value) return

        const label = user.sourceName || user.sourceKeyword || value
        const current = tagMap.get(value)
        if (current) {
          current.count += 1
        } else {
          tagMap.set(value, { value, label, count: 1 })
        }
      })

      return [...tagMap.values()].sort((a, b) => a.label.localeCompare(b.label, 'zh-Hant'))
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    },
    selectedSourceTag() {
      this.currentPage = 1
    },
    selectedPediatricianStatus() {
      this.currentPage = 1
    }
  },
  methods: {
    // 幼兒專責醫師狀態轉中文（joined 另附診所名）
    pediatricianStatusText(child: UserContentChild) {
      const map: Record<string, string> = {
        joined: '已加入',
        interested: '有興趣了解請聯絡',
        not_interested: '暫無意願'
      }
      const status = child?.pediatricianStatus || ''
      const label = map[status] || '未作答'
      if (status === 'joined' && child?.pediatricianClinic?.name) {
        return `${label}（${child.pediatricianClinic.name}）`
      }
      return label
    },
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

    matchesInfoTag(user: User, query: string) {
      const tagMatchers: Record<string, boolean> = {
        '已填資料': Boolean(user.content?.name),
        '孩子': Boolean(user.content?.childes && user.content.childes.length > 0),
        '記事': Boolean(user.Note && user.Note.length > 0),
        '疫苗': user.vaccineNotifyLogCount > 0,
        '對話': (user.chatMessageCount ?? 0) > 0
      }

      return Object.entries(tagMatchers).some(([tag, matched]) =>
        tag.includes(query) && matched
      )
    },

    sourceTagValue(user: User) {
      return user.sourceKeyword || user.sourceName || ''
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

    async openVaccineNotifyLogsModal(user: User) {
      this.selectedUser = user
      this.vaccineNotifyLogs = []
      this.vaccineNotifyLogsLoading = true
      this.showVaccineNotifyLogsModal = true

      try {
        const logs = await UserService.getUserVaccineNotifyLogs(user.uuid)
        this.vaccineNotifyLogs = logs.slice().sort(
          (a, b) =>
            new Date(b.sentAt || b.createdAt).getTime() -
            new Date(a.sentAt || a.createdAt).getTime()
        )
      } catch (error) {
        console.error('Failed to fetch vaccine notify logs:', error)
        await Swal.fire({
          title: '錯誤！',
          text: '無法載入疫苗提醒記錄，請再試一次',
          icon: 'error',
          confirmButtonText: '確定'
        })
      } finally {
        this.vaccineNotifyLogsLoading = false
      }
    },

    closeVaccineNotifyLogsModal() {
      this.showVaccineNotifyLogsModal = false
      this.selectedUser = null
      this.vaccineNotifyLogs = []
    },

    vaccineNotifyActionClass(user: User) {
      const baseClass = 'badge text-start me-2 action-vaccine position-relative'
      return user.vaccineNotifyLogCount > 0
        ? `${baseClass} badge-primary`
        : `${baseClass} badge-light-secondary vaccine-no-logs`
    },

    vaccineNotifyActionTitle(user: User) {
      return user.vaccineNotifyLogCount > 0
        ? `${user.vaccineNotifyLogCount} 筆疫苗提醒記錄`
        : '尚無疫苗提醒記錄'
    },

    chatMessagesActionClass(user: User) {
      const baseClass = 'badge text-start me-2 action-chat position-relative'
      return (user.chatMessageCount ?? 0) > 0
        ? `${baseClass} badge-info`
        : `${baseClass} badge-light-secondary chat-no-messages`
    },

    chatMessagesActionTitle(user: User) {
      return (user.chatMessageCount ?? 0) > 0
        ? `${user.chatMessageCount} 則對話訊息`
        : '尚無對話訊息'
    },

    async openChatMessagesDrawer(user: User) {
      this.selectedUser = user
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
      this.selectedUser = null
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
      if (!this.selectedUser) return
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
        const page = await UserService.getUserChatMessages(this.selectedUser.uuid, {
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

    formatAddress(address: string) {
      if (!address) return ''
      return address.length > 12 ? `${address.substring(0, 12)}...` : address
    },

    formatShortDate(dateString: string) {
      if (!dateString) return ''
      return format(new Date(dateString), 'yyyy/MM/dd')
    },

    formatBirthYearMonth(birthday: string | null) {
      if (!birthday) return '-'
      const match = birthday.match(/^(\d{4})[-/](\d{1,2})/)
      if (!match) return '-'
      return `${match[1]}/${match[2].padStart(2, '0')}`
    },

    statusLabel(status: string) {
      if (status === 'sent') return '成功'
      if (status === 'failed') return '失敗'
      return status
    },

    statusBadgeClass(status: string) {
      if (status === 'sent') return 'badge badge-light-success'
      if (status === 'failed') return 'badge badge-light-danger'
      return 'badge badge-light-secondary'
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
  },

  beforeUnmount() {
    this.disconnectChatObserver()
    document.removeEventListener('keydown', this.handleChatDrawerKey)
  }
}
</script>

<style scoped>
.line-name-column {
  width: 170px;
  white-space: normal;
}

.set-name-column {
  width: 120px;
  white-space: normal;
}

.phone-column {
  width: 120px;
  word-wrap: break-word;
  word-break: break-all;
}

.address-column {
  width: 150px;
  word-break: break-word;
}

.source-column {
  width: 120px;
}

.date-column {
  width: 110px;
}

.actions-column {
  width: 260px;
}

.user-table-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
}

.user-table {
  width: 100%;
  min-width: 1050px;
  table-layout: fixed;
  margin-bottom: 0;
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

.action-vaccine {
  color: #fff;
}

.vaccine-no-logs {
  color: inherit;
  opacity: 0.45;
}

.action-chat {
  color: #fff;
}

.chat-no-messages {
  color: inherit;
  opacity: 0.45;
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

.modal-vaccine-logs {
  width: min(860px, 86vw);
  max-width: none;
  min-height: 0;
  max-height: calc(100vh - 96px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

.vaccine-logs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
}

.vaccine-logs-header h2 {
  margin: 0;
  font-size: 1.4rem;
  line-height: 1.35;
}

.vaccine-logs-close {
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  font-size: 2rem;
  line-height: 1;
  padding: 0 4px;
}

.vaccine-logs-close:hover {
  color: #000;
}

.vaccine-logs-table-wrap {
  overflow: auto;
  padding: 16px 20px 20px;
}

.vaccine-logs-table {
  min-width: 900px;
  table-layout: fixed;
  margin-bottom: 0;
}

.vaccine-logs-table th:nth-child(1),
.vaccine-logs-table td:nth-child(1) {
  width: 120px;
}

.vaccine-logs-table th:nth-child(2),
.vaccine-logs-table td:nth-child(2) {
  width: 72px;
}

.vaccine-logs-table th:nth-child(3),
.vaccine-logs-table td:nth-child(3) {
  width: 96px;
}

.vaccine-logs-table th:nth-child(4),
.vaccine-logs-table td:nth-child(4) {
  width: 140px;
}

.vaccine-logs-table th:nth-child(5),
.vaccine-logs-table td:nth-child(5) {
  width: 72px;
}

.vaccine-logs-table th:nth-child(6),
.vaccine-logs-table td:nth-child(6) {
  width: 160px;
}

.vaccine-logs-table th:nth-child(7),
.vaccine-logs-table td:nth-child(7) {
  width: 300px;
}

.vaccine-names-cell {
  word-break: break-word;
}

.vaccine-logs-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 24px;
  text-align: center;
}

.vaccine-message {
  white-space: pre-wrap;
  word-break: break-word;
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 8px;
  max-height: 140px;
  overflow-y: auto;
  margin-bottom: 0;
  font-size: 0.82rem;
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
  .modal-vaccine-logs {
    width: calc(100vw - 24px);
    max-height: calc(100vh - 24px);
  }

  .vaccine-logs-header {
    padding: 16px;
  }

  .vaccine-logs-header h2 {
    font-size: 1.15rem;
  }

  .vaccine-logs-table-wrap {
    padding: 12px;
  }

  .chat-drawer {
    width: 100vw;
  }

  .chat-message {
    max-width: 92%;
  }
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
