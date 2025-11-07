<template>
  <div class="language-toggle" :class="languageToggleClasses">
    <!-- 標籤 -->
    <div class="toggle-label">
      <span class="label-icon">🌐</span>
      <span class="label-text">{{ getText('language.switch') }}</span>
    </div>

    <!-- 切換按鈕組 -->
    <div class="toggle-buttons" role="group" :aria-label="getText('language.switch')">
      <button
        v-for="lang in supportedLanguages"
        :key="lang.code"
        class="language-button"
        :class="getLanguageButtonClasses(lang.code)"
        @click="switchLanguage(lang.code)"
        :aria-pressed="isCurrentLanguage(lang.code)"
        :title="formatText(getText('language.switchTo'), lang.name)"
      >
        <span class="language-flag">{{ getLanguageFlag(lang.code) }}</span>
        <span class="language-name">{{ lang.name }}</span>
      </button>
    </div>

    <!-- 快速切換按鈕（小螢幕） -->
    <button
      class="quick-toggle-button"
      @click="toggleLanguage"
      :title="getText('language.quickToggle')"
      :aria-label="getText('language.quickToggle')"
    >
      <span class="quick-toggle-icon">🔄</span>
      <span class="quick-toggle-text">{{ currentLanguageDisplayName }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Language } from '@/types/types'
import { useLanguage, formatText } from '@/composables/useLanguage'

// 組合式函數
const {
  currentLanguage,
  currentLanguageDisplayName,
  switchLanguage,
  toggleLanguage,
  getText,
  isCurrentLanguage,
  getSupportedLanguages
} = useLanguage()

// 計算屬性：支援的語言清單
const supportedLanguages = computed(() => getSupportedLanguages())

// 計算屬性：LanguageToggle 的 CSS 類別
const languageToggleClasses = computed(() => ({
  'chinese-mode': currentLanguage.value === 'zh',
  'english-mode': currentLanguage.value === 'en'
}))

// 方法：取得語言按鈕的 CSS 類別
function getLanguageButtonClasses(language: Language) {
  return {
    'language-button-active': isCurrentLanguage(language),
    'language-button-inactive': !isCurrentLanguage(language),
    [`language-${language}`]: true
  }
}

// 方法：取得語言旗幟 emoji
function getLanguageFlag(language: Language): string {
  const flags: Record<Language, string> = {
    zh: '🇹🇼', // 台灣旗幟代表繁體中文
    en: '🇺🇸'  // 美國旗幟代表英文
  }

  return flags[language] || '🌐'
}

// 發出事件（雖然這個組件主要使用全域狀態，但也可以支援事件）
const emit = defineEmits<{
  languageChanged: [language: Language]
}>()

// 包裝 switchLanguage 方法以發出事件
function handleLanguageSwitch(language: Language) {
  switchLanguage(language)
  emit('languageChanged', language)
}

// 包裝 toggleLanguage 方法以發出事件
function handleLanguageToggle() {
  const oldLanguage = currentLanguage.value
  toggleLanguage()

  // 在下一個 tick 發出事件，確保語言已經切換
  nextTick(() => {
    if (currentLanguage.value !== oldLanguage) {
      emit('languageChanged', currentLanguage.value)
    }
  })
}

// 匯入 nextTick
import { nextTick } from 'vue'
</script>

<style scoped lang="scss">
@import '@/assets/styles/components/language-toggle.scss';
</style>