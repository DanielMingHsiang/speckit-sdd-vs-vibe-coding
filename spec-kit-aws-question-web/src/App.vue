<template>
  <div class="app-container">
    <!-- 應用程式標題欄 -->
    <header class="app-header">
      <h1>{{ getText('app.title') }}</h1>
      <LanguageToggle @language-changed="handleLanguageChange" />
    </header>

    <!-- 主要內容區域 -->
    <main class="app-main">
      <!-- 載入狀態 -->
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <span>{{ getText('loading.questions') }}</span>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button class="btn btn--primary" @click="reloadQuestions">
          {{ getText('error.retry') }}
        </button>
      </div>

      <!-- 題目內容 -->
      <div v-else-if="hasQuestions" class="questions-container">
        <!-- 頁面資訊顯示 -->
        <div class="page-header">
          <div class="page-info">
            <span class="page-summary">
              {{ formatText(getText('pagination.showingQuestions'),
                  paginationInfo.currentPage.toString(),
                  paginationInfo.totalPages.toString()) }}
            </span>
          </div>

          <!-- 批次操作按鈕 -->
          <div class="batch-controls">
            <button
              class="btn btn--secondary btn--small"
              @click="toggleAllAnswers"
              :title="allAnswersVisible ? getText('question.hideAllAnswers') : getText('question.showAllAnswers')"
            >
              {{ allAnswersVisible ? getText('question.hideAllAnswers') : getText('question.showAllAnswers') }}
            </button>
            <button
              class="btn btn--secondary btn--small"
              @click="toggleAllExplanations"
              :title="allExplanationsVisible ? getText('question.hideAllExplanations') : getText('question.showAllExplanations')"
            >
              {{ allExplanationsVisible ? getText('question.hideAllExplanations') : getText('question.showAllExplanations') }}
            </button>
          </div>
        </div>

        <!-- 題目卡片列表 -->
        <div class="questions-list">
          <QuestionCard
            v-for="question in currentPageQuestions"
            :key="question.question_number"
            :question="question"
          />
        </div>

        <!-- 分頁導航 -->
        <Pagination
          @page-changed="handlePageChange"
          @pagination-action="handlePaginationAction"
        />
      </div>

      <!-- 空狀態 -->
      <div v-else class="empty-state">
        <p>{{ getText('questions.empty') }}</p>
        <button class="btn btn--primary" @click="reloadQuestions">
          {{ getText('questions.reload') }}
        </button>
      </div>
    </main>

    <!-- 返回頂部按鈕 -->
    <Transition name="fade">
      <button
        v-show="showBackToTop"
        class="back-to-top"
        @click="scrollToTop"
        :title="getText('navigation.backToTop')"
        :aria-label="getText('navigation.backToTop')"
      >
        <span class="back-to-top-icon">⬆️</span>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import type { Language } from '@/types/types'

// 組件引入
import QuestionCard from '@/components/QuestionCard.vue'
import LanguageToggle from '@/components/LanguageToggle.vue'
import Pagination from '@/components/Pagination.vue'

// Composables 引入
import { useQuestions } from '@/composables/useQuestions'
import { useLanguage, formatText } from '@/composables/useLanguage'
import { usePagination } from '@/composables/usePagination'
import { useCollapsedStates } from '@/composables/useCollapsedStates'

// ============================================================================
// 響應式資料與狀態管理
// ============================================================================

// 題目資料管理
const { questions, isLoading, error, reload: reloadQuestions, hasQuestions } = useQuestions()

// 語言管理
const { getText } = useLanguage()

// 分頁管理
const { paginationInfo } = usePagination()

// 摺疊狀態管理
const {
  showAllAnswersOnPage,
  hideAllAnswersOnPage,
  showAllExplanationsOnPage,
  hideAllExplanationsOnPage,
  getCollapsedStatesStats
} = useCollapsedStates()

// 返回頂部相關
const showBackToTop = ref(false)

// ============================================================================
// 計算屬性
// ============================================================================

// 當前頁面的題目
const currentPageQuestions = computed(() => paginationInfo.value.questionsOnCurrentPage)

// 當前頁面的題目編號
const currentPageQuestionNumbers = computed(() =>
  currentPageQuestions.value.map(q => q.question_number)
)

// 批次操作狀態
const collapsedStats = computed(() => getCollapsedStatesStats())

const allAnswersVisible = computed(() => {
  const currentPageCount = currentPageQuestions.value.length
  if (currentPageCount === 0) return false

  return currentPageQuestionNumbers.value.every(questionNumber => {
    const state = useCollapsedStates().getCollapsedState(questionNumber)
    return !state.answerCollapsed
  })
})

const allExplanationsVisible = computed(() => {
  const currentPageCount = currentPageQuestions.value.length
  if (currentPageCount === 0) return false

  return currentPageQuestionNumbers.value.every(questionNumber => {
    const state = useCollapsedStates().getCollapsedState(questionNumber)
    return !state.explanationCollapsed
  })
})

// ============================================================================
// 事件處理方法
// ============================================================================

/**
 * 處理語言變更
 */
