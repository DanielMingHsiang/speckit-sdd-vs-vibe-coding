/**
 * useCollapsedStates - 摺疊狀態管理組合式函數
 *
 * 負責管理題目的答案和詳解顯示/隱藏狀態
 * 支援 localStorage 持久化和批次操作
 */

import { ref, reactive, watch } from 'vue'
import type { CollapsedState, UseCollapsedStatesReturn } from '@/types/types'
import { APP_CONSTANTS } from '@/types/types'

// 全域摺疊狀態存儲
const collapsedStates = reactive<Record<number, CollapsedState>>({})

// 載入儲存的摺疊狀態
function loadCollapsedStatesFromStorage(): Record<number, CollapsedState> {
  try {
    const stored = localStorage.getItem('aws-exam-collapsed-states')
    if (stored) {
      const data = JSON.parse(stored)
      if (data && typeof data === 'object') {
        // 驗證和清理儲存的資料
        const validatedData: Record<number, CollapsedState> = {}
        for (const [key, value] of Object.entries(data)) {
          const questionNumber = parseInt(key, 10)
          if (!isNaN(questionNumber) && isValidCollapsedState(value)) {
            validatedData[questionNumber] = value as CollapsedState
          }
        }
        return validatedData
      }
    }
  } catch (error) {
    console.warn('載入摺疊狀態失敗:', error)
  }

  return {}
}

// 驗證摺疊狀態物件格式
function isValidCollapsedState(state: any): state is CollapsedState {
  return (
    state &&
    typeof state === 'object' &&
    typeof state.answerCollapsed === 'boolean' &&
    typeof state.explanationCollapsed === 'boolean'
  )
}

// 儲存摺疊狀態到 localStorage
function saveCollapsedStatesToStorage(): void {
  try {
    localStorage.setItem('aws-exam-collapsed-states', JSON.stringify(collapsedStates))
  } catch (error) {
    console.warn('儲存摺疊狀態失敗:', error)
  }
}

// 初始化摺疊狀態
let isInitialized = false

function initializeCollapsedStates(): void {
  if (isInitialized) return

  const storedStates = loadCollapsedStatesFromStorage()
  Object.assign(collapsedStates, storedStates)
  isInitialized = true

  // 監聽狀態變更並自動儲存（防抖處理）
  let saveTimer: number | undefined
  watch(
    () => collapsedStates,
    () => {
      if (saveTimer) {
        clearTimeout(saveTimer)
      }
      saveTimer = window.setTimeout(saveCollapsedStatesToStorage, 300)
    },
    { deep: true }
  )
}

/**
 * 取得指定題目的摺疊狀態
 * @param questionNumber 題目編號
 * @returns 摺疊狀態物件
 */
function getCollapsedState(questionNumber: number): CollapsedState {
  if (!collapsedStates[questionNumber]) {
    // 使用預設狀態
    collapsedStates[questionNumber] = { ...APP_CONSTANTS.DEFAULT_COLLAPSED_STATE }
  }
  return collapsedStates[questionNumber]
}

/**
 * 設定指定題目的摺疊狀態
 * @param questionNumber 題目編號
 * @param state 新的摺疊狀態
 */
function setCollapsedState(questionNumber: number, state: Partial<CollapsedState>): void {
  const currentState = getCollapsedState(questionNumber)
  collapsedStates[questionNumber] = { ...currentState, ...state }
}

/**
 * 切換答案顯示狀態
 * @param questionNumber 題目編號
 */
function toggleAnswer(questionNumber: number): void {
  const currentState = getCollapsedState(questionNumber)
  setCollapsedState(questionNumber, {
    answerCollapsed: !currentState.answerCollapsed
  })
}

/**
 * 切換詳解顯示狀態
 * @param questionNumber 題目編號
 */
function toggleExplanation(questionNumber: number): void {
  const currentState = getCollapsedState(questionNumber)
  setCollapsedState(questionNumber, {
    explanationCollapsed: !currentState.explanationCollapsed
  })
}

/**
 * 顯示答案
 * @param questionNumber 題目編號
 */
function showAnswer(questionNumber: number): void {
  setCollapsedState(questionNumber, { answerCollapsed: false })
}

/**
 * 隱藏答案
 * @param questionNumber 題目編號
 */
function hideAnswer(questionNumber: number): void {
  setCollapsedState(questionNumber, { answerCollapsed: true })
}

/**
 * 顯示詳解
 * @param questionNumber 題目編號
 */
function showExplanation(questionNumber: number): void {
  setCollapsedState(questionNumber, { explanationCollapsed: false })
}

/**
 * 隱藏詳解
 * @param questionNumber 題目編號
 */
function hideExplanation(questionNumber: number): void {
  setCollapsedState(questionNumber, { explanationCollapsed: true })
}

/**
 * 同時顯示答案和詳解
 * @param questionNumber 題目編號
 */
