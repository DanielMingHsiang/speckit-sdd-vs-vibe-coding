/**
 * AWS 證照考題複習網頁 - 型別定義合約
 *
 * 定義整個應用程式的型別介面，確保組件間的一致性
 * 遵循繁體中文註解標準
 */

// ============================================================================
// 核心資料類型
// ============================================================================

/**
 * 語言類型定義
 * 支援繁體中文和英文兩種語言
 */
export type Language = 'zh' | 'en'

/**
 * 答案類型定義
 * 區分單選題和多選題
 */
export type AnswerType = 'single' | 'multiple'

/**
 * 題目資料結構
 * 對應 questions.js 中的資料格式
 */
export interface Question {
  /** 題目編號，用於排序和唯一識別 */
  question_number: number

  /** 英文題目內容 */
  question_text_en: string

  /** 繁體中文題目內容 */
  question_text_zh: string

  /** 英文選項陣列 */
  options_en: string[]

  /** 繁體中文選項陣列 */
  options_zh: string[]

  /** 正確答案（單選："A"，多選："BD"） */
  correct_answer: string

  /** 詳細解說 */
  explanation: string

  /** 額外提示陣列 */
  tips: string[]
}

/**
 * 題目摺疊狀態
 * 記錄答案和詳解的顯示/隱藏狀態
 */
export interface CollapsedState {
  /** 答案區塊是否摺疊 */
  answerCollapsed: boolean

  /** 詳解區塊是否摺疊 */
  explanationCollapsed: boolean
}

/**
 * 應用程式全域狀態
 * 管理分頁、語言和摺疊狀態
 */
export interface AppState {
  /** 目前頁面編號（從 1 開始） */
  currentPage: number

  /** 每頁顯示的題目數量 */
  questionsPerPage: number

  /** 目前選擇的語言 */
  selectedLanguage: Language

  /** 各題目的摺疊狀態對映 */
  collapsedStates: Record<number, CollapsedState>
}

/**
 * 分頁資訊
 * 包含分頁導航所需的所有計算資料
 */
export interface PaginationInfo {
  /** 總題目數量 */
  totalQuestions: number

  /** 總頁數 */
  totalPages: number

  /** 目前頁面編號 */
  currentPage: number

  /** 是否有下一頁 */
  hasNextPage: boolean

  /** 是否有上一頁 */
  hasPreviousPage: boolean

  /** 目前頁面的題目陣列 */
  questionsOnCurrentPage: Question[]
}

/**
 * 題目顯示資料
 * 組件渲染所需的處理後資料
 */
export interface QuestionDisplayData {
  /** 原始題目資料 */
  question: Question

  /** 根據語言選擇的題目文字 */
  questionText: string

  /** 根據語言選擇的選項陣列 */
  options: string[]

  /** 答案類型（單選/多選） */
  answerType: AnswerType

  /** 正確答案陣列 */
  correctAnswers: string[]

  /** 答案是否可見 */
  isAnswerVisible: boolean

  /** 詳解是否可見 */
  isExplanationVisible: boolean
}

// ============================================================================
// 組件Props介面
// ============================================================================

/**
 * QuestionCard 組件的 Props
 */
export interface QuestionCardProps {
  /** 題目顯示資料 */
  questionData: QuestionDisplayData

  /** 切換答案顯示狀態的回調函數 */
  onToggleAnswer: (questionNumber: number) => void

  /** 切換詳解顯示狀態的回調函數 */
  onToggleExplanation: (questionNumber: number) => void
}

/**
 * Pagination 組件的 Props
 */
export interface PaginationProps {
  /** 分頁資訊 */
  paginationInfo: PaginationInfo

  /** 頁面切換的回調函數 */
  onPageChange: (page: number) => void
}

/**
 * LanguageToggle 組件的 Props
 */
export interface LanguageToggleProps {
  /** 目前選擇的語言 */
  currentLanguage: Language

  /** 語言切換的回調函數 */
  onLanguageChange: (language: Language) => void
}

