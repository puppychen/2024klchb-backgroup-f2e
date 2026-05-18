// API Response Types based on OpenAPI specification

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// User Management Types
export interface UserContentChild {
  name?: string
  birthDate?: string
  age?: string
  weight?: string
  primary_medical?: string
  vaccineReminder?: boolean
}

export interface UserContentProfile {
  userId?: string
  displayName?: string
  pictureUrl?: string
}

export interface UserContent {
  name?: string
  phone?: string
  address?: string
  email?: string
  childes?: UserContentChild[]
  child_number?: number
  profile?: UserContentProfile
  [key: string]: any
}

export interface User {
  uuid: string
  lineId: string
  name: string | null
  pictureUrl: string | null
  content: UserContent | null
  sourceKeyword: string | null
  sourceName: string | null
  createdAt: string
  updatedAt: string
  vaccineNotifyLogCount: number
  consultationCount?: number
  latestConsultationAt?: string | null
  chatMessageCount?: number
  latestChatMessageAt?: string | null
  Children?: Child[]
  Note?: Note[]
}

export interface Child {
  uuid: string
  name: string
  birthDate: string
  createdAt: string
  updatedAt: string
}

export interface NoteEditHistory {
  uuid: string
  beforeContent: string | null
  afterContent: string | null
  createdAt: string
  updatedAt: string
}

export interface Note {
  uuid: string
  content: string
  createdAt: string
  updatedAt: string
  NoteEditHistory?: NoteEditHistory[]
}

// DTOs for API requests
export interface CreateChildDto {
  name: string
  birthDate: string
}

export interface UpdateChildDto {
  name?: string
  birthDate?: string
}

export interface CreateNoteDto {
  content: string
}

export interface UpdateNoteDto {
  content?: string
}

// Response DTOs
export interface UserResponseDto extends User {}
export interface ChildResponseDto extends Child {}
export interface NoteResponseDto extends Note {}
export interface NoteEditHistoryResponseDto extends NoteEditHistory {}

// Auth Types
export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    uuid: string
    username: string
    role: string
  }
}

// Admin Types
export interface Admin {
  uuid: string
  username: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface CreateAdminDto {
  username: string
  password: string
  role: string
}

export interface UpdateAdminDto {
  username?: string
  password?: string
  role?: string
}

// Facility Types
export interface Facility {
  id: string
  name: string
  address: string
  phone: string
  createdAt: string
  updatedAt: string
}

export interface CreateFacilityDto {
  name: string
  address: string
  phone: string
}

export interface UpdateFacilityDto {
  name?: string
  address?: string
  phone?: string
}

// Source User Types
export interface SourceUser {
  uuid: string
  lineId: string
  lineName: string | null
  sourceKeyword: string
  sourceName: string
  sourceKeywordAt: string | null
  createdAt: string
}

export interface VaccineNotifyLog {
  id: string
  sendBatchId: string
  status: 'sent' | 'failed' | string
  message: string | null
  errorMessage: string | null
  sentAt: string | null
  createdAt: string
  lineId: string
  userUuid: string
  userLineId: string
  userName: string | null
  childUuid: string
  childName: string
  childBirthday: string
  childBirthYear: string | null
  vaccineNames: string[]
  vaccineNotifyUuids: string[]
  cycleYearMonth: string | null
  attemptCount: number
  attemptedAt: string | null
}

export interface ChatAttachmentLog {
  uuid: string
  fileName: string
  fileSize: number | null
  fileType: string | null
  attachmentType: string
  status: string
  downloadUrl: string | null
  downloadUrlExpires: string | null
}

export interface ChatMessageLog {
  uuid: string
  chatRoomUuid: string
  chatRoomTitle: string | null
  content: string | null
  messageType: string
  senderType: string
  senderName: string
  attachments: ChatAttachmentLog[]
  createdAt: string
}

export interface ChatMessagesPage {
  items: ChatMessageLog[]
  hasMore: boolean
  nextCursor: string | null
}

// Consultation Types
export interface Consultation {
  uuid: string
  userId: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
}

// Source Keyword Log
export interface SourceKeywordLog {
  id: number
  uuid: string
  lineId: string
  action: 'new' | 'overwrite' | 'unchanged'
  newKeyword: string
  newSourceName: string
  oldKeyword: string | null
  oldSourceName: string | null
  createdAt: string
  userName: string | null
  userPictureUrl: string | null
}
