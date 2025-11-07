<template>
  <div class="question-card" :class="questionCardClasses">
    <!-- 題目標題區 -->
    <div class="question-header">
      <div class="question-number">
        <span class="question-label">{{ getText('question.number') }}</span>
        <span class="number">{{ question.question_number }}</span>
      </div>
      <div class="question-type-badge" :class="answerTypeBadgeClass">
        {{ answerTypeText }}
      </div>
    </div>

    <!-- 題目內容 -->
    <div class="question-content">
      <div class="question-text" v-html="formattedQuestionText"></div>
    </div>

    <!-- 選項區域 -->
    <div class="question-options">
      <div
        v-for="(option, index) in displayOptions"
        :key="index"
        class="option-item"
        :class="getOptionClasses(index)"
      >
        <span class="option-label">{{ getOptionLabel(index) }}</span>
        <span class="option-text" v-html="option"></span>
      </div>
    </div>

    <!-- 控制按鈕區 -->
    <div class="question-controls">
      <button
        class="control-button answer-button"
        :class="{ active: !collapsedState.answerCollapsed }"
        @click="toggleAnswer"
        :aria-expanded="!collapsedState.answerCollapsed"
      >
        <span class="button-icon">👁️</span>
        <span class="button-text">
          {{ collapsedState.answerCollapsed ? getText('question.showAnswer') : getText('question.hideAnswer') }}
        </span>
      </button>

      <button
        v-if="hasExplanation"
        class="control-button explanation-button"
        :class="{ active: !collapsedState.explanationCollapsed }"
        @click="toggleExplanation"
        :aria-expanded="!collapsedState.explanationCollapsed"
      >
        <span class="button-icon">📚</span>
        <span class="button-text">
          {{ collapsedState.explanationCollapsed ? getText('question.showExplanation') : getText('question.hideExplanation') }}
        </span>
      </button>
    </div>

    <!-- 答案區域 -->
    <Transition name="slide-down">
      <div v-show="!collapsedState.answerCollapsed" class="answer-section">
        <div class="section-header">
          <span class="section-icon">✅</span>
          <span class="section-title">{{ getText('question.correctAnswer') }}</span>
        </div>
        <div class="answer-content">
          <div class="correct-answers">
            <span
              v-for="answer in correctAnswerArray"
              :key="answer"
              class="answer-badge"
              :class="answerBadgeClass"
            >
              {{ answer }}
            </span>
          </div>
          <div v-if="answerType === 'multiple'" class="answer-note">
            {{ getText('question.multipleAnswerNote') }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- 詳解區域 -->
    <Transition name="slide-down">
      <div v-show="!collapsedState.explanationCollapsed && hasExplanation" class="explanation-section">
        <div class="section-header">
          <span class="section-icon">💡</span>
          <span class="section-title">{{ getText('question.explanation') }}</span>
        </div>
        <div class="explanation-content">
          <div class="explanation-text" v-html="formattedExplanation"></div>
          <div v-if="question.tips && question.tips.length > 0" class="tips-section">
            <div class="tips-header">{{ getText('question.tips') }}</div>
            <ul class="tips-list">
              <li v-for="(tip, index) in question.tips" :key="index" class="tip-item">
                {{ tip }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Question } from '@/types/types'
import { useLanguage } from '@/composables/useLanguage'
import { useCollapsedStates } from '@/composables/useCollapsedStates'
import { questionUtils } from '@/utils/questionHelpers'

// Props 定義
interface Props {
  question: Question
}

const props = defineProps<Props>()

// 組合式函數
const { currentLanguage, getText } = useLanguage()
const { getCollapsedState, toggleAnswer: toggleAnswerState, toggleExplanation: toggleExplanationState } = useCollapsedStates()

// 計算屬性：摺疊狀態
const collapsedState = computed(() => getCollapsedState(props.question.question_number))

// 計算屬性：答案類型
const answerType = computed(() => questionUtils.getAnswerType(props.question.correct_answer))

// 計算屬性：正確答案陣列
const correctAnswerArray = computed(() =>
  questionUtils.parseCorrectAnswers(props.question.correct_answer)
)

// 計算屬性：顯示的題目文字
const displayQuestionText = computed(() =>
  questionUtils.getQuestionText(props.question, currentLanguage.value)
)

// 計算屬性：顯示的選項
const displayOptions = computed(() =>
  questionUtils.getOptions(props.question, currentLanguage.value)
)

// 計算屬性：格式化的題目文字
const formattedQuestionText = computed(() => {
  return displayQuestionText.value.replace(/\n/g, '<br>')
})

// 計算屬性：格式化的詳解
const formattedExplanation = computed(() => {
  return props.question.explanation.replace(/\n/g, '<br>')
})

// 計算屬性：是否有詳解
const hasExplanation = computed(() =>
  props.question.explanation && props.question.explanation.trim().length > 0
)

// 計算屬性：答案類型文字
const answerTypeText = computed(() => {
  return answerType.value === 'multiple'
    ? getText('question.multipleChoice')
    : getText('question.singleChoice')
})

// 計算屬性：QuestionCard 的 CSS 類別
const questionCardClasses = computed(() => ({
  'single-choice': answerType.value === 'single',
  'multiple-choice': answerType.value === 'multiple',
  'answer-visible': !collapsedState.value.answerCollapsed,
  'explanation-visible': !collapsedState.value.explanationCollapsed
}))

// 計算屬性：答案類型徽章的類別
const answerTypeBadgeClass = computed(() => ({
  'single-choice-badge': answerType.value === 'single',
  'multiple-choice-badge': answerType.value === 'multiple'
}))

// 計算屬性：答案徽章的類別
const answerBadgeClass = computed(() => ({
  'single-answer': answerType.value === 'single',
  'multiple-answer': answerType.value === 'multiple'
}))

// 方法：取得選項標籤
function getOptionLabel(index: number): string {
  return String.fromCharCode(65 + index) // A, B, C, D...
}

// 方法：取得選項的 CSS 類別
function getOptionClasses(index: number) {
  const label = getOptionLabel(index)
  const isCorrect = correctAnswerArray.value.includes(label)

  return {
    'option-correct': isCorrect && !collapsedState.value.answerCollapsed,
    'option-highlight': !collapsedState.value.answerCollapsed
  }
}

// 方法：切換答案顯示
function toggleAnswer() {
  toggleAnswerState(props.question.question_number)
}

// 方法：切換詳解顯示
function toggleExplanation() {
  toggleExplanationState(props.question.question_number)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/components/question-card.scss';
</style>