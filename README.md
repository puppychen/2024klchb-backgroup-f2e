# 親子照護平台後台管理系統

基於 Vue 3 + TypeScript + Vite 的醫療健康管理系統後台，提供諮詢記錄、用戶管理、醫療機構管理等功能。

## 功能特色

### 諮詢記錄管理
- **諮詢列表**: 顯示所有用戶諮詢記錄，支援搜尋和排序
- **用戶管理**: 完整的用戶資訊管理系統
  - 用戶基本資料查看（LINE ID、姓名、電話、地址）
  - 小朋友資訊管理
  - **筆記管理系統**：
    - 行內編輯功能（點擊編輯按鈕直接在原位置修改）
    - 完整內容顯示，支援長文本自動換行
    - 新增/編輯/刪除筆記
    - 顯示更新時間
    - 清潔簡約的卡片式設計

### 就醫資訊管理
- **醫療機構列表**: 醫療機構資訊的完整管理
- **機構資料編輯**: 支援醫療機構資料的新增和修改

### 系統管理
- **權限控制**: 基於角色的訪問控制（管理員/一般用戶）
- **管理員管理**: 系統管理員帳戶管理

## 技術架構

- **前端框架**: Vue 3 (Composition API + Options API)
- **類型支援**: TypeScript
- **構建工具**: Vite
- **狀態管理**: Pinia
- **路由管理**: Vue Router
- **UI 組件**: Bootstrap + 自定義樣式
- **圖標系統**: Feather Icons (SVG)
- **通知系統**: SweetAlert2
- **日期處理**: date-fns
- **HTTP 客戶端**: Axios
- **部署平台**: Firebase Hosting

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Deploy to Firebase

```sh
firebase deploy --only hosting:background-klchb
```
