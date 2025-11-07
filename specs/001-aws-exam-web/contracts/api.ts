/**
 * AWS 證照考題複習網頁 - API 合約定義
 *
 * 定義資料載入和處理的介面標準
 * 雖然是純前端應用，但仍需要標準化的資料載入介面
 */

import type { Question } from './types'

// ============================================================================
// 資料載入介面
// ============================================================================

/**
 * 題目資料載入器介面
 * 抽象化資料來源，便於未來擴展（如從 API 載入）
 */
export interface QuestionLoader {
  /**
   * 載入所有題目資料
   * @returns Promise 包含題目陣列
   * @throws Error 當載入失敗時
   */
  loadQuestions(): Promise<Question[]>

  /**
   * 載入指定範圍的題目
   * @param offset 起始位置
   * @param limit 載入數量
   * @returns Promise 包含題目陣列
   */
  loadQuestionsByRange(offset: number, limit: number): Promise<Question[]>

  /**
   * 根據題目編號載入特定題目
   * @param questionNumbers 題目編號陣列
   * @returns Promise 包含題目陣列
   */
  loadQuestionsByNumbers(questionNumbers: number[]): Promise<Question[]>

  /**
   * 驗證資料來源是否可用
   * @returns Promise 布林值，表示資料來源是否正常
   */
  validateDataSource(): Promise<boolean>
}

/**
 * 靜態檔案載入器實作
 * 從 questions.js 檔案載入題目資料
 */
export interface StaticFileLoader extends QuestionLoader {
  /**
   * 檔案路徑
   */
  readonly filePath: string

  /**
   * 載入原始檔案內容
   * @returns Promise 包含原始 JSON 資料
   */
  loadRawData(): Promise<unknown[]>

  /**
   * 驗證並轉換資料格式
   * @param rawData 原始資料
   * @returns 驗證後的題目陣列
   * @throws Error 當資料格式不正確時
   */
  validateAndTransform(rawData: unknown[]): Question[]
}

// ============================================================================
// 資料驗證介面
// ============================================================================

/**
 * 資料驗證結果
 */
export interface ValidationResult {
  /** 驗證是否通過 */
  isValid: boolean

  /** 錯誤訊息陣列 */
  errors: string[]

  /** 警告訊息陣列 */
  warnings: string[]

  /** 有效的題目數量 */
  validQuestionCount: number

  /** 無效的題目編號陣列 */
  invalidQuestionNumbers: number[]
}

/**
 * 題目資料驗證器介面
 */
export interface QuestionValidator {
  /**
   * 驗證單一題目資料
   * @param question 題目資料
   * @returns 驗證結果
   */
  validateQuestion(question: unknown): ValidationResult

  /**
   * 驗證題目陣列
   * @param questions 題目陣列
   * @returns 整體驗證結果
   */
  validateQuestions(questions: unknown[]): ValidationResult

  /**
   * 檢查題目編號唯一性
   * @param questions 題目陣列
   * @returns 重複編號陣列
   */
  checkQuestionNumberUniqueness(questions: Question[]): number[]

  /**
   * 檢查選項陣列一致性
   * @param question 題目資料
   * @returns 是否一致
   */
  checkOptionsConsistency(question: Question): boolean

  /**
   * 檢查答案有效性
   * @param question 題目資料
   * @returns 是否有效
   */
  checkAnswerValidity(question: Question): boolean
}

// ============================================================================
// 資料轉換介面
// ============================================================================

/**
 * 題目資料轉換器介面
 * 處理不同格式的題目資料轉換
 */
export interface QuestionTransformer {
  /**
   * 將原始資料轉換為標準格式
   * @param rawData 原始資料
   * @returns 標準化的題目陣列
   */
  transform(rawData: unknown[]): Question[]

  /**
   * 填補缺失的語言內容
   * @param questions 題目陣列
   * @returns 補齊語言內容的題目陣列
   */
  fillMissingLanguageContent(questions: Question[]): Promise<Question[]>

  /**
   * 標準化答案格式
   * @param correctAnswer 原始答案字串
   * @returns 標準化的答案字串
   */
  normalizeAnswer(correctAnswer: string): string

  /**
   * 清理和格式化文字內容
   * @param text 原始文字
   * @returns 清理後的文字
   */
  cleanText(text: string): string
}

// ============================================================================
// 快取介面
// ============================================================================

/**
 * 快取管理器介面
 * 管理題目資料的本地快取
 */
export interface CacheManager {
  /**
   * 檢查快取是否存在且有效
   * @param key 快取鍵
   * @returns 是否有效
   */
  isValid(key: string): boolean

