<template>
  <div v-if="shouldShowPagination" class="pagination-wrapper">
    <!-- 頁面資訊顯示 -->
    <div class="pagination-info">
      <div class="page-range">
        <span class="range-text">{{ pageRangeInfo.rangeText }}</span>
        <span class="questions-text">{{ getText('pagination.questions') }}</span>
      </div>
      <div class="current-page-info">
        <span class="page-text">{{ getText('pagination.page') }}</span>
        <span class="page-number">{{ paginationInfo.currentPage }}</span>
        <span class="page-separator">/</span>
        <span class="total-pages">{{ paginationInfo.totalPages }}</span>
      </div>
    </div>

    <!-- 分頁控制項 -->
    <nav class="pagination-nav" :aria-label="getText('pagination.navigation')">
      <!-- 第一頁按鈕 -->
      <button
        class="pagination-button first-page"
        :disabled="!paginationInfo.hasPreviousPage"
        @click="handleGoToFirstPage"
        :title="getText('pagination.firstPage')"
        :aria-label="getText('pagination.firstPage')"
      >
        <span class="button-icon">⏮️</span>
        <span class="button-text">{{ getText('pagination.first') }}</span>
      </button>

      <!-- 上一頁按鈕 -->
      <button
        class="pagination-button previous-page"
        :disabled="!paginationInfo.hasPreviousPage"
        @click="handlePreviousPage"
        :title="getText('pagination.previousPage')"
        :aria-label="getText('pagination.previousPage')"
      >
        <span class="button-icon">⬅️</span>
        <span class="button-text">{{ getText('pagination.previous') }}</span>
      </button>

      <!-- 頁碼按鈕 -->
      <div class="page-numbers">
        <template v-for="button in paginationButtons" :key="button.page">
          <!-- 省略號 -->
          <span v-if="button.isEllipsis" class="pagination-ellipsis">
            ...
          </span>
          <!-- 頁碼按鈕 -->
          <button
            v-else
            class="pagination-button page-number"
            :class="{
              'current-page': button.isCurrent,
              'other-page': !button.isCurrent
            }"
            @click="handleGoToPage(button.page)"
            :aria-current="button.isCurrent ? 'page' : undefined"
            :aria-label="formatText(getText('pagination.goToPage'), button.page.toString())"
          >
            {{ button.page }}
          </button>
        </template>
      </div>

      <!-- 下一頁按鈕 -->
      <button
        class="pagination-button next-page"
        :disabled="!paginationInfo.hasNextPage"
        @click="handleNextPage"
        :title="getText('pagination.nextPage')"
        :aria-label="getText('pagination.nextPage')"
      >
        <span class="button-text">{{ getText('pagination.next') }}</span>
        <span class="button-icon">➡️</span>
      </button>

      <!-- 最後一頁按鈕 -->
      <button
        class="pagination-button last-page"
        :disabled="!paginationInfo.hasNextPage"
        @click="handleGoToLastPage"
        :title="getText('pagination.lastPage')"
        :aria-label="getText('pagination.lastPage')"
      >
        <span class="button-text">{{ getText('pagination.last') }}</span>
        <span class="button-icon">⏭️</span>
      </button>
    </nav>

    <!-- 快速跳轉（桌面版） -->
    <div class="quick-jump">
      <label class="jump-label" for="page-input">
        {{ getText('pagination.jumpTo') }}
      </label>
      <div class="jump-input-group">
        <input
          id="page-input"
          v-model.number="jumpToPageInput"
          type="number"
          class="jump-input"
          :min="1"
          :max="paginationInfo.totalPages"
          @keyup.enter="handleJumpToPage"
          @blur="handleJumpToPage"
          :placeholder="getText('pagination.pageNumber')"
        />
        <button
          class="jump-button"
          @click="handleJumpToPage"
          :disabled="!isValidJumpPage"
          :aria-label="getText('pagination.jumpButton')"
        >
          {{ getText('pagination.go') }}
        </button>
      </div>
    </div>

    <!-- 行動版簡化控制項 -->
    <div class="mobile-pagination">
      <button
        class="mobile-button mobile-previous"
        :disabled="!paginationInfo.hasPreviousPage"
        @click="handlePreviousPage"
      >
        <span class="mobile-icon">⬅️</span>
        {{ getText('pagination.prev') }}
      </button>

      <div class="mobile-page-info">
        {{ paginationInfo.currentPage }} / {{ paginationInfo.totalPages }}
      </div>

      <button
        class="mobile-button mobile-next"
        :disabled="!paginationInfo.hasNextPage"
        @click="handleNextPage"
      >
        {{ getText('pagination.next') }}
        <span class="mobile-icon">➡️</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguage, formatText } from '@/composables/useLanguage'
import { usePagination } from '@/composables/usePagination'

// 組合式函數
const { getText } = useLanguage()
const {
  paginationInfo,
  pageRangeInfo,
  paginationButtons,
  shouldShowPagination,
  goToPage,
  nextPage,
  previousPage,
  goToFirstPage,
  goToLastPage
} = usePagination()

// 快速跳轉的輸入值
const jumpToPageInput = ref<number | undefined>()

// 計算屬性：跳轉頁面是否有效
const isValidJumpPage = computed(() => {
  return (
    jumpToPageInput.value &&
    jumpToPageInput.value >= 1 &&
    jumpToPageInput.value <= paginationInfo.value.totalPages &&
    jumpToPageInput.value !== paginationInfo.value.currentPage
  )
})

// 方法：處理快速跳轉
function handleJumpToPage() {
  if (isValidJumpPage.value && jumpToPageInput.value) {
    goToPage(jumpToPageInput.value)
    jumpToPageInput.value = undefined // 清空輸入框
  }
}

// 發出事件
const emit = defineEmits<{
  pageChanged: [page: number]
  paginationAction: [action: string, page: number]
}>()

// 包裝分頁方法以發出事件
function emitPageChange(newPage: number, action: string) {
  emit('pageChanged', newPage)
  emit('paginationAction', action, newPage)
}

// 重新定義分頁方法以包含事件發出
function handleGoToPage(page: number) {
  const oldPage = paginationInfo.value.currentPage
  goToPage(page)
  if (paginationInfo.value.currentPage !== oldPage) {
    emitPageChange(paginationInfo.value.currentPage, 'goto')
  }
}

function handleNextPage() {
  const oldPage = paginationInfo.value.currentPage
  nextPage()
  if (paginationInfo.value.currentPage !== oldPage) {
    emitPageChange(paginationInfo.value.currentPage, 'next')
  }
}

function handlePreviousPage() {
  const oldPage = paginationInfo.value.currentPage
  previousPage()
  if (paginationInfo.value.currentPage !== oldPage) {
    emitPageChange(paginationInfo.value.currentPage, 'previous')
  }
}

function handleGoToFirstPage() {
  const oldPage = paginationInfo.value.currentPage
  goToFirstPage()
  if (paginationInfo.value.currentPage !== oldPage) {
    emitPageChange(paginationInfo.value.currentPage, 'first')
  }
}

function handleGoToLastPage() {
  const oldPage = paginationInfo.value.currentPage
  goToLastPage()
  if (paginationInfo.value.currentPage !== oldPage) {
    emitPageChange(paginationInfo.value.currentPage, 'last')
  }
}

// 使用包裝後的函數（它們已經在模板中被正確引用）
</script>

<style scoped lang="scss">
@import '@/assets/styles/components/pagination.scss';
</style>