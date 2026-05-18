import apiClient from '@/utils/axios'
import type {
  UserResponseDto,
  ChildResponseDto,
  CreateChildDto,
  UpdateChildDto,
  NoteResponseDto,
  CreateNoteDto,
  UpdateNoteDto,
  LoginCredentials,
  AuthResponse,
  Admin,
  CreateAdminDto,
  UpdateAdminDto,
  Facility,
  CreateFacilityDto,
  UpdateFacilityDto,
  Consultation,
  SourceUser,
  SourceKeywordLog,
  VaccineNotifyLog,
  ChatMessagesPage
} from './types'

/**
 * 認證相關 API
 */
export class AuthApi {
  /**
   * 管理員登入
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  }

  /**
   * 註冊新管理員 (需要 admin 權限)
   */
  static async register(adminData: CreateAdminDto): Promise<void> {
    const response = await apiClient.post('/auth/register', adminData)
    return response.data
  }

  /**
   * 取得當前登入用戶資料
   */
  static async getProfile(): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/profile')
    return response.data
  }

  /**
   * 取得管理員詳細資料
   */
  static async getAdminProfile(): Promise<Admin> {
    const response = await apiClient.get('/auth/profile')
    return response.data
  }

  /**
   * 更新管理員資料
   */
  static async updateProfile(profileData: UpdateAdminDto): Promise<void> {
    const response = await apiClient.patch('/auth/profile', profileData)
    return response.data
  }
}

/**
 * 用戶管理 API
 */
export class UserApi {
  /**
   * 取得所有用戶列表
   */
  static async getUsers(): Promise<UserResponseDto[]> {
    const response = await apiClient.get('/user')
    return response.data
  }

  /**
   * 根據 UUID 取得單一用戶資料
   */
  static async getUserById(uuid: string): Promise<UserResponseDto> {
    const response = await apiClient.get(`/user/${uuid}`)
    return response.data
  }

  /**
   * 取得用戶的小朋友資料
   */
  static async getChildren(userUuid: string): Promise<ChildResponseDto[]> {
    const response = await apiClient.get(`/user/${userUuid}/children`)
    return response.data
  }

  /**
   * 為用戶新增小朋友資料
   */
  static async createChild(userUuid: string, childData: CreateChildDto): Promise<ChildResponseDto> {
    const response = await apiClient.post(`/user/${userUuid}/children`, childData)
    return response.data
  }

  /**
   * 更新小朋友資料
   */
  static async updateChild(userUuid: string, childUuid: string, childData: UpdateChildDto): Promise<ChildResponseDto> {
    const response = await apiClient.patch(`/user/${userUuid}/children/${childUuid}`, childData)
    return response.data
  }

  /**
   * 刪除小朋友資料
   */
  static async deleteChild(userUuid: string, childUuid: string): Promise<void> {
    const response = await apiClient.delete(`/user/${userUuid}/children/${childUuid}`)
    return response.data
  }

  /**
   * 取得用戶的所有記事本
   */
  static async getNotes(userUuid: string): Promise<NoteResponseDto[]> {
    const response = await apiClient.get(`/user/${userUuid}/notes`)
    return response.data
  }

  /**
   * 根據 UUID 取得單一記事本及編輯歷史
   */
  static async getNoteById(userUuid: string, noteUuid: string): Promise<NoteResponseDto> {
    const response = await apiClient.get(`/user/${userUuid}/notes/${noteUuid}`)
    return response.data
  }

  /**
   * 為用戶建立新記事本
   */
  static async createNote(userUuid: string, noteData: CreateNoteDto): Promise<NoteResponseDto> {
    const response = await apiClient.post(`/user/${userUuid}/notes`, noteData)
    return response.data
  }

  /**
   * 更新記事本內容
   */
  static async updateNote(userUuid: string, noteUuid: string, noteData: UpdateNoteDto): Promise<NoteResponseDto> {
    const response = await apiClient.patch(`/user/${userUuid}/notes/${noteUuid}`, noteData)
    return response.data
  }

  /**
   * 刪除記事本
   */
  static async deleteNote(userUuid: string, noteUuid: string): Promise<NoteResponseDto> {
    const response = await apiClient.delete(`/user/${userUuid}/notes/${noteUuid}`)
    return response.data
  }

