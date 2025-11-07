/**
 * useLanguage - 語言管理組合式函數
 *
 * 負責管理應用程式的語言狀態和本地化文字
 * 支援繁體中文和英文雙語切換
 */

import { ref, computed, watch } from 'vue'
import type { Language, UseLanguageReturn, UITexts } from '@/types/types'
import { APP_CONSTANTS, DEFAULT_UI_TEXTS } from '@/types/types'

// 全域語言狀態
const currentLanguage = ref<Language>(APP_CONSTANTS.DEFAULT_LANGUAGE)

// 載入儲存的語言偏好
function loadLanguageFromStorage(): Language {
  try {
    const stored = localStorage.getItem('aws-exam-language')
    if (stored && APP_CONSTANTS.SUPPORTED_LANGUAGES.includes(stored as Language)) {
      return stored as Language
    }
  } catch (error) {
    console.warn('載入語言偏好失敗:', error)
  }

  return APP_CONSTANTS.DEFAULT_LANGUAGE
}

// 儲存語言偏好到 localStorage
function saveLanguageToStorage(language: Language): void {
  try {
    localStorage.setItem('aws-exam-language', language)
  } catch (error) {
    console.warn('儲存語言偏好失敗:', error)
  }
}

// 初始化語言狀態
let isInitialized = false

function initializeLanguage(): void {
  if (isInitialized) return

  currentLanguage.value = loadLanguageFromStorage()
  isInitialized = true

  // 監聽語言變更並自動儲存
  watch(currentLanguage, (newLanguage) => {
    saveLanguageToStorage(newLanguage)
  })
}

/**
 * 切換語言
 * @param language 目標語言
 */
function switchLanguage(language: Language): void {
  if (!APP_CONSTANTS.SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`不支援的語言: ${language}`)
    return
  }

  currentLanguage.value = language
}

/**
 * 切換到下一個語言
 */
function toggleLanguage(): void {
  const currentIndex = APP_CONSTANTS.SUPPORTED_LANGUAGES.indexOf(currentLanguage.value)
  const nextIndex = (currentIndex + 1) % APP_CONSTANTS.SUPPORTED_LANGUAGES.length
  const nextLanguage = APP_CONSTANTS.SUPPORTED_LANGUAGES[nextIndex]
  switchLanguage(nextLanguage)
}

/**
 * 取得本地化文字
 * @param key 文字鍵名
 * @param fallback 備用文字（當找不到對應文字時使用）
 * @returns 本地化後的文字
 */
function getText(key: string, fallback?: string): string {
  const texts = DEFAULT_UI_TEXTS[currentLanguage.value]
  const text = texts?.[key]

  if (text) {
    return text
  }

  // 如果當前語言沒有對應文字，嘗試使用預設語言
  if (currentLanguage.value !== APP_CONSTANTS.DEFAULT_LANGUAGE) {
    const defaultTexts = DEFAULT_UI_TEXTS[APP_CONSTANTS.DEFAULT_LANGUAGE]
    const defaultText = defaultTexts?.[key]
    if (defaultText) {
      console.warn(`文字鍵 "${key}" 在語言 "${currentLanguage.value}" 中不存在，使用預設語言`)
      return defaultText
    }
  }

  // 如果都找不到，使用備用文字或鍵名
  const result = fallback || key
  console.warn(`找不到文字鍵 "${key}" 的本地化文字，使用: "${result}"`)
  return result
}

/**
 * 取得語言顯示名稱
 * @param language 語言代碼
 * @returns 語言的顯示名稱
 */
function getLanguageDisplayName(language: Language): string {
  const displayNames: Record<Language, string> = {
    zh: '繁體中文',
    en: 'English'
  }

  return displayNames[language] || language
}

/**
 * 檢查是否為目前語言
 * @param language 要檢查的語言
 * @returns 是否為目前語言
 */
function isCurrentLanguage(language: Language): boolean {
  return currentLanguage.value === language
}

/**
 * 取得所有支援的語言清單
 * @returns 語言清單，包含代碼和顯示名稱
 */
function getSupportedLanguages(): Array<{ code: Language; name: string }> {
  return APP_CONSTANTS.SUPPORTED_LANGUAGES.map(lang => ({
    code: lang,
    name: getLanguageDisplayName(lang)
  }))
}

/**
 * useLanguage 組合式函數
 * @returns UseLanguageReturn 物件
 */
export function useLanguage(): UseLanguageReturn {
  // 確保已初始化
  if (!isInitialized) {
    initializeLanguage()
  }

  // 計算屬性：是否為中文
  const isChineseMode = computed(() => currentLanguage.value === 'zh')

  // 計算屬性：是否為英文
  const isEnglishMode = computed(() => currentLanguage.value === 'en')

  // 計算屬性：當前語言的顯示名稱
  const currentLanguageDisplayName = computed(() =>
    getLanguageDisplayName(currentLanguage.value)
  )

  return {
    // 響應式資料
    currentLanguage: currentLanguage,

    // 計算屬性
    isChineseMode,
    isEnglishMode,
    currentLanguageDisplayName,

    // 方法
    switchLanguage,
    toggleLanguage,
    getText,
    getLanguageDisplayName,
    isCurrentLanguage,
    getSupportedLanguages
  }
}

/**
 * 取得題目的本地化內容
 * @param question 題目物件
 * @param language 語言
 * @returns 本地化的題目內容
 */
export function getLocalizedQuestionContent(
  question: any,
  language: Language
): {
  questionText: string
  options: string[]
} {
  const questionText = language === 'zh' && question.question_text_zh
    ? question.question_text_zh
    : question.question_text_en

  const options = language === 'zh' && question.options_zh && question.options_zh.length > 0
    ? question.options_zh
    : question.options_en

  return {
    questionText,
    options
  }
}

/**
 * 格式化本地化文字（替換參數）
 * @param template 文字範本（可包含 {0}, {1} 等參數）
 * @param params 參數陣列
 * @returns 格式化後的文字
 */
export function formatText(template: string, ...params: string[]): string {
  return template.replace(/\{(\d+)\}/g, (match, index) => {
    const paramIndex = parseInt(index, 10)
    return params[paramIndex] || match
  })
}

/**
 * 取得方向相關的 CSS 類別（為未來 RTL 語言支援預留）
 * @param language 語言
 * @returns CSS 方向類別
 */
export function getDirectionClass(language: Language): string {
  // 目前所有支援的語言都是 LTR
  return 'ltr'
}