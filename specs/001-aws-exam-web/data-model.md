# Data Model: AWS 證照考題複習網頁

**功能**: AWS 證照考題複習網頁
**建立日期**: 2025-11-08
**版本**: 1.0.0

## 實體定義

### 核心資料實體

#### Question（題目）
表示單一考題的完整資料結構。

```typescript
interface Question {
  question_number: number           // 題目編號，用於排序和識別
  question_text_en: string         // 英文題目內容
  question_text_zh: string         // 繁體中文題目內容
  options_en: string[]             // 英文選項陣列（A, B, C, D...）
  options_zh: string[]             // 繁體中文選項陣列
  correct_answer: string           // 正確答案（單選："A"，多選："BD"）
  explanation: string              // 詳細解說（可為空字串）
  tips: string[]                   // 額外提示陣列（可為空陣列）
}
```

**約束條件**:
- `question_number` 必須為正整數且唯一
- `options_en` 和 `options_zh` 陣列長度必須相同
- `correct_answer` 只能包含有效的選項字母（A-Z）
- 所有字串欄位不得為 null，但可為空字串

#### AppState（應用程式狀態）
管理整個應用程式的全域狀態。

```typescript
interface AppState {
  currentPage: number              // 目前頁面（從 1 開始）
  questionsPerPage: number         // 每頁題目數量（固定為 5）
  selectedLanguage: Language       // 目前選擇的語言
  collapsedStates: Record<number, CollapsedState>  // 各題目的摺疊狀態
}
```

#### CollapsedState（摺疊狀態）
記錄每道題目的答案和詳解顯示狀態。

```typescript
interface CollapsedState {
  answerCollapsed: boolean         // 答案區塊是否摺疊（預設 true）
  explanationCollapsed: boolean    // 詳解區塊是否摺疊（預設 true）
}
```

#### PaginationInfo（分頁資訊）
分頁導航所需的計算資訊。

```typescript
interface PaginationInfo {
  totalQuestions: number           // 總題目數量
  totalPages: number              // 總頁數
  currentPage: number             // 目前頁面
  hasNextPage: boolean            // 是否有下一頁
  hasPreviousPage: boolean        // 是否有上一頁
  questionsOnCurrentPage: Question[]  // 目前頁面的題目
}
```

### 輔助類型定義

#### Language（語言）
支援的語言列舉。

```typescript
type Language = 'zh' | 'en'
```

#### AnswerType（答案類型）
用於識別題目是單選還是多選。

```typescript
type AnswerType = 'single' | 'multiple'
```

#### QuestionDisplayData（題目顯示資料）
組件渲染所需的處理後資料。

```typescript
interface QuestionDisplayData {
  question: Question
  questionText: string             // 根據語言選擇的題目文字
  options: string[]               // 根據語言選擇的選項
  answerType: AnswerType          // 答案類型（單選/多選）
  correctAnswers: string[]        // 正確答案陣列
  isAnswerVisible: boolean        // 答案是否可見
  isExplanationVisible: boolean   // 詳解是否可見
}
```

## 資料關係與約束

### 關係圖
```
AppState
├── currentPage ──────────┐
├── questionsPerPage      │
├── selectedLanguage      │
└── collapsedStates       │
    └── [question_number] │
        ├── answerCollapsed
        └── explanationCollapsed
                          │
PaginationInfo            │
├── totalQuestions        │
├── currentPage ◄─────────┘
├── questionsOnCurrentPage
│   └── Question[]
│       ├── question_number (唯一識別)
│       ├── question_text_en/zh
│       ├── options_en/zh
│       ├── correct_answer
│       ├── explanation
│       └── tips
└── 計算屬性（totalPages, hasNextPage, etc.）
```

### 資料約束

#### 完整性約束
1. **題目編號唯一性**: 所有 `question_number` 必須唯一
2. **選項對稱性**: `options_en` 和 `options_zh` 陣列長度必須相同
3. **答案有效性**: `correct_answer` 中的字母必須對應到存在的選項
4. **頁面邊界**: `currentPage` 必須在 1 到 `totalPages` 範圍內

#### 業務邏輯約束
1. **每頁題目數**: 固定為 5 題，最後一頁可少於 5 題
2. **摺疊預設值**: 新題目的答案和詳解都預設為摺疊狀態
3. **語言切換保持狀態**: 切換語言時保持當前頁面和摺疊狀態

## 狀態管理方法

### 資料流向
```
questions.js (靜態資料)
    ↓
useQuestions (載入和處理)
    ↓
AppState (全域狀態)
    ↓
Components (渲染和互動)
    ↓
localStorage (持久化)
```

### 狀態更新模式

#### 響應式更新
使用 Vue 3 的 `reactive()` 和 `computed()` 實現自動更新：

```typescript
// 狀態變更自動觸發相關計算
const state = reactive<AppState>({
  currentPage: 1,
  selectedLanguage: 'zh',
  // ...
})

// 自動計算分頁資訊
const paginationInfo = computed<PaginationInfo>(() => {
  // 基於 state 計算分頁資訊
})
```

#### 持久化策略
關鍵狀態自動同步到 localStorage：

```typescript
// 監聽狀態變更並持久化
watchEffect(() => {
  localStorage.setItem('awsExamState', JSON.stringify({
    currentPage: state.currentPage,
    selectedLanguage: state.selectedLanguage,
    collapsedStates: state.collapsedStates
  }))
})
```

## 儲存與持久化策略

### localStorage 結構
```json
{
  "awsExamState": {
    "currentPage": 1,
    "selectedLanguage": "zh",
    "collapsedStates": {
      "1": {
        "answerCollapsed": true,
        "explanationCollapsed": false
      }
    }
  }
}
```

### 資料驗證與恢復
```typescript
// 載入時驗證資料完整性
function loadStateFromStorage(): Partial<AppState> {
  try {
    const stored = localStorage.getItem('awsExamState')
    if (!stored) return getDefaultState()

    const parsed = JSON.parse(stored)
    return validateAndSanitizeState(parsed)
  } catch {
    return getDefaultState()
  }
}
```

### 容錯機制
1. **資料損壞恢復**: 如果 localStorage 資料無效，回復到預設狀態
2. **版本相容性**: 預留版本號欄位，支援未來資料格式升級
3. **儲存空間限制**: 定期清理過期的摺疊狀態資料

## 效能最佳化考量

### 記憶體管理
- 使用 `markRaw()` 標記靜態資料，避免不必要的響應式代理
- 實作虛擬化分頁，僅保留當前頁面題目在記憶體中

### 計算快取
- 使用 `computed()` 快取計算結果
- 分頁資訊計算結果會自動快取，僅在相關狀態變更時重新計算

### 批次更新
- 語言切換等大量狀態變更使用 `nextTick()` 批次處理
- 避免在一次操作中觸發多次 localStorage 寫入

## 未來擴展考量

### 可擴展的設計決策
1. **多語言支援**: `Language` 類型可輕易擴展為聯合類型
2. **題目分類**: `Question` 介面預留空間添加分類、難度等屬性
3. **學習進度**: `AppState` 可擴展添加答題記錄、正確率統計
4. **離線支援**: 資料模型已支援完全離線操作

### 架構彈性
- 狀態管理使用 Composition API，易於重構和測試
- 型別定義清晰，支援大型專案的重構需求
- 資料層與視圖層解耦，便於未來架構調整