// ============================================================================
// Composable介面
// ============================================================================

/**
 * useQuestions Composable 回傳介面
 */
export interface UseQuestionsReturn {
  /** 所有題目資料 */
  questions: readonly Question[]

  /** 題目載入狀態 */
  isLoading: boolean

  /** 載入錯誤訊息 */
  error: string | null

  /** 題目總數 */
  questionCount: number

  /** 是否有題目資料 */
  hasQuestions: boolean

  /** 重新載入題目的函數 */
  reload: () => Promise<void>
}

/**
 * useLanguage Composable 回傳介面
 */
export interface UseLanguageReturn {
  /** 目前語言 */
  currentLanguage: Language

  /** 切換語言函數 */
  switchLanguage: (language: Language) => void

  /** 取得本地化文字的函數 */
  getText: (key: string) => string
}

/**
 * usePagination Composable 回傳介面
 */
export interface UsePaginationReturn {
  /** 分頁資訊 */
  paginationInfo: PaginationInfo

  /** 跳轉到指定頁面 */
  goToPage: (page: number) => void

  /** 跳轉到下一頁 */
  nextPage: () => void

  /** 跳轉到上一頁 */
  previousPage: () => void
}

/**
 * useCollapsedStates Composable 回傳介面
 */
export interface UseCollapsedStatesReturn {
  /** 取得指定題目的摺疊狀態 */
  getCollapsedState: (questionNumber: number) => CollapsedState

  /** 切換答案顯示狀態 */
  toggleAnswer: (questionNumber: number) => void

  /** 切換詳解顯示狀態 */
  toggleExplanation: (questionNumber: number) => void

  /** 重置所有摺疊狀態 */
  resetAll: () => void
}

// ============================================================================
// 工具函數介面
// ============================================================================

/**
 * 本地儲存工具介面
 */
export interface StorageUtils {
  /** 載入狀態資料 */
  loadState: () => Partial<AppState>

  /** 儲存狀態資料 */
  saveState: (state: AppState) => void

  /** 清除所有儲存資料 */
  clearStorage: () => void
}

/**
 * 題目處理工具介面
 */
export interface QuestionHelpers {
  /** 判斷答案類型 */
  getAnswerType: (correctAnswer: string) => AnswerType

  /** 解析正確答案為陣列 */
  parseCorrectAnswers: (correctAnswer: string) => string[]

  /** 驗證題目資料格式 */
  validateQuestion: (question: unknown) => question is Question

  /** 取得指定語言的題目文字 */
  getQuestionText: (question: Question, language: Language) => string

  /** 取得指定語言的選項陣列 */
  getOptions: (question: Question, language: Language) => string[]
}

// ============================================================================
// 常數定義
// ============================================================================

/**
 * 應用程式常數
 */
export const APP_CONSTANTS = {
  /** 每頁顯示的題目數量 */
  QUESTIONS_PER_PAGE: 5,

  /** 預設語言 */
  DEFAULT_LANGUAGE: 'zh' as Language,

  /** 本地儲存的鍵名 */
  STORAGE_KEY: 'awsExamState',

  /** 支援的語言清單 */
  SUPPORTED_LANGUAGES: ['zh', 'en'] as Language[],

  /** 預設摺疊狀態 */
  DEFAULT_COLLAPSED_STATE: {
    answerCollapsed: true,
    explanationCollapsed: true
  } as CollapsedState
} as const

/**
 * 界面文字對映
 */
export interface UITexts {
  zh: Record<string, string>
  en: Record<string, string>
}

/**
 * 預設界面文字
 */
