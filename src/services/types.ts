// API Response Types based on OpenAPI specification

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// User Management Types
export interface UserContent {
  name?: string
  phone?: string
  address?: string
  email?: string
  [key: string]: any
}

export interface User {
  uuid: string
  lineId: string
  name: string | null
  content: UserContent | null
  createdAt: string
  updatedAt: string
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

// Consultation Types
export interface Consultation {
  uuid: string
  userId: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
}