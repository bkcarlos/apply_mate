<template>
  <a-dropdown placement="bottomRight" trigger="hover">
    <a class="language-switcher" @click.prevent>
      <global-outlined />
      <span class="current-lang">{{ currentLanguage }}</span>
      <down-outlined />
    </a>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="zh">{{ $t('language.chinese') }}</a-menu-item>
        <a-menu-item key="en">{{ $t('language.english') }}</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { GlobalOutlined, DownOutlined } from '@ant-design/icons-vue';

const { locale, t } = useI18n();

const currentLanguage = computed(() => {
  return locale.value === 'zh' ? t('language.chinese') : t('language.english');
});

const handleMenuClick = ({ key }: { key: string }) => {
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
