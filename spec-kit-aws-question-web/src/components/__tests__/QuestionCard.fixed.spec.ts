import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QuestionCard from '../QuestionCard.vue'
import type { Question } from '@/types/types'

// 創建全域 mock 函數
const mockToggleAnswer = vi.fn()
const mockToggleExplanation = vi.fn()
const mockGetCollapsedState = vi.fn(() => ({
  answerCollapsed: true,
  explanationCollapsed: true
}))

// Mock composables
vi.mock('@/composables/useLanguage', () => ({
  useLanguage: () => ({
    currentLanguage: { value: 'zh' },
    getText: (key: string) => {
      const translations: Record<string, string> = {
        'question.number': '題目',
        'question.showAnswer': '顯示答案',
        'question.hideAnswer': '隱藏答案',
        'question.showExplanation': '顯示詳解',
        'question.hideExplanation': '隱藏詳解',
        'question.correctAnswer': '正確答案',
        'question.explanation': '詳解',
        'question.tips': '提示',
        'question.multipleChoice': '多選題',
        'question.singleChoice': '單選題',
        'question.multipleAnswerNote': '此為多選題，請選擇所有正確答案'
      }
      return translations[key] || key
    }
  })
}))

vi.mock('@/composables/useCollapsedStates', () => ({
  useCollapsedStates: () => ({
    getCollapsedState: mockGetCollapsedState,
    toggleAnswer: mockToggleAnswer,
    toggleExplanation: mockToggleExplanation
  })
}))

vi.mock('@/utils/questionHelpers', () => ({
  questionUtils: {
    getAnswerType: (answer: string) => answer.length > 1 ? 'multiple' : 'single',
    parseCorrectAnswers: (answer: string) => answer.split(''),
    getQuestionText: (question: Question, lang: string) =>
      lang === 'zh' ? question.question_text_zh : question.question_text_en,
    getOptions: (question: Question, lang: string) =>
      lang === 'zh' ? question.options_zh : question.options_en
  }
}))

