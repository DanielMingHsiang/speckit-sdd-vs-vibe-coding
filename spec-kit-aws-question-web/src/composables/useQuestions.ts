/**
 * useQuestions - 題目資料管理組合式函數
 *
 * 負責載入、管理和提供題目資料的相關功能
 * 使用 Vue 3 Composition API 模式
 */

import { ref, readonly, computed } from 'vue'
import type { Question, UseQuestionsReturn } from '@/types/types'
import { getAllQuestions } from '@/assets/data/questions'

// 全域狀態（單例模式）
const questions = ref<Question[]>([])
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

// 是否已初始化的標記
let isInitialized = false

/**
 * 載入題目資料
 */
async function loadQuestions(): Promise<void> {
  if (isInitialized) {
    return // 避免重複載入
  }

  isLoading.value = true
  error.value = null

  try {
    // 模擬異步載入（實際上是同步的，但為了一致性和未來擴展）
    await new Promise(resolve => setTimeout(resolve, 100))

    const loadedQuestions = getAllQuestions()

    if (!loadedQuestions || loadedQuestions.length === 0) {
      throw new Error('題目資料載入失敗：沒有找到有效的題目')
    }

    // 驗證題目資料格式
    const validatedQuestions = validateQuestions(loadedQuestions)
    questions.value = validatedQuestions
    isInitialized = true

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '未知錯誤'
    error.value = `題目載入失敗: ${errorMessage}`
    console.error('題目載入錯誤:', err)
  } finally {
    isLoading.value = false
  }
}

/**
 * 驗證題目資料格式
 * @param questionList 待驗證的題目陣列
 * @returns 驗證後的題目陣列
 */
function validateQuestions(questionList: Question[]): Question[] {
  const validQuestions: Question[] = []
  const seenNumbers = new Set<number>()

  for (const question of questionList) {
    // 檢查必要欄位
    if (!question.question_number ||
        !question.question_text_en ||
        !question.options_en ||
        !question.correct_answer) {
      console.warn(`題目 ${question.question_number} 缺少必要欄位，已跳過`)
      continue
    }

    // 檢查題目編號唯一性
    if (seenNumbers.has(question.question_number)) {
      console.warn(`重複的題目編號 ${question.question_number}，已跳過`)
      continue
    }

    // 檢查選項陣列長度一致性
    if (question.options_zh &&
        question.options_en.length !== question.options_zh.length) {
      console.warn(`題目 ${question.question_number} 中英文選項數量不一致`)
    }

    // 檢查答案有效性
    if (!isValidAnswer(question.correct_answer, question.options_en.length)) {
      console.warn(`題目 ${question.question_number} 答案格式無效: ${question.correct_answer}`)
      continue
    }

    seenNumbers.add(question.question_number)
    validQuestions.push(question)
  }

  if (validQuestions.length === 0) {
    throw new Error('沒有有效的題目資料')
  }

  return validQuestions.sort((a, b) => a.question_number - b.question_number)
}

/**
 * 驗證答案格式是否有效
 * @param answer 答案字串
 * @param optionCount 選項數量
 * @returns 是否有效
 */
function isValidAnswer(answer: string, optionCount: number): boolean {
  if (!answer || typeof answer !== 'string') {
    return false
  }

  const answerChars = answer.split('')
  const maxOption = String.fromCharCode(65 + optionCount - 1) // A, B, C, D...

  for (const char of answerChars) {
    if (char < 'A' || char > maxOption) {
      return false
    }
  }

  return true
}

/**
 * 重新載入題目資料
 */
async function reload(): Promise<void> {
  isInitialized = false
  questions.value = []
  await loadQuestions()
}

/**
 * useQuestions 組合式函數
 * @returns UseQuestionsReturn 物件
 */
export function useQuestions(): UseQuestionsReturn {
  // 自動載入題目（如果尚未載入）
  if (!isInitialized && !isLoading.value) {
    loadQuestions()
  }

  // 計算屬性：題目總數
  const questionCount = computed(() => questions.value.length)

  // 計算屬性：是否有題目資料
  const hasQuestions = computed(() => questions.value.length > 0)

  return {
    // 響應式資料（唯讀）
    questions: readonly(questions),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // 計算屬性
    questionCount,
    hasQuestions,

    // 方法
    reload
  }
}

/**
 * 根據題目編號取得特定題目
 * @param questionNumber 題目編號
 * @returns 題目物件或 undefined
 */
export function getQuestionByNumber(questionNumber: number): Question | undefined {
  return questions.value.find((q: Question) => q.question_number === questionNumber)
}

/**
 * 取得指定範圍的題目
 * @param start 起始索引（包含）
 * @param end 結束索引（不包含）
 * @returns 題目陣列
 */
export function getQuestionsSlice(start: number, end: number): Question[] {
  return questions.value.slice(start, end)
}

/**
 * 根據頁面取得題目
 * @param page 頁面編號（從 1 開始）
 * @param questionsPerPage 每頁題目數量
 * @returns 題目陣列
 */
export function getQuestionsByPage(page: number, questionsPerPage: number): Question[] {
  const startIndex = (page - 1) * questionsPerPage
  const endIndex = startIndex + questionsPerPage
  return getQuestionsSlice(startIndex, endIndex)
}