# 快速入門指南：AWS 證照考題複習網頁

**功能**: AWS 證照考題複習網頁
**建立日期**: 2025-11-08
**目標讀者**: 開發人員

## 專案概述

這是一個基於 Vue 3 + TypeScript + Vite 的 AWS 證照考題複習網頁應用程式。支援中英文雙語切換、題目區塊化顯示、答案摺疊功能和分頁導航。

### 技術棧
- **前端框架**: Vue 3 (Composition API)
- **語言**: TypeScript 5.x
- **樣式**: SCSS
- **建構工具**: Vite 4+
- **測試**: Vitest + Vue Test Utils
- **部署**: 靜態網站託管

## 開發環境設置

### 系統需求
- Node.js 18.0 或更高版本
- npm 9.0 或更高版本（推薦使用 npm）
- 支援 ES2022 的現代瀏覽器

### 安裝步驟

1. **克隆專案**（如果從 Git 倉庫開始）
   ```bash
   git clone <repository-url>
   cd spec-kit-aws-question-web
   ```

2. **初始化 Vue 3 + Vite 專案**（如果從零開始）
   ```bash
   npm create vue@latest aws-exam-web
   cd aws-exam-web

   # 在創建過程中選擇：
   # ✅ TypeScript
   # ✅ Router (for future use)
   # ✅ ESLint
   # ✅ Prettier
   # ❌ JSX (不需要)
   # ✅ Vitest (for testing)
   # ❌ E2E Testing (暫不需要)
   ```

3. **安裝依賴**
   ```bash
   npm install
   ```

4. **額外安裝 SCSS 支援**
   ```bash
   npm install -D sass
   ```

5. **複製題目資料檔案**
   ```bash
   # 將 questions.js 複製到 src/assets/data/ 目錄
   mkdir -p src/assets/data
   cp /path/to/questions.js src/assets/data/
   ```

### 專案結構建立

建立以下目錄結構：

```bash
# 建立組件目錄
mkdir -p src/components/common

# 建立 Composables 目錄
mkdir -p src/composables

# 建立型別定義目錄
mkdir -p src/types

# 建立工具函數目錄
mkdir -p src/utils

# 建立樣式目錄
mkdir -p src/assets/styles/components

# 建立測試目錄
mkdir -p tests/unit/components
mkdir -p tests/unit/composables
```

## 開發流程

### 1. 啟動開發伺服器

```bash
# 啟動開發伺服器
npm run dev

# 預設會在 http://localhost:5173 啟動
```

### 2. 程式碼品質檢查

```bash
# ESLint 檢查
npm run lint

# 自動修復 ESLint 錯誤
npm run lint:fix

# Prettier 格式化
npm run format
```

### 3. 執行測試

```bash
# 執行所有測試
npm run test

# 監聽模式執行測試
npm run test:watch

# 測試覆蓋率報告
npm run test:coverage
```

### 4. 建構生產版本

```bash
# 建構生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 核心開發任務

### Phase 1: 基礎設置 (P1 優先級)

1. **設定 TypeScript 配置**
   - 複製 `contracts/types.ts` 到 `src/types/`
   - 設定嚴格型別檢查

2. **建立核心 Composables**
   ```bash
   # 建立基礎 Composables
   touch src/composables/useQuestions.ts
   touch src/composables/useLanguage.ts
   touch src/composables/usePagination.ts
   touch src/composables/useCollapsedStates.ts
   ```

3. **建立核心組件**
   ```bash
   # 建立主要組件
   touch src/components/QuestionCard.vue
   touch src/components/LanguageToggle.vue
   touch src/components/Pagination.vue
   ```

4. **設定 SCSS 樣式架構**
   ```bash
   # 建立樣式檔案
   touch src/assets/styles/main.scss
   touch src/assets/styles/variables.scss
   touch src/assets/styles/components/question-card.scss
   touch src/assets/styles/components/pagination.scss
   ```

### Phase 2: 核心功能實作

1. **實作題目資料載入**
   - 實作 `useQuestions` Composable
   - 處理 questions.js 資料載入和驗證

2. **實作題目顯示組件**
   - 建立 `QuestionCard.vue` 組件
   - 實作答案和詳解的摺疊功能

3. **實作分頁功能**
   - 建立 `Pagination.vue` 組件
   - 實作 `usePagination` Composable

4. **實作語言切換**
   - 建立 `LanguageToggle.vue` 組件
   - 實作 `useLanguage` Composable

### Phase 3: 整合與優化

1. **整合所有組件到主應用**
   - 更新 `App.vue`
   - 處理全域狀態管理

2. **實作本地儲存**
   - 儲存語言偏好
   - 儲存頁面狀態和摺疊狀態

3. **響應式設計**
   - 手機版面適配
   - 平板版面適配

## 測試策略

### 單元測試

每個 Composable 和工具函數都需要對應的測試檔案：

```bash
# Composables 測試
tests/unit/composables/useQuestions.test.ts
tests/unit/composables/useLanguage.test.ts
tests/unit/composables/usePagination.test.ts