  /**
   * 從快取載入資料
   * @param key 快取鍵
   * @returns 快取的資料，如果不存在則為 null
   */
  get<T>(key: string): T | null

  /**
   * 將資料存入快取
   * @param key 快取鍵
   * @param data 要快取的資料
   * @param expireTime 過期時間（毫秒）
   */
  set<T>(key: string, data: T, expireTime?: number): void

  /**
   * 清除指定快取
   * @param key 快取鍵
   */
  remove(key: string): void

  /**
   * 清除所有快取
   */
  clear(): void

  /**
   * 取得快取統計資訊
   * @returns 快取統計
   */
  getStats(): CacheStats
}

/**
 * 快取統計資訊
 */
export interface CacheStats {
  /** 快取項目數量 */
  itemCount: number

  /** 估計的記憶體使用量（位元組） */
  estimatedSize: number

  /** 快取命中次數 */
  hitCount: number

  /** 快取未命中次數 */
  missCount: number

  /** 快取命中率 */
  hitRate: number
}

// ============================================================================
// 錯誤處理介面
// ============================================================================

/**
 * 資料載入錯誤類型
 */
export enum DataLoadError {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  INVALID_FORMAT = 'INVALID_FORMAT',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * 資料載入例外
 */
export interface DataLoadException extends Error {
  /** 錯誤類型 */
  readonly type: DataLoadError

  /** 詳細錯誤資訊 */
  readonly details: Record<string, unknown>

  /** 原始錯誤（如果有） */
  readonly originalError?: Error

  /** 是否可重試 */
  readonly retryable: boolean
}

/**
 * 錯誤處理器介面
 */
export interface ErrorHandler {
  /**
   * 處理資料載入錯誤
   * @param error 錯誤物件
   * @returns 是否已處理
   */
  handleLoadError(error: DataLoadException): boolean

  /**
   * 處理驗證錯誤
   * @param validationResult 驗證結果
   * @returns 處理後的題目陣列（移除無效題目）
   */
  handleValidationError(validationResult: ValidationResult): Question[]

  /**
   * 取得使用者友好的錯誤訊息
   * @param error 錯誤物件
   * @param language 語言
   * @returns 本地化的錯誤訊息
   */
  getErrorMessage(error: DataLoadException, language: 'zh' | 'en'): string
}

// ============================================================================
// 資料載入設定
// ============================================================================

/**
 * 資料載入設定選項
 */
export interface LoaderConfig {
  /** 快取啟用 */
  enableCache: boolean

  /** 快取過期時間（毫秒） */
  cacheExpireTime: number

  /** 是否啟用資料驗證 */
  enableValidation: boolean

  /** 是否自動修復資料 */
  autoFixData: boolean

  /** 載入超時時間（毫秒） */
  timeout: number

  /** 重試次數 */
  retryCount: number

  /** 重試間隔（毫秒） */
  retryDelay: number

  /** 是否載入時即驗證 */
  validateOnLoad: boolean
}

/**
 * 預設載入設定
 */
export const DEFAULT_LOADER_CONFIG: LoaderConfig = {
  enableCache: true,
  cacheExpireTime: 24 * 60 * 60 * 1000, // 24 小時
  enableValidation: true,
  autoFixData: true,
  timeout: 10000, // 10 秒
  retryCount: 3,
  retryDelay: 1000, // 1 秒
  validateOnLoad: true
}

// ============================================================================
// 載入狀態介面
// ============================================================================

/**
 * 載入狀態
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  RETRYING = 'retrying'
}

/**
 * 載入進度資訊
 */
export interface LoadingProgress {
  /** 目前狀態 */
  state: LoadingState

  /** 載入進度百分比（0-100） */
  progress: number

  /** 目前處理的項目 */
  currentItem: string

  /** 已處理的項目數 */
  processedCount: number

  /** 總項目數 */
  totalCount: number

  /** 錯誤訊息（如果有） */
  error?: string
}

/**
 * 載入狀態管理器介面
 */
export interface LoadingStateManager {
  /**
   * 目前載入狀態
   */
  readonly currentState: LoadingState

  /**
   * 載入進度資訊
   */
  readonly progress: LoadingProgress

  /**
   * 設定載入狀態
   * @param state 新狀態
   * @param progress 進度資訊
   */
  setState(state: LoadingState, progress?: Partial<LoadingProgress>): void

  /**
   * 重置載入狀態
   */
  reset(): void

  /**
   * 監聽狀態變更
   * @param callback 回調函數
   * @returns 取消監聽的函數
   */
  onStateChange(callback: (progress: LoadingProgress) => void): () => void
}