  /**
   * 取得有來源關聯的使用者列表
   */
  static async getSourceUsers(): Promise<SourceUser[]> {
    const response = await apiClient.get('/user/source-users')
    return response.data
  }

  /**
   * 取得疫苗提醒發送記錄
   */
  static async getVaccineNotifyLogs(): Promise<VaccineNotifyLog[]> {
    const response = await apiClient.get('/user/vaccine-notify-logs')
    return response.data
  }

  /**
   * 取得指定用戶的疫苗提醒發送記錄
   */
  static async getUserVaccineNotifyLogs(userUuid: string): Promise<VaccineNotifyLog[]> {
    const response = await apiClient.get(`/user/${userUuid}/vaccine-notify-logs`)
    return response.data
  }

  /**
   * 取得指定用戶的對話訊息記錄
   */
  static async getUserChatMessages(
    userUuid: string,
    params?: { limit?: number; before?: string | null }
  ): Promise<ChatMessagesPage> {
    const response = await apiClient.get(`/user/${userUuid}/chat-messages`, {
      params: {
        limit: params?.limit,
        before: params?.before || undefined
      }
    })
    return response.data
  }
}

/**
 * 管理員管理 API
 */
export class AdminApi {
  /**
   * 取得所有管理員列表
   */
  static async getAdmins(): Promise<Admin[]> {
    const response = await apiClient.get('/admin')
    return response.data
  }

  /**
   * 建立新管理員
   */
  static async createAdmin(adminData: CreateAdminDto): Promise<Admin> {
    const response = await apiClient.post('/admin', adminData)
    return response.data
  }

  /**
   * 根據 UUID 取得單一管理員資料
   */
  static async getAdminById(uuid: string): Promise<Admin> {
    const response = await apiClient.get(`/admin/${uuid}`)
    return response.data
  }

  /**
   * 更新管理員資料
   */
  static async updateAdmin(uuid: string, adminData: UpdateAdminDto): Promise<Admin> {
    const response = await apiClient.patch(`/admin/${uuid}`, adminData)
    return response.data
  }

  /**
   * 刪除管理員
   */
  static async deleteAdmin(uuid: string): Promise<void> {
    const response = await apiClient.delete(`/admin/${uuid}`)
    return response.data
  }
}

/**
 * 醫療機構管理 API
 */
export class FacilityApi {
  /**
   * 取得所有醫療機構列表
   */
  static async getFacilities(): Promise<Facility[]> {
    const response = await apiClient.get('/facility')
    return response.data
  }

  /**
   * 建立新醫療機構
   */
  static async createFacility(facilityData: CreateFacilityDto): Promise<Facility> {
    const response = await apiClient.post('/facility', facilityData)
    return response.data
  }

  /**
   * 根據 ID 取得單一醫療機構資料
   */
  static async getFacilityById(id: string): Promise<Facility> {
    const response = await apiClient.get(`/facility/${id}`)
    return response.data
  }

  /**
   * 更新醫療機構資料
   */
  static async updateFacility(id: string, facilityData: UpdateFacilityDto): Promise<Facility> {
    const response = await apiClient.patch(`/facility/${id}`, facilityData)
    return response.data
  }

  /**
   * 刪除醫療機構
   */
  static async deleteFacility(id: string): Promise<void> {
    const response = await apiClient.delete(`/facility/${id}`)
    return response.data
  }
}

/**
 * 諮詢記錄 API
 */
export class ConsultationApi {
  /**
   * 取得所有諮詢記錄
   */
  static async getConsultations(): Promise<Consultation[]> {
    const response = await apiClient.get('/consultation')
    return response.data
  }

  /**
   * 根據 UUID 取得單一諮詢記錄
   */
  static async getConsultationById(uuid: string): Promise<Consultation> {
    const response = await apiClient.get(`/consultation/${uuid}`)
    return response.data
  }
}

/**
 * 來源關鍵字記錄 API
 */
export class SourceKeywordLogApi {
  static async getLogs(): Promise<SourceKeywordLog[]> {
    const response = await apiClient.get('/source-keyword-log')
    return response.data
  }
}

/**
 * 統一的 API 匯出
 */
export const api = {
  auth: AuthApi,
  user: UserApi,
  admin: AdminApi,
  facility: FacilityApi,
  consultation: ConsultationApi
}

export default api
