<template>
  <a-config-provider>
    <div class="app-container">
      <!-- 顶部导航栏 -->
      <a-layout-header class="app-header">
        <div class="header-left">
          <div class="logo">
            <icon-apps />
            <span class="logo-text">ApplyMate</span>
          </div>
          
          <!-- 全局搜索 -->
          <div class="global-search">
            <a-input-search
              v-model="searchValue"
              :placeholder="$t('common.globalSearch')"
              size="medium"
              style="width: 320px"
              @search="handleGlobalSearch"
            >
              <template #prefix>
                <icon-search />
              </template>
            </a-input-search>
          </div>
        </div>

        <div class="header-right">
          <!-- 面包屑导航 -->
          <a-breadcrumb class="breadcrumb" v-if="!isMobile">
            <a-breadcrumb-item 
              v-for="item in breadcrumbItems" 
              :key="item.path"
              @click="item.path ? $router.push(item.path) : null"
              :class="{ clickable: item.path }"
            >
              {{ item.title }}
            </a-breadcrumb-item>
          </a-breadcrumb>

          <!-- 右侧操作区 -->
          <div class="header-actions">
            <!-- 通知中心 -->
            <a-dropdown trigger="click" :popup-max-height="false">
              <a-button type="text" class="action-btn">
                <a-badge :count="notificationCount" :max-count="99">
                  <template #icon>
                    <icon-notification />
                  </template>
                </a-badge>
              </a-button>
              <template #content>
                <div class="notification-panel">
                  <div class="notification-header">
                    <span>{{ $t('common.notifications') }}</span>
                    <a-button type="text" size="mini" @click="markAllAsRead">
                      {{ $t('common.markAllRead') }}
                    </a-button>
                  </div>
                  <a-scrollbar style="height: 300px; overflow: auto;">
                    <div 
                      v-for="notification in notifications" 
                      :key="notification.id"
                      class="notification-item"
                      :class="{ unread: !notification.read }"
                      @click="handleNotificationClick(notification)"
                    >
                      <div class="notification-content">
                        <div class="notification-title">{{ notification.title }}</div>
                        <div class="notification-desc">{{ notification.description }}</div>
                        <div class="notification-time">{{ formatNotificationTime(notification.createdAt) }}</div>
                      </div>
                    </div>
                  </a-scrollbar>
                </div>
              </template>
            </a-dropdown>

            <!-- 语言切换 -->
            <LanguageSwitcher />

            <!-- 主题切换 -->
            <a-button type="text" class="action-btn" @click="toggleTheme">
              <template #icon>
                <icon-moon v-if="isDarkMode" />
                <icon-sun v-else />
              </template>
            </a-button>

            <!-- 设置 -->
            <a-button type="text" class="action-btn" @click="$router.push('/settings')">
              <template #icon>
                <icon-settings />
              </template>
            </a-button>

            <!-- 用户菜单 -->
            <a-dropdown trigger="click">
              <div class="user-profile">
                <a-avatar size="medium">
                  <img alt="avatar" src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp" />
                </a-avatar>
                <span class="user-name">用户</span>
                <icon-down />
              </div>
              <template #content>
                <a-doption @click="$router.push('/profile')">
                  <template #icon><icon-user /></template>
                  {{ $t('common.profile') }}
                </a-doption>
                <a-doption @click="$router.push('/settings')">
                  <template #icon><icon-settings /></template>
                  {{ $t('common.settings') }}
                </a-doption>
                <a-doption @click="handleLogout">
                  <template #icon><icon-export /></template>
                  {{ $t('common.logout') }}
                </a-doption>
              </template>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>

      <!-- 主体区域 -->
      <a-layout class="main-layout">
        <!-- 侧边栏 -->
        <a-layout-sider
          v-model:collapsed="collapsed"
          :collapsed-width="isMobile ? 0 : 64"
          :width="220"
          class="app-sider"
          collapsible
          :hide-trigger="isMobile"
          breakpoint="lg"
          @collapse="handleSiderCollapse"
        >
          <!-- 侧边栏触发器 -->
          <div class="sider-trigger" v-if="!isMobile" @click="toggleSider">
            <icon-menu-unfold v-if="collapsed" />
            <icon-menu-fold v-else />
          </div>

          <!-- 导航菜单 -->
          <a-menu
            v-model:selected-keys="selectedKeys"
            mode="vertical"
            :auto-open-selected="true"
            :auto-scroll-into-view="true"
            @menu-item-click="handleMenuClick"
            class="app-menu"
          >
            <a-menu-item key="/dashboard">
              <template #icon>
                <icon-dashboard />
              </template>
              <span>{{ $t('nav.dashboard') }}</span>
            </a-menu-item>
            
            <a-menu-item key="/interviews">
              <template #icon>
                <icon-user-group />
              </template>
              <span>{{ $t('nav.interviews') }}</span>
            </a-menu-item>
            
            <a-menu-item key="/companies">
              <template #icon>
                <icon-home />
              </template>
              <span>{{ $t('nav.companies') }}</span>
            </a-menu-item>
            
            <a-menu-item key="/calendar">
              <template #icon>
                <icon-calendar />
              </template>
              <span>{{ $t('nav.calendar') }}</span>
            </a-menu-item>
            
            <a-menu-item key="/analysis">
              <template #icon>
                <icon-bar-chart />
              </template>
              <span>{{ $t('nav.analysis') }}</span>
            </a-menu-item>
            
            <a-menu-item key="/settings">
              <template #icon>
                <icon-settings />
              </template>
              <span>{{ $t('nav.settings') }}</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>

        <!-- 主内容区 -->
        <a-layout-content class="app-content">
          <div class="content-wrapper">
            <!-- 移动端侧边栏遮罩 -->
            <div 
              v-if="isMobile && !collapsed" 
              class="mobile-mask"
              @click="collapsed = true"
            ></div>

            <!-- 页面内容 -->
            <div class="page-content">
              <router-view v-slot="{ Component, route }">
                <transition name="fade-slide" mode="out-in">
                  <keep-alive :include="cacheList">
                    <component :is="Component" :key="route.fullPath" />
                  </keep-alive>
                </transition>
              </router-view>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import {
  IconApps,
  IconSearch,
  IconNotification,
  IconMoon,
  IconSun,
  IconSettings,
  IconUser,
  IconDown,
  IconExport,
  IconDashboard,
  IconUserGroup,
  IconHome,
  IconCalendar,
  IconBarChart,
  IconMenuUnfold,
  IconMenuFold,
} from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// 响应式检测
const { isMobile } = useBreakpoint();

