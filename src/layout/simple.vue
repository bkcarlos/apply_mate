<template>
  <a-layout class="layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :width="220"
      class="layout-sider"
      breakpoint="lg"
    >
      <div class="logo">
        <div class="logo-content">
          <div class="logo-img">AM</div>
          <h1 v-if="!collapsed" class="logo-text">ApplyMate</h1>
        </div>
      </div>
      
      <a-menu
        v-model:selected-keys="selectedKeys"
        mode="vertical"
        :style="{ border: 'none' }"
        @menu-item-click="handleMenuClick"
      >
        <a-menu-item key="/dashboard">
          <template #icon>
            <icon-dashboard />
          </template>
          {{ $t('nav.dashboard') }}
        </a-menu-item>
        
        <a-menu-item key="/interviews">
          <template #icon>
            <icon-user-group />
          </template>
          {{ $t('nav.interviews') }}
        </a-menu-item>
        
        <a-menu-item key="/companies">
          <template #icon>
            <icon-home />
          </template>
          {{ $t('nav.companies') }}
        </a-menu-item>
        
        <a-menu-item key="/analysis">
          <template #icon>
            <icon-bar-chart />
          </template>
          {{ $t('nav.analysis') }}
        </a-menu-item>
        
        <a-menu-item key="/settings">
          <template #icon>
            <icon-settings />
          </template>
          {{ $t('nav.settings') }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- 顶部导航栏 -->
      <a-layout-header :class="['layout-header', { collapsed }]">
        <div class="header-left">
          <a-space>
            <icon-menu-unfold
              v-if="collapsed"
              class="trigger"
              @click="toggleCollapsed"
            />
            <icon-menu-fold
              v-else
              class="trigger"
              @click="toggleCollapsed"
            />
            <a-breadcrumb>
              <a-breadcrumb-item>
                <icon-home />
              </a-breadcrumb-item>
              <a-breadcrumb-item>{{ currentPageTitle }}</a-breadcrumb-item>
            </a-breadcrumb>
          </a-space>
        </div>
        
        <div class="header-right">
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
                <a-doption>
                  <icon-poweroff />
                  {{ $t('common.logout') }}
                </a-doption>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-layout-header>

      <!-- 标签页导航 -->
      <div :class="['tab-bar', { collapsed }]">
        <a-tabs
          v-model:active-key="activeTab"
          type="card-gutter"
          size="small"
          :show-add-button="false"
          @tab-click="handleTabClick"
          @delete="handleTabClose"
        >
          <a-tab-pane
            v-for="tab in tabs"
            :key="tab.key"
            :title="tab.title"
            :closable="tabs.length > 1"
          />
        </a-tabs>
      </div>

      <!-- 主内容区 -->
      <a-layout-content :class="['layout-content', { collapsed }]">
        <div class="content-wrapper">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-slide" mode="out-in" appear>
              <keep-alive>
                <component :is="Component" :key="route.fullPath" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </a-layout-content>

      <!-- 底部 -->
      <a-layout-footer :class="['layout-footer', { collapsed }]">
        <div class="footer-content">
          ApplyMate © 2024 - {{ $t('footer.allRightsReserved', 'All Rights Reserved') }}
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  IconDashboard,
  IconUserGroup,
  IconHome,
  IconBarChart,
  IconSettings,
  IconMenuFold,
  IconMenuUnfold,
  IconRefresh,
  IconUser,
  IconPoweroff,
} from '@arco-design/web-vue/es/icon';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';

interface TabItem {
  key: string;
  title: string;
  path: string;
}

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// 布局状态
const collapsed = ref(false);
const selectedKeys = ref<string[]>([route.path]);

// 标签页状态
const tabs = ref<TabItem[]>([
  {
    key: '/dashboard',
    title: t('nav.dashboard'),
    path: '/dashboard',
  },
]);
const activeTab = ref('/dashboard');

