<template>
  <a-dropdown placement="bottomRight">
    <a-button type="text" :icon="h(GlobalOutlined)">
      {{ currentLanguage.label }}
    </a-button>
    <template #overlay>
      <a-menu :selected-keys="[locale]" @click="handleLanguageChange">
        <a-menu-item 
          v-for="lang in languages" 
          :key="lang.value"
          :class="{ 'ant-menu-item-selected': locale === lang.value }"
        >
          <span class="language-item">
            <span class="flag">{{ lang.flag }}</span>
            <span class="label">{{ lang.label }}</span>
          </span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { GlobalOutlined } from '@ant-design/icons-vue'

const { locale } = useI18n()

const languages = [
  {
    value: 'zh',
    label: '中文',
    flag: '🇨🇳'
  },
  {
    value: 'en',
    label: 'English',
    flag: '🇺🇸'
  }
]

const currentLanguage = computed(() => {
  return languages.find(lang => lang.value === locale.value) || languages[0]
})

const handleLanguageChange = ({ key }: { key: string }) => {
  locale.value = key
  localStorage.setItem('locale', key)
  
  // 重新加载页面以确保所有组件都使用新语言
  window.location.reload()
}
</script>

<style scoped>
.language-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flag {
  font-size: 16px;
}

.label {
  font-size: 14px;
}
</style>