function showAll(questionNumber: number): void {
  setCollapsedState(questionNumber, {
    answerCollapsed: false,
    explanationCollapsed: false
  })
}

/**
 * 同時隱藏答案和詳解
 * @param questionNumber 題目編號
 */
function hideAll(questionNumber: number): void {
  setCollapsedState(questionNumber, {
    answerCollapsed: true,
    explanationCollapsed: true
  })
}

/**
 * 重置指定題目的摺疊狀態為預設值
 * @param questionNumber 題目編號
 */
function resetCollapsedState(questionNumber: number): void {
  collapsedStates[questionNumber] = { ...APP_CONSTANTS.DEFAULT_COLLAPSED_STATE }
}

/**
 * 重置所有摺疊狀態
 */
function resetAll(): void {
  const questionNumbers = Object.keys(collapsedStates).map(Number)
  questionNumbers.forEach(resetCollapsedState)
}

/**
 * 批次設定多個題目的摺疊狀態
 * @param questionNumbers 題目編號陣列
 * @param state 要設定的狀態
 */
function setBatchCollapsedState(
  questionNumbers: number[],
  state: Partial<CollapsedState>
): void {
  questionNumbers.forEach(questionNumber => {
    setCollapsedState(questionNumber, state)
  })
}

/**
 * 顯示當前頁面所有題目的答案
 * @param questionNumbers 當前頁面的題目編號陣列
 */
function showAllAnswersOnPage(questionNumbers: number[]): void {
  setBatchCollapsedState(questionNumbers, { answerCollapsed: false })
}

/**
 * 隱藏當前頁面所有題目的答案
 * @param questionNumbers 當前頁面的題目編號陣列
 */
function hideAllAnswersOnPage(questionNumbers: number[]): void {
  setBatchCollapsedState(questionNumbers, { answerCollapsed: true })
}

/**
 * 顯示當前頁面所有題目的詳解
 * @param questionNumbers 當前頁面的題目編號陣列
 */
function showAllExplanationsOnPage(questionNumbers: number[]): void {
  setBatchCollapsedState(questionNumbers, { explanationCollapsed: false })
}

/**
 * 隱藏當前頁面所有題目的詳解
 * @param questionNumbers 當前頁面的題目編號陣列
 */
function hideAllExplanationsOnPage(questionNumbers: number[]): void {
  setBatchCollapsedState(questionNumbers, { explanationCollapsed: true })
}

/**
 * 取得摺疊狀態的統計資訊
 * @returns 統計資訊物件
 */
function getCollapsedStatesStats(): {
  totalQuestions: number
  answersVisible: number
  explanationsVisible: number
  bothVisible: number
  bothHidden: number
} {
  const questionNumbers = Object.keys(collapsedStates).map(Number)
  const totalQuestions = questionNumbers.length

  let answersVisible = 0
  let explanationsVisible = 0
  let bothVisible = 0
  let bothHidden = 0

  questionNumbers.forEach(questionNumber => {
    const state = collapsedStates[questionNumber]
    const answerVisible = !state.answerCollapsed
    const explanationVisible = !state.explanationCollapsed

    if (answerVisible) answersVisible++
    if (explanationVisible) explanationsVisible++
    if (answerVisible && explanationVisible) bothVisible++
    if (!answerVisible && !explanationVisible) bothHidden++
  })

  return {
    totalQuestions,
    answersVisible,
    explanationsVisible,
    bothVisible,
    bothHidden
  }
}

/**
 * 清理無效的摺疊狀態（移除不存在題目的狀態）
 * @param validQuestionNumbers 有效的題目編號陣列
 */
function cleanupCollapsedStates(validQuestionNumbers: number[]): void {
  const validNumbers = new Set(validQuestionNumbers)
  Object.keys(collapsedStates).forEach(key => {
    const questionNumber = parseInt(key, 10)
    if (!validNumbers.has(questionNumber)) {
      delete collapsedStates[questionNumber]
    }
  })
}

/**
 * useCollapsedStates 組合式函數
 * @returns UseCollapsedStatesReturn 物件
 */
export function useCollapsedStates(): UseCollapsedStatesReturn {
  // 確保已初始化
  if (!isInitialized) {
    initializeCollapsedStates()
  }

  return {
    // 資料
    collapsedStates,

    // 基本操作
    getCollapsedState,
    setCollapsedState,
    resetCollapsedState,
    resetAll,

    // 切換操作
    toggleAnswer,
    toggleExplanation,

    // 顯示/隱藏操作
    showAnswer,
    hideAnswer,
    showExplanation,
    hideExplanation,
    showAll,
    hideAll,

    // 批次操作
    setBatchCollapsedState,
    showAllAnswersOnPage,
    hideAllAnswersOnPage,
    showAllExplanationsOnPage,
    hideAllExplanationsOnPage,

    // 工具方法
    getCollapsedStatesStats,
    cleanupCollapsedStates
  }
}