// 侧边栏状态
const collapsed = ref(false);
const selectedKeys = ref<string[]>([route.path]);

// 搜索
const searchValue = ref('');

// 主题
const isDarkMode = ref(false);

// 缓存列表
const cacheList = ref<string[]>(['Dashboard', 'InterviewList']);

// 通知相关
const notifications = ref([
  {
    id: '1',
    title: '明天有面试安排',
    description: '腾讯 - 前端开发工程师 - 14:00',
    createdAt: new Date(),
    read: false,
    type: 'interview'
  },
  {
    id: '2',
    title: '新的Offer到达',
    description: '字节跳动向您发送了正式Offer',
    createdAt: new Date(Date.now() - 86400000), // 1天前
    read: false,
    type: 'offer'
  }
]);

// 计算属性
const notificationCount = computed(() => 
  notifications.value.filter(n => !n.read).length
);

// 面包屑导航
const breadcrumbItems = computed(() => {
  const pathMap: Record<string, string> = {
    '/dashboard': t('nav.dashboard'),
    '/interviews': t('nav.interviews'),
    '/companies': t('nav.companies'),
    '/calendar': t('nav.calendar'),
    '/analysis': t('nav.analysis'),
    '/settings': t('nav.settings'),
  };

  const items = [{ title: t('nav.dashboard'), path: '/dashboard' }];
  
  if (route.path !== '/dashboard') {
    items.push({ title: pathMap[route.path] || route.path });
  }
  
  return items;
});

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath];
  }
);

// 响应式布局处理
watch(isMobile, (mobile) => {
  if (mobile) {
    collapsed.value = true;
  }
});

// 事件处理
const handleMenuClick = (key: string) => {
  router.push(key);
  if (isMobile.value) {
    collapsed.value = true;
  }
};

const toggleSider = () => {
  collapsed.value = !collapsed.value;
};

const handleSiderCollapse = (collapse: boolean) => {
  collapsed.value = collapse;
};