describe('QuestionCard - 修復版本', () => {
  const mockQuestion: Question = {
    question_number: 1,
    question_text_en: 'What is AWS?',
    question_text_zh: '什麼是 AWS？',
    options_en: ['Amazon Web Services', 'Amazon Web Storage', 'Amazon Web System', 'Amazon Web Security'],
    options_zh: ['亞馬遜網路服務', '亞馬遜網路儲存', '亞馬遜網路系統', '亞馬遜網路安全'],
    correct_answer: 'A',
    explanation: '這是關於 AWS 的說明。',
    tips: ['提示1', '提示2']
  }

  const mockMultipleChoiceQuestion: Question = {
    question_number: 2,
    question_text_en: 'Which are AWS services?',
    question_text_zh: '以下哪些是 AWS 服務？',
    options_en: ['EC2', 'S3', 'RDS', 'Azure VM'],
    options_zh: ['EC2', 'S3', 'RDS', 'Azure VM'],
    correct_answer: 'ABC',
    explanation: '多選題說明。',
    tips: []
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // 重置 mock 回到預設狀態
    mockGetCollapsedState.mockReturnValue({
      answerCollapsed: true,
      explanationCollapsed: true
    })
  })

  describe('基本渲染', () => {
    it('應該正確渲染題目基本資訊', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      // 檢查題目編號
      expect(wrapper.find('.question-number .number').text()).toBe('1')

      // 檢查題目內容
      expect(wrapper.find('.question-text').element.innerHTML).toContain('什麼是 AWS？')

      // 檢查選項數量
      expect(wrapper.findAll('.option-item')).toHaveLength(4)

      // 檢查選項標籤 (A, B, C, D)
      const optionLabels = wrapper.findAll('.option-label')
      expect(optionLabels[0].text()).toBe('A')
      expect(optionLabels[1].text()).toBe('B')
      expect(optionLabels[2].text()).toBe('C')
      expect(optionLabels[3].text()).toBe('D')
    })

    it('應該正確顯示單選題標識', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      expect(wrapper.find('.question-type-badge').text()).toBe('單選題')
      expect(wrapper.find('.question-card').classes()).toContain('single-choice')
    })

    it('應該正確顯示多選題標識', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockMultipleChoiceQuestion }
      })

      expect(wrapper.find('.question-type-badge').text()).toBe('多選題')
      expect(wrapper.find('.question-card').classes()).toContain('multiple-choice')
    })
  })

  describe('摺疊功能', () => {
    it('預設狀態下答案和詳解應該都是摺疊的', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      // 答案區域應該隱藏
      expect(wrapper.find('.answer-section').isVisible()).toBe(false)

      // 詳解區域應該隱藏
      expect(wrapper.find('.explanation-section').isVisible()).toBe(false)

      // 按鈕文字應該顯示「顯示」
      expect(wrapper.find('.answer-button .button-text').text()).toBe('顯示答案')
      expect(wrapper.find('.explanation-button .button-text').text()).toBe('顯示詳解')
    })

    it('點擊答案按鈕應該呼叫 toggleAnswer', async () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      await wrapper.find('.answer-button').trigger('click')
      expect(mockToggleAnswer).toHaveBeenCalledWith(1)
    })

    it('點擊詳解按鈕應該呼叫 toggleExplanation', async () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      await wrapper.find('.explanation-button').trigger('click')
      expect(mockToggleExplanation).toHaveBeenCalledWith(1)
    })
  })

  describe('答案顯示', () => {
    it('當答案展開時應該顯示正確答案', () => {
      mockGetCollapsedState.mockReturnValue({
        answerCollapsed: false, // 答案展開
        explanationCollapsed: true
      })

      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      // 答案區域應該可見
      expect(wrapper.find('.answer-section').isVisible()).toBe(true)

      // 正確答案應該顯示
      expect(wrapper.find('.answer-badge').text()).toBe('A')

      // 按鈕文字應該變為「隱藏」
      expect(wrapper.find('.answer-button .button-text').text()).toBe('隱藏答案')

      // 正確選項應該有高亮樣式
      expect(wrapper.findAll('.option-item')[0].classes()).toContain('option-correct')
    })

    it('多選題應該顯示所有正確答案', () => {
      mockGetCollapsedState.mockReturnValue({
        answerCollapsed: false,
        explanationCollapsed: true
      })

      const wrapper = mount(QuestionCard, {
        props: { question: mockMultipleChoiceQuestion }
      })

      const answerBadges = wrapper.findAll('.answer-badge')
      expect(answerBadges).toHaveLength(3) // A, B, C
      expect(answerBadges[0].text()).toBe('A')
      expect(answerBadges[1].text()).toBe('B')
      expect(answerBadges[2].text()).toBe('C')

      // 應該顯示多選題說明
      expect(wrapper.find('.answer-note').text()).toBe('此為多選題，請選擇所有正確答案')
    })
  })

  describe('詳解顯示', () => {
    it('當詳解展開時應該顯示詳解內容', () => {
      mockGetCollapsedState.mockReturnValue({
        answerCollapsed: true,
        explanationCollapsed: false // 詳解展開
      })

      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      // 詳解區域應該可見
      expect(wrapper.find('.explanation-section').isVisible()).toBe(true)

      // 詳解內容應該顯示
      expect(wrapper.find('.explanation-text').element.innerHTML).toContain('這是關於 AWS 的說明。')

      // 按鈕文字應該變為「隱藏」
      expect(wrapper.find('.explanation-button .button-text').text()).toBe('隱藏詳解')
    })

    it('應該顯示提示內容', () => {
      mockGetCollapsedState.mockReturnValue({
        answerCollapsed: true,
        explanationCollapsed: false
      })

      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      const tipItems = wrapper.findAll('.tip-item')
      expect(tipItems).toHaveLength(2)
      expect(tipItems[0].text()).toBe('提示1')
      expect(tipItems[1].text()).toBe('提示2')
    })

    it('沒有詳解時不應該顯示詳解按鈕', () => {
      const questionWithoutExplanation: Question = {
        ...mockQuestion,
        explanation: ''
      }

      const wrapper = mount(QuestionCard, {
        props: { question: questionWithoutExplanation }
      })

      expect(wrapper.find('.explanation-button').exists()).toBe(false)
    })
  })

  describe('無障礙功能', () => {
    it('按鈕應該有正確的 aria-expanded 屬性', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      // 摺疊狀態下應該是 false
      expect(wrapper.find('.answer-button').attributes('aria-expanded')).toBe('false')
      expect(wrapper.find('.explanation-button').attributes('aria-expanded')).toBe('false')
    })

    it('展開狀態下 aria-expanded 應該是 true', () => {
      mockGetCollapsedState.mockReturnValue({
        answerCollapsed: false,
        explanationCollapsed: false
      })

      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      expect(wrapper.find('.answer-button').attributes('aria-expanded')).toBe('true')
      expect(wrapper.find('.explanation-button').attributes('aria-expanded')).toBe('true')
    })
  })

  describe('CSS 類別', () => {
    it('應該根據摺疊狀態添加正確的 CSS 類別', () => {
      mockGetCollapsedState.mockReturnValue({
        answerCollapsed: false,
        explanationCollapsed: false
      })

      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      const questionCard = wrapper.find('.question-card')
      expect(questionCard.classes()).toContain('answer-visible')
      expect(questionCard.classes()).toContain('explanation-visible')
    })

    it('按鈕在啟用狀態下應該有 active 類別', () => {
      mockGetCollapsedState.mockReturnValue({
        answerCollapsed: false,
        explanationCollapsed: false
      })

      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      expect(wrapper.find('.answer-button').classes()).toContain('active')
      expect(wrapper.find('.explanation-button').classes()).toContain('active')
    })
  })
})