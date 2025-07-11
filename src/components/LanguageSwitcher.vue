<template>
  <a-dropdown placement="br" trigger="hover">
    <a class="language-switcher" @click.prevent>
      <icon-language />
      <span class="current-lang">{{ currentLanguage }}</span>
      <icon-down />
    </a>
    <template #content>
      <a-doption @click="handleMenuClick('zh')">{{ $t('language.chinese') }}</a-doption>
      <a-doption @click="handleMenuClick('en')">{{ $t('language.english') }}</a-doption>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { IconLanguage, IconDown } from '@arco-design/web-vue/es/icon';

const { locale, t } = useI18n();

const currentLanguage = computed(() => {
  return locale.value === 'zh' ? t('language.chinese') : t('language.english');
});

const handleMenuClick = (key: string) => {
  locale.value = key;
  localStorage.setItem('language', key);
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
  /* color: rgba(255, 255, 255, 0.85); */
}

.language-switcher:hover {
  background-color: rgba(255, 255, 255, 0.1);
  /* color: #fff; */
}

.current-lang {
  font-size: 14px;
}
</style>