const handleGlobalSearch = (value: string) => {
  if (value.trim()) {
    // 实现全局搜索逻辑
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  // 实现主题切换逻辑
  document.body.setAttribute('arco-theme', isDarkMode.value ? 'dark' : '');
};

const handleNotificationClick = (notification: any) => {
  notification.read = true;
  // 根据通知类型跳转到相应页面
  if (notification.type === 'interview') {
    router.push('/calendar');
  } else if (notification.type === 'offer') {
    router.push('/interviews');
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
  Message.success(t('common.markAllReadSuccess'));
};

const formatNotificationTime = (time: Date) => {
  return dayjs(time).fromNow();
};

const handleLogout = () => {
  // 实现登出逻辑
  Message.success(t('common.logoutSuccess'));
  router.push('/login');
};

onMounted(() => {
  // 初始化主题
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
    document.body.setAttribute('arco-theme', 'dark');
  }
});
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.app-header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-1);
}

.logo-text {
  background: linear-gradient(135deg, #165dff, #4080ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.global-search {
  margin-left: 40px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.breadcrumb {
  margin-right: 40px;
}

.breadcrumb :deep(.arco-breadcrumb-item) {
  cursor: pointer;
}

.breadcrumb :deep(.arco-breadcrumb-item.clickable:hover) {
  color: var(--color-primary-6);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--color-fill-2);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-profile:hover {
  background: var(--color-fill-2);
}

.user-name {
  font-size: 14px;
  color: var(--color-text-1);
}

/* 通知面板 */
.notification-panel {
  width: 320px;
  max-height: 400px;
}

.notification-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--color-border-2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.notification-item {
  padding: 12px 20px;
  border-bottom: 1px solid var(--color-border-1);
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: var(--color-fill-1);
}

.notification-item.unread {
  background: var(--color-primary-light-1);
  border-left: 3px solid var(--color-primary-6);
}

.notification-content {
  font-size: 12px;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.notification-desc {
  color: var(--color-text-2);
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-time {
  color: var(--color-text-3);
  font-size: 12px;
}

/* 主体布局 */
.main-layout {
  flex: 1;
  margin-top: 64px;
}

.app-sider {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  z-index: 99;
  background: #fff;
  border-right: 1px solid var(--color-border-2);
  transition: all 0.2s;
}

.sider-trigger {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-3);
  border-bottom: 1px solid var(--color-border-1);
  transition: all 0.2s;
}

.sider-trigger:hover {
  background: var(--color-fill-2);
  color: var(--color-text-1);
}

.app-menu {
  border-right: none;
  padding: 8px 0;
}

.app-menu :deep(.arco-menu-item) {
  margin: 2px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.app-menu :deep(.arco-menu-item.arco-menu-selected) {
  background: var(--color-primary-light-1);
  color: var(--color-primary-6);
}

.app-menu :deep(.arco-menu-item:hover) {
  background: var(--color-fill-2);
}

/* 主内容区 */
.app-content {
  margin-left: 220px;
  transition: margin-left 0.2s;
  background: var(--color-fill-1);
  min-height: calc(100vh - 64px);
}

.app-content.collapsed {
  margin-left: 64px;
}

.content-wrapper {
  position: relative;
  height: 100%;
}

.mobile-mask {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 98;
}

.page-content {
  padding: 24px;
  height: 100%;
}

/* 页面切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .app-content {
    margin-left: 0;
  }
  
  .app-sider {
    transform: translateX(-100%);
  }
  
  .app-sider:not(.arco-layout-sider-collapsed) {
    transform: translateX(0);
  }
  
  .global-search {
    display: none;
  }
  
  .breadcrumb {
    display: none;
  }
  
  .header-left {
    gap: 16px;
  }
  
  .page-content {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 16px;
  }
  
  .header-actions {
    gap: 4px;
  }
  
  .user-name {
    display: none;
  }
  
  .notification-panel {
    width: 280px;
  }
}

/* 暗色主题适配 */
body[arco-theme='dark'] .app-header {
  background: var(--color-bg-2);
  border-bottom-color: var(--color-border-2);
}

body[arco-theme='dark'] .app-sider {
  background: var(--color-bg-2);
  border-right-color: var(--color-border-2);
}
</style>