function handleLanguageChange(newLanguage: Language) {
  console.log('語言已切換至:', newLanguage)
  // 語言變更時滾動到頂部
  scrollToTop()
}

/**
 * 處理分頁變更
 */
function handlePageChange(newPage: number) {
  console.log('頁面已切換至:', newPage)
  // 分頁變更時滾動到頂部
  scrollToTop()
}

/**
 * 處理分頁操作
 */
function handlePaginationAction(action: string, page: number) {
  console.log('分頁操作:', action, '頁面:', page)
}

/**
 * 切換當前頁面所有答案的顯示狀態
 */
function toggleAllAnswers() {
  if (allAnswersVisible.value) {
    hideAllAnswersOnPage(currentPageQuestionNumbers.value)
  } else {
    showAllAnswersOnPage(currentPageQuestionNumbers.value)
  }
}

/**
 * 切換當前頁面所有詳解的顯示狀態
 */
function toggleAllExplanations() {
  if (allExplanationsVisible.value) {
    hideAllExplanationsOnPage(currentPageQuestionNumbers.value)
  } else {
    showAllExplanationsOnPage(currentPageQuestionNumbers.value)
  }
}

/**
 * 滾動到頂部
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * 處理滾動事件
 */
function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

// ============================================================================
// 生命週期鉤子
// ============================================================================

onMounted(() => {
  // 添加滾動事件監聽器
  window.addEventListener('scroll', handleScroll)

  // 載入儲存的狀態（自動在 composables 中處理）
  console.log('AWS 證照考題複習網頁已載入')
})

onUnmounted(() => {
  // 移除事件監聽器
  window.removeEventListener('scroll', handleScroll)
})

// ============================================================================
// 監聽器
// ============================================================================

// 監聽題目載入狀態變化
watch(isLoading, (newLoading) => {
  if (!newLoading && hasQuestions.value) {
    console.log(`已載入 ${questions.value.length} 道題目`)
  }
})

// 監聽錯誤狀態
watch(error, (newError) => {
  if (newError) {
    console.error('題目載入錯誤:', newError)
  }
})

// 監聽頁面變更，確保內容可見
watch(() => paginationInfo.value.currentPage, async () => {
  await nextTick()

  // 如果用戶滾動太深，自動回到頂部
  if (window.scrollY > window.innerHeight) {
    scrollToTop()
  }
})
</script>

<style lang="scss">
// 引入主要樣式
@import '@/assets/styles/main.scss';

// ============================================================================
// 應用程式特定樣式
// ============================================================================

.questions-container {
  width: 100%;
}

.page-header {
  @include flex-between;
  margin-bottom: $spacing-lg;
  padding: $spacing-md;
  background: $background-primary;
  border-radius: $border-radius-lg;
  border: $border-width solid $border-color;
  @include card-shadow;

  @include mobile {
    flex-direction: column;
    gap: $spacing-sm;
    align-items: stretch;
    margin-bottom: $spacing-md;
    padding: $spacing-sm;
  }
}

.page-info {
  .page-summary {
    font-size: $font-size-sm;
    color: $text-secondary;
    font-weight: $font-weight-medium;

    @include mobile {
      text-align: center;
      display: block;
    }
  }
}

.batch-controls {
  display: flex;
  gap: $spacing-sm;

  @include mobile {
    justify-content: center;
  }
}

.questions-list {
  margin-bottom: $spacing-xl;

  // 確保分頁導航不會覆蓋最後一個題目
  padding-bottom: $spacing-lg;
}

.empty-state {
  @include flex-center;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-xxl;
  text-align: center;
  color: $text-secondary;

  p {
    font-size: $font-size-lg;
    margin: 0;
  }
}

// 返回頂部按鈕
.back-to-top {
  @include button-reset;
  position: fixed;
  bottom: calc(#{$pagination-height} + #{$spacing-lg});
  right: $spacing-lg;
  width: 48px;
  height: 48px;
  background: $primary-color;
  color: white;
  border-radius: 50%;
  @include flex-center;
  box-shadow: 0 4px 12px rgba(35, 47, 62, 0.3);
  transition: all $transition-normal;
  z-index: $z-index-dropdown;

  @include mobile {
    bottom: calc(#{$pagination-height} + #{$spacing-md});
    right: $spacing-md;
    width: 40px;
    height: 40px;
  }

  &:hover {
    background: lighten($primary-color, 10%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(35, 47, 62, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(35, 47, 62, 0.3);
  }

  .back-to-top-icon {
    font-size: $font-size-lg;
    line-height: 1;
  }
}

// 淡入淡出動畫
.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-normal;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 深色模式支援 (預留)
@media (prefers-color-scheme: dark) {
  .page-header {
    background: darken($background-primary, 5%);
    border-color: darken($border-color, 10%);
  }

  .back-to-top {
    background: lighten($primary-color, 10%);
  }
}

// 高對比模式支援
@media (prefers-contrast: high) {
  .page-header {
    border-width: $border-width-thick;
  }

  .back-to-top {
    border: $border-width-thick solid white;
  }
}

// 減少動畫偏好
@media (prefers-reduced-motion) {
  .back-to-top {
    transition: none;
  }

  .back-to-top:hover {
    transform: none;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>