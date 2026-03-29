# PROJECT_CONTEXT.md - 後台管理前端

## 專案概述

基隆親子照護平台管理後台前端，Vue 3 + TypeScript 管理介面，部署於 Firebase Hosting。

## 技術棧

- **Frontend Framework**: Vue 3 (Options API + Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router (含認證守衛)
- **HTTP Client**: Axios (JWT interceptors)
- **UI**: Custom CSS + Bootstrap + Feather SVG Icons + SweetAlert2
- **Deployment**: Firebase Hosting (`background-klchb`)

## 功能頁面

### 1. 諮詢記錄管理
- **諮詢列表** (`/ConList`): 所有用戶諮詢記錄，支援搜尋、排序、詳細內容查看

### 2. 用戶管理 (`/UserList`)

#### 列表欄位對應

| UI 欄位 | 資料來源 | 說明 |
|---------|---------|------|
| Line 名稱 | `users.name` | 由後端 backfill 從 LINE API 或 content.profile.displayName 補回 |
| 設定名稱 | `content.name` | LIFF 表單自填姓名 |
| 地址 | `content.address` | LIFF 表單自填地址（列表顯示前 5 字） |
| 來源 | `sourceName` / `sourceKeyword` | 從 source_keywords 資料表對應 |
| 已填資料 | `content.name` 是否有值 | badge 顯示 |
| X 位孩子 | `content.childes.length` | LIFF 表單填寫的小朋友數量 |
| X 筆記事 | `Note.length` | Prisma Note 關聯 |

#### Modal 系統
- **用戶詳細資料**: LINE ID、LINE 名稱、姓名、電話、地址、來源、完整 content JSON
- **小朋友資訊**: 讀取 `content.childes`，顯示姓名、出生日期、年齡、體重(kg)、主要醫療院所
- **記事本管理**: CRUD、行內編輯、編輯歷史追蹤

### 3. 幼兒專責關聯資訊 (`/SourceUserList`)
- LINE 名稱（含 content.profile.displayName fallback）
- 來源名稱（source_keywords 資料表對應）
- 關聯時間、加入時間
- 搜尋和分頁

### 4. 就醫資訊管理
- **醫療機構列表** (`/FacilityList`): 機構 CRUD
- **機構資料編輯** (`/FacilityEdit/:id`)

### 5. 系統管理
- **管理員管理** (`/SysUserList`): 管理員帳戶 CRUD（僅 admin 角色可見）
- **個人資料管理**: 密碼修改等

## 服務層架構

```
src/services/
├── types.ts        # TypeScript 介面（User, UserContent, Note, SourceUser 等）
├── api.ts          # API 類別（AuthApi, UserApi, AdminApi, FacilityApi, ConsultationApi）
├── userService.ts  # 用戶業務邏輯（搜尋過濾、年齡計算、資料格式化）
└── index.ts        # 統一匯出
```

## 關鍵資料結構

### UserContent (content JSON)

使用者透過 LIFF 表單填寫的資料：
- `name`: 設定名稱
- `phone`: 電話
- `address`: 地址
- `childes[]`: 小朋友陣列（name, birthDate, age, weight, primary_medical, vaccineReminder）
- `profile`: LINE profile 資料（displayName, pictureUrl, userId）
- `child_number`: 小朋友數量

### Children 資料來源說明

前端小朋友 badge 和 modal **使用 `content.childes`**（LIFF 表單填寫），不使用 Prisma `Children` 資料表關聯。
