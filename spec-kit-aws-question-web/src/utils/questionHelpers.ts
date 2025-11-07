/**
 * 題目處理輔助工具函數
 * 提供題目資料驗證、解析和格式化功能
 */

import type { Question, AnswerType, Language, QuestionHelpers } from '@/types/types'

/**
 * 判斷答案類型（單選或多選）
 * @param correctAnswer 正確答案字串
 * @returns 答案類型
 */
function getAnswerType(correctAnswer: string): AnswerType {
  if (!correctAnswer || typeof correctAnswer !== 'string') {
    return 'single'
  }

  // 移除空白並轉為大寫
  const cleanAnswer = correctAnswer.trim().toUpperCase()

  // 如果長度大於 1，視為多選題
  return cleanAnswer.length > 1 ? 'multiple' : 'single'
}

/**
 * 解析正確答案為陣列
 * @param correctAnswer 正確答案字串（如 "A" 或 "BD"）
 * @returns 正確答案陣列（如 ["A"] 或 ["B", "D"]）
 */
function parseCorrectAnswers(correctAnswer: string): string[] {
  if (!correctAnswer || typeof correctAnswer !== 'string') {
    return []
  }

  // 移除空白並轉為大寫，然後分割為字元陣列
  return correctAnswer
    .trim()
    .toUpperCase()
    .split('')
    .filter(char => /^[A-Z]$/.test(char)) // 只保留 A-Z 的字母
    .sort() // 排序確保一致性
}

/**
 * 驗證題目資料格式
 * @param question 可能的題目物件
 * @returns 是否為有效的題目物件
 */
function validateQuestion(question: unknown): question is Question {
  if (!question || typeof question !== 'object') {
    return false
  }

  const q = question as any

  // 檢查必要欄位
  const requiredFields = [
    'question_number',
    'question_text_en',
    'question_text_zh',
    'options_en',
    'options_zh',
    'correct_answer',
    'explanation',
    'tips'
  ]

  for (const field of requiredFields) {
    if (!(field in q)) {
      return false
    }
  }

  // 檢查資料類型
  if (typeof q.question_number !== 'number' || q.question_number <= 0) {
    return false
  }

  if (typeof q.question_text_en !== 'string' || typeof q.question_text_zh !== 'string') {
    return false
  }

  if (!Array.isArray(q.options_en) || !Array.isArray(q.options_zh)) {
    return false
  }

  if (q.options_en.length !== q.options_zh.length || q.options_en.length === 0) {
    return false
  }

  if (typeof q.correct_answer !== 'string' || q.correct_answer.trim() === '') {
    return false
  }

  if (typeof q.explanation !== 'string') {
    return false
  }

  if (!Array.isArray(q.tips)) {
    return false
  }

  // 驗證選項內容
  const isValidStringArray = (arr: any[]) =>
    arr.every(item => typeof item === 'string')

  if (!isValidStringArray(q.options_en) || !isValidStringArray(q.options_zh)) {
    return false
  }

  if (!isValidStringArray(q.tips)) {
    return false
  }

  // 驗證正確答案是否對應有效選項
  const correctAnswers = parseCorrectAnswers(q.correct_answer)
  const maxOptionIndex = q.options_en.length - 1
  const maxOptionLetter = String.fromCharCode(65 + maxOptionIndex) // A=65

  for (const answer of correctAnswers) {
    if (answer > maxOptionLetter) {
      return false
    }
  }

  return true
}

/**
 * 取得指定語言的題目文字
 * @param question 題目物件
 * @param language 語言
 * @returns 題目文字
 */
function getQuestionText(question: Question, language: Language): string {
  return language === 'zh' ? question.question_text_zh : question.question_text_en
}

/**
 * 取得指定語言的選項陣列
 * @param question 題目物件
 * @param language 語言
 * @returns 選項陣列
 */
function getOptions(question: Question, language: Language): string[] {
  return language === 'zh' ? question.options_zh : question.options_en
}

/**
 * 格式化選項文字（添加 A、B、C、D 前綴）
 * @param options 選項陣列
 * @returns 格式化後的選項陣列
 */
function formatOptionsWithLabels(options: string[]): string[] {
  return options.map((option, index) => {
    const label = String.fromCharCode(65 + index) // A, B, C, D...
    return `${label}. ${option}`
  })
}

/**
 * 取得選項標籤（A、B、C、D...）
 * @param optionsCount 選項數量
 * @returns 選項標籤陣列
 */
function getOptionLabels(optionsCount: number): string[] {
  return Array.from({ length: optionsCount }, (_, index) =>
    String.fromCharCode(65 + index)
  )
}

/**
 * 驗證題目陣列
 * @param questions 可能的題目陣列
 * @returns 驗證結果和錯誤訊息
 */
function validateQuestions(questions: unknown): {
  isValid: boolean
  errors: string[]
  validQuestions: Question[]
} {
  const errors: string[] = []
  const validQuestions: Question[] = []

  if (!Array.isArray(questions)) {
    return {
      isValid: false,
      errors: ['題目資料必須是陣列格式'],
      validQuestions: []
    }
  }

  if (questions.length === 0) {
    return {
      isValid: false,
      errors: ['題目陣列不能為空'],
      validQuestions: []
    }
  }

  const questionNumbers = new Set<number>()

  questions.forEach((question, index) => {
    if (!validateQuestion(question)) {
      errors.push(`第 ${index + 1} 題格式無效`)
      return
    }

    const q = question as Question

    // 檢查題目編號是否重複
    if (questionNumbers.has(q.question_number)) {
      errors.push(`題目編號 ${q.question_number} 重複`)
      return
    }

    questionNumbers.add(q.question_number)
    validQuestions.push(q)
  })

  return {
    isValid: errors.length === 0,
    errors,
    validQuestions: validQuestions.sort((a, b) => a.question_number - b.question_number)
  }
}

/**
 * 搜尋題目
 * @param questions 題目陣列
 * @param searchTerm 搜尋關鍵字
 * @param language 搜尋語言
 * @returns 符合條件的題目陣列
 */
function searchQuestions(
  questions: Question[],
  searchTerm: string,
  language: Language = 'zh'
): Question[] {
  if (!searchTerm.trim()) {
    return questions
  }

  const term = searchTerm.toLowerCase().trim()

  return questions.filter(question => {
    const questionText = getQuestionText(question, language).toLowerCase()
    const options = getOptions(question, language)
    const explanation = question.explanation.toLowerCase()

    // 搜尋題目文字
    if (questionText.includes(term)) {
      return true
    }

    // 搜尋選項
    if (options.some(option => option.toLowerCase().includes(term))) {
      return true
    }

    // 搜尋解說
    if (explanation.includes(term)) {
      return true
    }

    // 搜尋提示
    if (question.tips.some(tip => tip.toLowerCase().includes(term))) {
      return true
    }

    return false
  })
}

/**
 * 題目輔助工具物件
 */
export const questionHelpers: QuestionHelpers = {
  getAnswerType,
  parseCorrectAnswers,
  validateQuestion,
  getQuestionText,
  getOptions
}

/**
 * 擴展的題目工具
 */
export const questionUtils = {
  ...questionHelpers,
  formatOptionsWithLabels,
  getOptionLabels,
  validateQuestions,
  searchQuestions
}

// 預設匯出
export default questionUtils