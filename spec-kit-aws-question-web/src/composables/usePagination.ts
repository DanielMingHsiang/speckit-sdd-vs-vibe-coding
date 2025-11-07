/**
 * usePagination - 分頁管理組合式函數
 *
 * 負責管理分頁狀態、計算分頁資訊和提供分頁導航功能
 * 支援 localStorage 持久化和響應式更新
 */

import { ref, computed, watch } from 'vue'
import type { PaginationInfo, UsePaginationReturn, Question } from '@/types/types'
import { APP_CONSTANTS } from '@/types/types'
import { useQuestions, getQuestionsByPage } from './useQuestions'

// 全域分頁狀態
const currentPage = ref<number>(1)
const questionsPerPage = ref<number>(APP_CONSTANTS.QUESTIONS_PER_PAGE)

// 載入儲存的分頁狀態
function loadPaginationFromStorage(): number {
  try {
    const stored = localStorage.getItem('aws-exam-pagination')
    if (stored) {
      const data = JSON.parse(stored)
      const page = parseInt(data.currentPage, 10)
      return page > 0 ? page : 1
    }
  } catch (error) {
    console.warn('載入分頁狀態失敗:', error)
  }

  return 1
}

// 儲存分頁狀態到 localStorage
function savePaginationToStorage(page: number): void {
  try {
    const data = {
      currentPage: page,
      timestamp: Date.now()
    }
    localStorage.setItem('aws-exam-pagination', JSON.stringify(data))
  } catch (error) {
    console.warn('儲存分頁狀態失敗:', error)
  }
}

// 初始化分頁狀態
let isInitialized = false

function initializePagination(): void {
  if (isInitialized) return

  currentPage.value = loadPaginationFromStorage()
  isInitialized = true

  // 監聽頁面變更並自動儲存
  watch(currentPage, (newPage) => {
    savePaginationToStorage(newPage)
  })
}

/**
 * 跳轉到指定頁面
 * @param page 目標頁面（1-based）
 * @param totalPages 總頁數（用於邊界檢查）
 */
function goToPage(page: number, totalPages?: number): void {
  if (page < 1) {
    console.warn('頁面編號必須大於等於 1')
    return
  }

  if (totalPages && page > totalPages) {
    console.warn(`頁面編號 ${page} 超出範圍，最大頁數為 ${totalPages}`)
    return
  }

  currentPage.value = page
}

/**
 * 跳轉到下一頁
 * @param totalPages 總頁數
 */
function nextPage(totalPages: number): void {
  if (currentPage.value < totalPages) {
    currentPage.value += 1
  }
}

/**
 * 跳轉到上一頁
 */