export const DEFAULT_UI_TEXTS: UITexts = {
  zh: {
    'app.title': 'AWS 證照考題複習',
    'question.answer': '查看答案',
    'question.explanation': '查看詳解',
    'question.hide': '隱藏',
    'question.showAnswer': '顯示答案',
    'question.hideAnswer': '隱藏答案',
    'question.showExplanation': '顯示詳解',
    'question.hideExplanation': '隱藏詳解',
    'question.correctAnswer': '正確答案',
    'question.tips': '小提示',
    'question.number': '題目',
    'question.singleChoice': '單選題',
    'question.multipleChoice': '多選題',
    'question.multipleAnswerNote': '此題為多選題',
    'question.showAllAnswers': '顯示所有答案',
    'question.hideAllAnswers': '隱藏所有答案',
    'question.showAllExplanations': '顯示所有詳解',
    'question.hideAllExplanations': '隱藏所有詳解',
    'pagination.previous': '上一頁',
    'pagination.next': '下一頁',
    'pagination.prev': '上頁',
    'pagination.first': '首頁',
    'pagination.last': '末頁',
    'pagination.firstPage': '跳到第一頁',
    'pagination.lastPage': '跳到最後一頁',
    'pagination.previousPage': '上一頁',
    'pagination.nextPage': '下一頁',
    'pagination.page': '第',
    'pagination.questions': '題',
    'pagination.navigation': '分頁導航',
    'pagination.goToPage': '跳到第 {0} 頁',
    'pagination.jumpTo': '跳到',
    'pagination.pageNumber': '頁碼',
    'pagination.go': '前往',
    'pagination.jumpButton': '跳轉頁面',
    'pagination.showingQuestions': '第 {0} 頁，共 {1} 頁',
    'language.switch': '切換語言',
    'language.switchTo': '切換到 {0}',
    'language.quickToggle': '快速切換語言',
    'language.chinese': '繁體中文',
    'language.english': 'English',
    'loading.questions': '載入題目中...',
    'error.load': '載入失敗，請重試',
    'error.retry': '重新載入',
    'questions.empty': '沒有找到題目',
    'questions.reload': '重新載入題目',
    'navigation.backToTop': '回到頂部'
  },
  en: {
    'app.title': 'AWS Certification Questions',
    'question.answer': 'Answer',
    'question.explanation': 'Explanation',
    'question.hide': 'Hide',
    'question.showAnswer': 'Show Answer',
    'question.hideAnswer': 'Hide Answer',
    'question.showExplanation': 'Show Explanation',
    'question.hideExplanation': 'Hide Explanation',
    'question.correctAnswer': 'Correct Answer',
    'question.tips': 'Tips',
    'question.number': 'Question',
    'question.singleChoice': 'Single Choice',
    'question.multipleChoice': 'Multiple Choice',
    'question.multipleAnswerNote': 'This is a multiple choice question',
    'question.showAllAnswers': 'Show All Answers',
    'question.hideAllAnswers': 'Hide All Answers',
    'question.showAllExplanations': 'Show All Explanations',
    'question.hideAllExplanations': 'Hide All Explanations',
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'pagination.prev': 'Prev',
    'pagination.first': 'First',
    'pagination.last': 'Last',
    'pagination.firstPage': 'Go to first page',
    'pagination.lastPage': 'Go to last page',
    'pagination.previousPage': 'Previous page',
    'pagination.nextPage': 'Next page',
    'pagination.page': 'Page',
    'pagination.questions': 'questions',
    'pagination.navigation': 'Pagination navigation',
    'pagination.goToPage': 'Go to page {0}',
    'pagination.jumpTo': 'Jump to',
    'pagination.pageNumber': 'Page number',
    'pagination.go': 'Go',
    'pagination.jumpButton': 'Jump to page',
    'pagination.showingQuestions': 'Page {0} of {1}',
    'language.switch': 'Switch Language',
    'language.switchTo': 'Switch to {0}',
    'language.quickToggle': 'Quick toggle language',
    'language.chinese': '繁體中文',
    'language.english': 'English',
    'loading.questions': 'Loading questions...',
    'error.load': 'Failed to load, please retry',
    'error.retry': 'Retry',
    'questions.empty': 'No questions found',
    'questions.reload': 'Reload Questions',
    'navigation.backToTop': 'Back to top'
  }
}