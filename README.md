# 遠距諮詢管理後台系統 (KLCHB)

基於 Vue 3 + TypeScript + Vite 的醫療健康管理系統後台，提供諮詢記錄、用戶管理、醫療機構管理等功能。

## ✨ 最新更新 (2024)

### 🏗️ 專業服務層架構
- **完整重構**: 建立專業的後端 API 服務層架構
- **類型安全**: 完整的 TypeScript 類型定義與支援
- **模組化設計**: 清楚分離 API 層、服務層和 UI 層

### 📝 記事本管理系統
- **全面更新**: 將「筆記」統一改為「記事本」用詞
- **後端整合**: 完全整合真實後端 API，移除所有 mock data
- **編輯歷史**: 支援記事本編輯歷史追蹤功能

## 功能特色

### 諮詢記錄管理
- **諮詢列表** (`/ConList`): 顯示所有用戶諮詢記錄，支援搜尋和排序
- **用戶管理** (`/UserList`): 完整的用戶資訊管理系統
  - 用戶基本資料查看（LINE ID、姓名、電話、地址）
  - 小朋友資訊管理（查看孩子的姓名、出生日期、年齡）
  - **進階記事本管理系統**：
    - 行內編輯功能：點擊編輯按鈕直接在原位置修改記事本內容
    - 完整內容顯示：支援長文本自動換行，無字數限制
    - CRUD 操作：新增、編輯、刪除記事本
    - 編輯歷史：顯示完整的記事本編輯歷史記錄
    - 時間戳記：顯示每筆記錄的最後更新時間
    - 優化的使用者介面：清潔簡約的卡片式設計

### 就醫資訊管理
- **醫療機構列表** (`/FacilityList`): 醫療機構資訊的完整管理
- **機構資料編輯** (`/FacilityEdit/:id`): 支援醫療機構資料的新增和修改

### 系統管理
- **權限控制**: 基於角色的訪問控制（管理員/一般用戶）
- **管理員管理** (`/SysUserList`): 系統管理員帳戶管理（僅管理員可見）
- **個人資料管理**: 已認證用戶的個人資料編輯

### 響應式管理後台
- 側邊欄導航系統
- 麵包屑導航
- 分頁功能支援（每頁 50 筆）
- 搜尋和篩選功能

## 技術架構

### 核心技術堆疊
- **前端框架**: Vue 3 (Composition API + Options API)
- **類型支援**: TypeScript 嚴格模式
- **構建工具**: Vite + Vue DevTools 整合
- **狀態管理**: Pinia 全域狀態管理
- **路由管理**: Vue Router 含身份驗證防護
- **HTTP 客戶端**: Axios 含 JWT 攔截器
- **UI 框架**: 自定義 CSS + 廣泛的預建組件
- **身份驗證**: JWT 基礎，含自動令牌過期處理

### 專業服務層架構
```
src/services/
├── types.ts          # TypeScript 介面定義
├── api.ts            # 底層 API 服務類別
├── userService.ts    # 用戶業務邏輯服務
└── index.ts          # 統一匯出
```

#### 主要服務類別
- **`AuthApi`** - 認證管理 (登入、註冊、個人資料)
- **`UserApi`** - 用戶管理 (CRUD、小朋友、記事本)
- **`AdminApi`** - 管理員管理
- **`FacilityApi`** - 醫療機構管理
- **`ConsultationApi`** - 諮詢記錄管理
- **`UserService`** - 高階用戶業務邏輯

### 關鍵架構模式
1. **身份驗證流程**: JWT 令牌存儲在 localStorage，含自動過期檢查和 401 回應處理
2. **路由保護**: 全域路由防護，未認證用戶重導向至登入頁
3. **API 整合**: 集中式 axios 實例，含請求/回應攔截器進行令牌管理
4. **組件架構**: Options API 和 Composition API 混合，含基於登入狀態的條件布局渲染
5. **狀態管理**: Pinia stores 用於身份驗證狀態，含 localStorage 持久化

### 環境配置
- 使用 `import.meta.env.VITE_BACKEND_HOST` 作為 API 基礎 URL
- Firebase 部署配置為 SPA 路由，含後備至 index.html

## 圖標和設計系統
- **圖標**: 統一使用 Feather SVG icons
- **通知系統**: SweetAlert2 用戶友好提示
- **日期處理**: date-fns 函式庫
- **響應式設計**: Bootstrap 整合

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (請停用 Vetur)

## Type Support for `.vue` Imports in TS

TypeScript 預設無法處理 `.vue` 匯入的類型資訊，所以我們使用 `vue-tsc` 替代 `tsc` CLI 進行類型檢查。在編輯器中，需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 讓 TypeScript 語言服務識別 `.vue` 類型。

## 專案設置

```sh
npm install
```

### 開發模式編譯和熱重載

```sh
npm run dev
```

### 類型檢查、編譯和生產環境最小化

```sh
npm run build
```

### 類型檢查

```sh
npm run type-check
```

### 程式碼品質檢查

```sh
npm run lint
```

### 程式碼格式化

```sh
npm run format
```

### 預覽生產環境版本

```sh
npm run preview
```

### 部署至 Firebase

```sh
firebase deploy --only hosting:background-klchb
```

## 🚀 開發注意事項

### 重要提醒
- 所有用戶管理功能已完全整合後端 API
- 記事本管理系統支援完整的 CRUD 操作和編輯歷史追蹤
- 已移除所有 mock data，現在使用真實後端服務
- 用詞已統一從「筆記」更新為「記事本」

### 代碼品質
- 完整的 TypeScript 類型支援
- 通過類型檢查和 ESLint 驗證
- 專業的錯誤處理和用戶體驗
- 模組化的服務架構便於維護和擴展

---

**© 2024 遠距諮詢管理後台系統 - 專業醫療健康管理平台**