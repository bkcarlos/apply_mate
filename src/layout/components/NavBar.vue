<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <icon-menu-unfold
          v-if="collapsed"
          class="nav-btn"
          @click="toggleCollapsed"
        />
        <icon-menu-fold v-else class="nav-btn" @click="toggleCollapsed" />
        <a-breadcrumb class="breadcrumb">
          <a-breadcrumb-item>
            <icon-home />
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ currentPageTitle }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-space>
    </div>
    <div class="right-side">
      <a-space :size="16">
        <a-tooltip :content="$t('common.refresh')">
          <a-button type="text" @click="handleRefresh">
            <template #icon>
              <icon-refresh />
            </template>
          </a-button>
        </a-tooltip>
        <LanguageSwitcher />
        <a-dropdown position="br" trigger="hover">
          <a-avatar :size="32" style="cursor: pointer">
            <icon-user />
          </a-avatar>
          <template #content>
            <a-doption @click="handleLogout">
              <icon-poweroff />
              {{ $t('common.logout') }}
            </a-doption>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  IconMenuFold,
  IconMenuUnfold,
  IconHome,
  IconRefresh,
  IconUser,
  IconPoweroff,
} from '@arco-design/web-vue/es/icon';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// 从父组件接收 props
const props = defineProps<{
  collapsed?: boolean;
}>();

const emit = defineEmits<{
  toggleCollapsed: [];
}>();

const collapsed = computed(() => props.collapsed || false);

const currentPageTitle = computed(() => {
  const routeName = route.name as string;
  const titleMap: Record<string, string> = {
    Dashboard: t('nav.dashboard'),
    InterviewList: t('nav.interviews'),
    InterviewDetail: t('nav.interviews'),
    NewInterview: t('nav.interviews'),
    CompanyList: t('nav.companies'),
    Analysis: t('nav.analysis'),
    Settings: t('nav.settings'),
  };
  return titleMap[routeName] || routeName;
});

const toggleCollapsed = () => {
  emit('toggleCollapsed');
};

const handleRefresh = () => {
  window.location.reload();
};

const handleLogout = () => {
  // 这里可以添加登出逻辑
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
}

.left-side {
  display: flex;
  align-items: center;
}

.right-side {
  display: flex;
  align-items: center;
}

.nav-btn {
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;
}

.nav-btn:hover {
  color: var(--color-primary-6);
}

.breadcrumb {
  margin-left: 16px;
}

:deep(.arco-breadcrumb-item-link) {
  color: var(--color-text-2);
}
</style> 