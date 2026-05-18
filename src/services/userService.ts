import { UserApi } from './api'
import type { 
  User, 
  Child, 
  Note, 
  CreateChildDto, 
  UpdateChildDto, 
  CreateNoteDto, 
  UpdateNoteDto,
  VaccineNotifyLog,
  ChatMessagesPage
} from './types'

/**
 * 用戶服務層 - 封裝用戶相關的業務邏輯
 * 提供高階的業務方法，處理複雜的操作流程
 */
export class UserService {
  /**
   * 取得所有用戶列表 (含搜尋功能)
   */
  static async getUserList(searchQuery?: string): Promise<User[]> {
    const users = await UserApi.getUsers()
    
    if (!searchQuery) {
      return users
    }

    const query = searchQuery.toLowerCase()
    return users.filter(user =>
      user.lineId.toLowerCase().includes(query) ||
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.content?.name && user.content.name.toLowerCase().includes(query)) ||
      (user.content?.phone && user.content.phone.toLowerCase().includes(query)) ||
      (user.content?.address && user.content.address.toLowerCase().includes(query))
    )
  }

  /**
   * 取得用戶詳細資料
   */
  static async getUserDetail(uuid: string): Promise<User> {
    return await UserApi.getUserById(uuid)
  }

  /**
   * 根據UUID取得用戶 (別名方法，用於與 getUserDetail 保持一致性)
   */
  static async getUserByUuid(uuid: string): Promise<User> {
    return await UserApi.getUserById(uuid)
  }

  /**
   * 取得用戶的小朋友列表
   */
  static async getUserChildren(userUuid: string): Promise<Child[]> {
    return await UserApi.getChildren(userUuid)
  }

  /**
   * 新增小朋友資料
   */
  static async addChild(userUuid: string, childData: CreateChildDto): Promise<Child> {
    return await UserApi.createChild(userUuid, childData)
  }

  /**
   * 更新小朋友資料
   */
  static async updateChild(userUuid: string, childUuid: string, childData: UpdateChildDto): Promise<Child> {
    return await UserApi.updateChild(userUuid, childUuid, childData)
  }

  /**
   * 刪除小朋友資料
   */
  static async deleteChild(userUuid: string, childUuid: string): Promise<void> {
    return await UserApi.deleteChild(userUuid, childUuid)
  }

  /**
   * 取得用戶的記事本列表
   */
  static async getUserNotes(userUuid: string): Promise<Note[]> {
    return await UserApi.getNotes(userUuid)
  }

  /**
   * 取得記事本詳細資料含編輯歷史
   */
  static async getNoteDetail(userUuid: string, noteUuid: string): Promise<Note> {
    return await UserApi.getNoteById(userUuid, noteUuid)
  }

  /**
   * 新增記事本
   */
  static async createNote(userUuid: string, noteData: CreateNoteDto): Promise<Note> {
    return await UserApi.createNote(userUuid, noteData)
  }

  /**
   * 更新記事本 (僅內容更新)
   */
  static async updateNoteContent(userUuid: string, noteUuid: string, content: string): Promise<Note> {
    return await UserApi.updateNote(userUuid, noteUuid, { content })
  }

  /**
   * 更新記事本 (完整更新)
   */
  static async updateNote(userUuid: string, noteUuid: string, noteData: UpdateNoteDto): Promise<Note> {
    return await UserApi.updateNote(userUuid, noteUuid, noteData)
  }

  /**
   * 刪除記事本
   */
  static async deleteNote(userUuid: string, noteUuid: string): Promise<Note> {
    return await UserApi.deleteNote(userUuid, noteUuid)
  }

  /**
   * 取得用戶的疫苗提醒發送記錄
   */
  static async getUserVaccineNotifyLogs(userUuid: string): Promise<VaccineNotifyLog[]> {
    return await UserApi.getUserVaccineNotifyLogs(userUuid)
  }

  /**
   * 取得用戶的 Chime 對話訊息記錄
   */
  static async getUserChatMessages(
    userUuid: string,
    params?: { limit?: number; before?: string | null }
  ): Promise<ChatMessagesPage> {
    return await UserApi.getUserChatMessages(userUuid, params)
  }

  /**
   * 計算年齡的輔助方法
   */
  static calculateAge(birthDate: string): number {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  /**
   * 格式化用戶資料的輔助方法
   */
  static formatUserData(user: User): {
    displayName: string
    fullName: string
    phone: string
    address: string
    email: string
    pictureUrl: string | null
    sourceKeyword: string | null
  } {
    return {
      displayName: user.name || '未設定',
      fullName: user.content?.name || '未設定',
      phone: user.content?.phone || '未設定',
      address: user.content?.address || '未設定',
      email: user.content?.email || '未設定',
      pictureUrl: user.pictureUrl || null,
      sourceKeyword: user.sourceKeyword || null
    }
  }
}