function previousPage(): void {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

/**
 * 跳轉到第一頁
 */
function goToFirstPage(): void {
  currentPage.value = 1
}

/**
 * 跳轉到最後一頁
 * @param totalPages 總頁數
 */
function goToLastPage(totalPages: number): void {
  if (totalPages > 0) {
    currentPage.value = totalPages
  }
}

/**
 * 重置分頁狀態
 */
function resetPagination(): void {
  currentPage.value = 1
}

/**
 * 計算分頁資訊
 * @param questions 題目陣列
 * @returns 分頁資訊物件
 */
function calculatePaginationInfo(questions: Question[]): PaginationInfo {
  const totalQuestions = questions.length
  const totalPages = Math.max(1, Math.ceil(totalQuestions / questionsPerPage.value))

  // 確保當前頁面在有效範圍內
  const validCurrentPage = Math.min(Math.max(1, currentPage.value), totalPages)
  if (validCurrentPage !== currentPage.value) {
    currentPage.value = validCurrentPage
  }

  const hasNextPage = validCurrentPage < totalPages
  const hasPreviousPage = validCurrentPage > 1

  // 取得當前頁面的題目
  const questionsOnCurrentPage = getQuestionsByPage(
    validCurrentPage,
    questionsPerPage.value
  )

  return {
    totalQuestions,
    totalPages,
    currentPage: validCurrentPage,
    hasNextPage,
    hasPreviousPage,
    questionsOnCurrentPage
  }
}

/**
 * 取得頁面範圍資訊
 * @param paginationInfo 分頁資訊
 * @returns 頁面範圍文字資訊
 */
function getPageRangeInfo(paginationInfo: PaginationInfo): {
  startItem: number
  endItem: number
  totalItems: number
  rangeText: string
} {
  const startItem = (paginationInfo.currentPage - 1) * questionsPerPage.value + 1
  const endItem = Math.min(
    startItem + paginationInfo.questionsOnCurrentPage.length - 1,
    paginationInfo.totalQuestions
  )

  const rangeText = `${startItem}-${endItem} / ${paginationInfo.totalQuestions}`

  return {
    startItem,
    endItem,
    totalItems: paginationInfo.totalQuestions,
    rangeText
  }
}

/**
 * 取得分頁導航按鈕清單
 * @param totalPages 總頁數
 * @param maxVisiblePages 最大顯示頁數按鈕數量
 * @returns 分頁按鈕陣列
 */
function getPaginationButtons(
  totalPages: number,
  maxVisiblePages: number = 5
): Array<{
  page: number
  isCurrent: boolean
  isEllipsis: boolean
}> {
  const buttons: Array<{
    page: number
    isCurrent: boolean
    isEllipsis: boolean
  }> = []

  if (totalPages <= maxVisiblePages) {
    // 如果總頁數不多，顯示所有頁面
    for (let i = 1; i <= totalPages; i++) {
      buttons.push({
        page: i,
        isCurrent: i === currentPage.value,
        isEllipsis: false
      })
    }
  } else {
    // 複雜的分頁邏輯
    const current = currentPage.value
    const half = Math.floor(maxVisiblePages / 2)

    let start = Math.max(1, current - half)
    let end = Math.min(totalPages, current + half)

    // 調整範圍以確保顯示固定數量的按鈕
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1)
      } else {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
    }

    // 添加第一頁和省略號
    if (start > 1) {
      buttons.push({ page: 1, isCurrent: false, isEllipsis: false })
      if (start > 2) {
        buttons.push({ page: -1, isCurrent: false, isEllipsis: true })
      }
    }

    // 添加中間頁面
    for (let i = start; i <= end; i++) {
      buttons.push({
        page: i,
        isCurrent: i === current,
        isEllipsis: false
      })
    }

    // 添加省略號和最後一頁
    if (end < totalPages) {
      if (end < totalPages - 1) {
        buttons.push({ page: -1, isCurrent: false, isEllipsis: true })
      }
      buttons.push({ page: totalPages, isCurrent: false, isEllipsis: false })
    }
  }

  return buttons
}

/**
 * usePagination 組合式函數
 * @returns UsePaginationReturn 物件
 */
export function usePagination(): UsePaginationReturn {
  // 確保已初始化
  if (!isInitialized) {
    initializePagination()
  }

  // 取得題目資料
  const { questions } = useQuestions()

  // 計算分頁資訊
  const paginationInfo = computed<PaginationInfo>(() =>
    calculatePaginationInfo(questions.value as Question[])
  )

  // 計算頁面範圍資訊
  const pageRangeInfo = computed(() => getPageRangeInfo(paginationInfo.value))

  // 計算分頁按鈕
  const paginationButtons = computed(() =>
    getPaginationButtons(paginationInfo.value.totalPages)
  )

  // 計算是否顯示分頁控制項
  const shouldShowPagination = computed(() => paginationInfo.value.totalPages > 1)

  return {
    // 響應式資料
    currentPage,
    questionsPerPage,

    // 計算屬性
    paginationInfo,
    pageRangeInfo,
    paginationButtons,
    shouldShowPagination,

    // 方法
    goToPage: (page: number) => goToPage(page, paginationInfo.value.totalPages),
    nextPage: () => nextPage(paginationInfo.value.totalPages),
    previousPage,
    goToFirstPage,
    goToLastPage: () => goToLastPage(paginationInfo.value.totalPages),
    resetPagination
  }
}