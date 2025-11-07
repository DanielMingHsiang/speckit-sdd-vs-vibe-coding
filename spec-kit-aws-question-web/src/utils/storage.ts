/**
 * 本地儲存工具函數
 * 管理 localStorage 的讀寫和狀態持久化
 */

import type { AppState, StorageUtils } from '@/types/types'
import { APP_CONSTANTS } from '@/types/types'

/**
 * 預設應用程式狀態
 */
const getDefaultState = (): AppState => ({
  currentPage: 1,
  questionsPerPage: APP_CONSTANTS.QUESTIONS_PER_PAGE,
  selectedLanguage: APP_CONSTANTS.DEFAULT_LANGUAGE,
  collapsedStates: {}
})

/**
 * 驗證並清理狀態物件
 * @param state 可能的狀態物件
 * @returns 驗證後的狀態物件
 */
function validateAndSanitizeState(state: any): Partial<AppState> {
  const sanitized: Partial<AppState> = {}

  // 驗證 currentPage
  if (typeof state.currentPage === 'number' && state.currentPage > 0) {
    sanitized.currentPage = Math.floor(state.currentPage)
  }

  // 驗證 questionsPerPage
  if (typeof state.questionsPerPage === 'number' && state.questionsPerPage > 0) {
    sanitized.questionsPerPage = Math.floor(state.questionsPerPage)
  }

  // 驗證 selectedLanguage
  if (APP_CONSTANTS.SUPPORTED_LANGUAGES.includes(state.selectedLanguage)) {
    sanitized.selectedLanguage = state.selectedLanguage
  }

  // 驗證 collapsedStates
  if (state.collapsedStates && typeof state.collapsedStates === 'object') {
    const collapsedStates: Record<number, any> = {}

    for (const [key, value] of Object.entries(state.collapsedStates)) {
      const questionNumber = parseInt(key, 10)
      if (!isNaN(questionNumber) && value && typeof value === 'object') {
        const { answerCollapsed, explanationCollapsed } = value as any

        if (typeof answerCollapsed === 'boolean' && typeof explanationCollapsed === 'boolean') {
          collapsedStates[questionNumber] = {
            answerCollapsed,
            explanationCollapsed
          }
        }
      }
    }

    sanitized.collapsedStates = collapsedStates
  }

  return sanitized
}

/**
 * 從 localStorage 載入狀態
 * @returns 部分應用程式狀態或預設狀態
 */
function loadState(): Partial<AppState> {
  try {
    const stored = localStorage.getItem(APP_CONSTANTS.STORAGE_KEY)
    if (!stored) {
      return getDefaultState()
    }

    const parsed = JSON.parse(stored)
    const validated = validateAndSanitizeState(parsed)

    // 合併預設狀態和驗證後的狀態
    return {
      ...getDefaultState(),
      ...validated
    }
  } catch (error) {
    console.warn('無法載入儲存的狀態，使用預設值:', error)
    return getDefaultState()
  }
}

/**
 * 儲存狀態到 localStorage
 * @param state 應用程式狀態
 */
function saveState(state: AppState): void {
  try {
    const stateToSave = {
      currentPage: state.currentPage,
      questionsPerPage: state.questionsPerPage,
      selectedLanguage: state.selectedLanguage,
      collapsedStates: state.collapsedStates
    }

    localStorage.setItem(APP_CONSTANTS.STORAGE_KEY, JSON.stringify(stateToSave))
  } catch (error) {
    console.error('無法儲存狀態:', error)
  }
}

/**
 * 清除所有儲存的資料
 */
function clearStorage(): void {
  try {
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEY)
  } catch (error) {
    console.error('無法清除儲存資料:', error)
  }
}

/**
 * 檢查 localStorage 是否可用
 * @returns localStorage 是否可用
 */
function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * 取得儲存資料的大小（估算）
 * @returns 儲存資料的字元數
 */
function getStorageSize(): number {
  try {
    const stored = localStorage.getItem(APP_CONSTANTS.STORAGE_KEY)
    return stored ? stored.length : 0
  } catch {
    return 0
  }
}

/**
 * 清理過期的摺疊狀態
 * 只保留指定數量內的最近使用的摺疊狀態
 * @param maxStates 最大保留的摺疊狀態數量
 */
function cleanupCollapsedStates(maxStates: number = 100): void {
  try {
    const state = loadState()
    const collapsedStates = state.collapsedStates || {}

    const entries = Object.entries(collapsedStates)
    if (entries.length <= maxStates) {
      return // 不需要清理
    }

    // 保留最新的 maxStates 個狀態（假設較大的題目編號是較新的）
    const sortedEntries = entries.sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
    const cleanedStates = Object.fromEntries(sortedEntries.slice(0, maxStates))

    const newState: AppState = {
      ...getDefaultState(),
      ...state,
      collapsedStates: cleanedStates
    } as AppState

    saveState(newState)
  } catch (error) {
    console.error('清理摺疊狀態時發生錯誤:', error)
  }
}

/**
 * 本地儲存工具物件
 */
export const storageUtils: StorageUtils = {
  loadState,
  saveState,
  clearStorage
}

/**
 * 擴展的儲存工具函數
 */
export const storage = {
  ...storageUtils,
  isStorageAvailable,
  getStorageSize,
  cleanupCollapsedStates,
  getDefaultState,
  validateAndSanitizeState
}

// 預設匯出
export default storage