# 組件測試
tests/unit/components/QuestionCard.test.ts
tests/unit/components/Pagination.test.ts
tests/unit/components/LanguageToggle.test.ts
```

### 測試覆蓋率目標
- **Composables**: 90% 以上
- **組件**: 80% 以上
- **工具函數**: 95% 以上

### 測試範例

```bash
# 建立測試檔案範例
cat > tests/unit/composables/useQuestions.test.ts << 'EOF'
import { describe, it, expect } from 'vitest'
import { useQuestions } from '@/composables/useQuestions'

describe('useQuestions', () => {
  it('should load questions correctly', async () => {
    const { questions, isLoading } = useQuestions()

    expect(isLoading.value).toBe(true)
    // 等待載入完成
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(questions.value.length).toBeGreaterThan(0)
  })
})
EOF
```

## 部署指南

### 建構優化

1. **環境變數設定**
   ```bash
   # .env.production
   VITE_APP_TITLE=AWS證照考題複習
   VITE_BASE_URL=/
   ```

2. **建構命令**
   ```bash
   npm run build
   ```

3. **輸出檔案**
   - 建構後的檔案位於 `dist/` 目錄
   - 包含所有靜態資源和最佳化的 JavaScript/CSS

### 部署選項

#### 選項 1: GitHub Pages
```bash
# 安裝 gh-pages
npm install -D gh-pages

# 添加部署腳本到 package.json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# 部署
npm run deploy
```

#### 選項 2: Netlify
1. 連接 Git 倉庫
2. 設定建構命令：`npm run build`
3. 設定發布目錄：`dist`

#### 選項 3: Vercel
1. 安裝 Vercel CLI：`npm i -g vercel`
2. 執行：`vercel --prod`

## 開發最佳實踐

### 程式碼風格

1. **繁體中文註解**
   ```typescript
   /**
    * 載入題目資料
    * @returns 題目陣列的 Promise
    */
   async function loadQuestions(): Promise<Question[]> {
     // 實作載入邏輯
   }
   ```

2. **組件命名**
   - 使用 PascalCase：`QuestionCard.vue`
   - Composables 使用 camelCase：`useQuestions.ts`

3. **型別安全**
   ```typescript
   // 好的做法：使用嚴格型別
   const question: Question = {
     question_number: 1,
     question_text_zh: '題目內容'
     // ...
   }

   // 避免使用 any
   const data: any = loadData() // ❌
   const data: Question[] = loadData() // ✅
   ```

### 效能優化

1. **懶載入**
   ```typescript
   // 大型組件使用懶載入
   const QuestionCard = defineAsyncComponent(() =>
     import('./components/QuestionCard.vue')
   )
   ```

2. **記憶體管理**
   ```typescript
   // Composables 中適當清理
   onUnmounted(() => {
     // 清理定時器、事件監聽器等
   })
   ```

## 除錯指南

### 常見問題

1. **題目資料載入失敗**
   - 檢查 `questions.js` 檔案路徑
   - 驗證 JSON 格式是否正確

2. **樣式不生效**
   - 確認 SCSS 檔案已正確匯入
   - 檢查 CSS 模組化設定

3. **TypeScript 錯誤**
   - 確認型別定義檔案位置
   - 檢查 `tsconfig.json` 路徑別名設定

### 除錯工具

```bash
# Vue DevTools 安裝
# 瀏覽器擴充功能：Vue.js devtools

# 開發時的 console 除錯
console.log('Current state:', toRaw(state))
```

## 提交與版本控制

### Git 工作流程

```bash
# 功能開發分支
git checkout -b feature/question-display
git add .
git commit -m "feat: 實作題目顯示組件"

# 合併到主分支
git checkout main
git merge feature/question-display
```

### 提交訊息規範

使用 Conventional Commits 格式：

```bash
feat: 新增題目摺疊功能
fix: 修復分頁導航問題
docs: 更新 README 文檔
style: 調整響應式樣式
refactor: 重構語言切換邏輯
test: 添加組件單元測試
```

## 下一步

1. 完成基礎環境設置
2. 實作 P1 優先級功能（基本題目瀏覽）
3. 添加 P2 優先級功能（分頁導航）
4. 實作 P3 優先級功能（語言切換）
5. 完善測試覆蓋率
6. 部署到生產環境

有任何問題請參考：
- [Vue 3 官方文檔](https://vuejs.org/)
- [Vite 官方文檔](https://vitejs.dev/)
- [TypeScript 官方文檔](https://www.typescriptlang.org/)
- 專案規格文檔：`spec.md`
- 資料模型文檔：`data-model.md`