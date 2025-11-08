import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QuestionCard from '../QuestionCard.vue'
import type { Question } from '@/types/types'

// 簡單的 mock 策略
const mockGetText = vi.fn((key: string) => {
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
})

const mockGetCollapsedState = vi.fn(() => ({
  answerCollapsed: true,
  explanationCollapsed: true
}))

const mockToggleAnswer = vi.fn()
const mockToggleExplanation = vi.fn()

// Mock composables
vi.mock('@/composables/useLanguage', () => ({
  useLanguage: () => ({
    currentLanguage: { value: 'zh' },
    getText: mockGetText
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
    getAnswerType: vi.fn((answer: string) => answer.length > 1 ? 'multiple' : 'single'),
    parseCorrectAnswers: vi.fn((answer: string) => answer.split('')),
    getQuestionText: vi.fn((question: Question, lang: string) =>
      lang === 'zh' ? question.question_text_zh : question.question_text_en
    ),
    getOptions: vi.fn((question: Question, lang: string) =>
      lang === 'zh' ? question.options_zh : question.options_en
    )
  }
}))

describe('QuestionCard 基本功能測試', () => {
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

  beforeEach(() => {
    vi.clearAllMocks()
    // 重置 mock 的返回值
    mockGetCollapsedState.mockReturnValue({
      answerCollapsed: true,
      explanationCollapsed: true
    })
  })

  describe('基本渲染測試', () => {
    it('應該正確渲染題目基本資訊', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      // 檢查題目編號
      expect(wrapper.find('.question-number .number').text()).toBe('1')

      // 檢查是否有必要的組件結構
      expect(wrapper.find('.question-card').exists()).toBe(true)
      expect(wrapper.find('.question-header').exists()).toBe(true)
      expect(wrapper.find('.question-content').exists()).toBe(true)
      expect(wrapper.find('.question-options').exists()).toBe(true)
      expect(wrapper.find('.question-controls').exists()).toBe(true)
    })

    it('應該渲染答案和詳解按鈕', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      expect(wrapper.find('.answer-button').exists()).toBe(true)
      expect(wrapper.find('.explanation-button').exists()).toBe(true)
    })

    it('應該顯示四個選項', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      const optionItems = wrapper.findAll('.option-item')
      expect(optionItems).toHaveLength(4)
    })
  })

  describe('互動功能測試', () => {
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

  describe('摺疊狀態測試', () => {
    it('預設狀態下答案區域應該隱藏', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      expect(wrapper.find('.answer-section').isVisible()).toBe(false)
    })

    it('預設狀態下詳解區域應該隱藏', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      expect(wrapper.find('.explanation-section').isVisible()).toBe(false)
    })

    it('當答案展開時應該顯示答案區域', () => {
      mockGetCollapsedState.mockReturnValue({
        answerCollapsed: false,
        explanationCollapsed: true
      })

      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      expect(wrapper.find('.answer-section').isVisible()).toBe(true)
    })

    it('當詳解展開時應該顯示詳解區域', () => {
      mockGetCollapsedState.mockReturnValue({
        answerCollapsed: true,
        explanationCollapsed: false
      })

      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

      expect(wrapper.find('.explanation-section').isVisible()).toBe(true)
    })
  })

  describe('無障礙功能測試', () => {
    it('按鈕應該有 aria-expanded 屬性', () => {
      const wrapper = mount(QuestionCard, {
        props: { question: mockQuestion }
      })

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

  describe('特殊情況測試', () => {
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

    it('應該正確處理多選題', () => {
      const multipleChoiceQuestion: Question = {
        ...mockQuestion,
        correct_answer: 'ABC'
      }

      const wrapper = mount(QuestionCard, {
        props: { question: multipleChoiceQuestion }
      })

      // 應該有多選題的標識
      expect(wrapper.find('.question-type-badge').exists()).toBe(true)
    })
  })
})