// 计算属性
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

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath];
    activeTab.value = newPath;
    
    // 添加新标签页
    const existingTab = tabs.value.find(tab => tab.key === newPath);
    if (!existingTab) {
      const titleMap: Record<string, string> = {
        '/dashboard': t('nav.dashboard'),
        '/interviews': t('nav.interviews'),
        '/companies': t('nav.companies'),
        '/analysis': t('nav.analysis'),
        '/settings': t('nav.settings'),
      };
      
      const newTab: TabItem = {
        key: newPath,
        title: titleMap[newPath] || newPath,
        path: newPath,
      };
      
      tabs.value.push(newTab);
    }
  },
  { immediate: true }
);

// 事件处理
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};

const handleMenuClick = (key: string) => {
  router.push(key);
};

const handleRefresh = () => {
  window.location.reload();
};

const handleTabClick = (key: string) => {
  const tab = tabs.value.find(t => t.key === key);
  if (tab) {
    router.push(tab.path);
  }
};

const handleTabClose = (key: string) => {
  const index = tabs.value.findIndex(tab => tab.key === key);
  if (index > -1 && tabs.value.length > 1) {
    tabs.value.splice(index, 1);
    
    if (key === activeTab.value) {
      const newActiveIndex = index === 0 ? 0 : index - 1;
      const newActiveTab = tabs.value[newActiveIndex];
      router.push(newActiveTab.path);
    }
  }
};
</script>

<style scoped lang="less">
.layout {
  min-height: 100vh;
}

.layout-sider {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100vh;
  transition: all 0.2s;
  
  &::after {
    position: absolute;
    top: 0;
    right: -1px;
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
    content: '';
  }
}

.logo {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  height: 60px;
  border-bottom: 1px solid var(--color-border-2);
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.logo-img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--color-primary-6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.logo-text {
  color: var(--color-text-1);
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
}

.layout-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 220px;
  z-index: 100;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
  transition: left 0.2s;
  
  &.collapsed {
    left: 48px;
  }
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: var(--color-primary-6);
  }
}

.tab-bar {
  position: fixed;
  top: 60px;
  right: 0;
  left: 220px;
  z-index: 98;
  height: 40px;
  padding: 0 16px;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
  transition: left 0.2s;
  
  &.collapsed {
    left: 48px;
  }
}

.layout-content {
  margin-left: 220px;
  margin-top: 100px; // 60px header + 40px tab bar
  min-height: calc(100vh - 148px); // 100px top + 48px footer
  background-color: var(--color-fill-2);
  transition: margin-left 0.2s;
  
  &.collapsed {
    margin-left: 48px;
  }
}

.content-wrapper {
  padding: 20px 24px;
  height: 100%;
}

.layout-footer {
  margin-left: 220px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-2);
  border-top: 1px solid var(--color-border-2);
  transition: margin-left 0.2s;
  
  &.collapsed {
    margin-left: 48px;
  }
}

.footer-content {
  color: var(--color-text-3);
  font-size: 12px;
}

// 页面切换动画
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 响应式设计
@media (max-width: 992px) {
  .layout-header {
    left: 0;
  }
  
  .tab-bar {
    left: 0;
  }
  
  .layout-content {
    margin-left: 0;
  }
  
  .layout-footer {
    margin-left: 0;
  }
}

// 菜单样式优化
:deep(.arco-menu-item) {
  margin: 4px 8px;
  border-radius: 6px;
  
  &:hover:not(.arco-menu-item-selected) {
    background-color: var(--color-fill-2);
  }
  
  &.arco-menu-item-selected {
    background-color: var(--color-primary-light-1);
    color: var(--color-primary-6);
    
    .arco-icon {
      color: var(--color-primary-6);
    }
  }
}

// 标签页样式
:deep(.arco-tabs-nav) {
  border-bottom: none;
}

:deep(.arco-tabs-tab) {
  border: 1px solid var(--color-border-2);
  border-radius: 4px 4px 0 0;
  margin-right: 4px;
  
  &.arco-tabs-tab-active {
    background-color: var(--color-bg-1);
    border-bottom-color: var(--color-bg-1);
  }
}
</style> 