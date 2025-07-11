<template>
  <a-config-provider :locale="arcoLocale">
    <a-layout class="app-layout">
      <!-- 侧边栏 -->
      <a-layout-sider
        v-model:collapsed="collapsed"
        collapsible
        class="app-sider"
      >
        <div class="logo">
          <h2 v-if="!collapsed">ApplyMate</h2>
          <h2 v-else>AM</h2>
        </div>
        
        <a-menu
          v-model:selected-keys="selectedKeys"
          mode="vertical"
          theme="dark"
          @menu-item-click="handleMenuClick"
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

      <a-layout>
        <!-- 顶部导航 -->
        <a-layout-header :class="['app-header', { collapsed }]">
          <icon-menu-unfold
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <icon-menu-fold
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          
          <div class="header-actions">
            <LanguageSwitcher />
            <a-button type="text" @click="handleRefresh">
              <template #icon>
                <icon-refresh />
              </template>
            </a-button>
          </div>
        </a-layout-header>

        <!-- 主内容区 -->
        <a-layout-content :class="['app-content', { collapsed }]">
          <div class="content-container">
            <router-view />
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import zhCN from '@arco-design/web-vue/es/locale/zh-CN';
import enUS from '@arco-design/web-vue/es/locale/en-US';
import {
  IconDashboard,
  IconUserGroup,
  IconHome,
  IconBarChart,
  IconSettings,
  IconMenuUnfold,
  IconMenuFold,
  IconRefresh,
} from '@arco-design/web-vue/es/icon';
import LanguageSwitcher from './components/LanguageSwitcher.vue';

const route = useRoute();
const router = useRouter();
const { locale } = useI18n();

// Arco Design Vue locale
const arcoLocale = computed(() => {
  return locale.value === 'en' ? enUS : zhCN;
});

// 侧边栏状态
const collapsed = ref(false);

// 当前选中的菜单项
const selectedKeys = ref<string[]>([route.path]);

// 监听路由变化更新选中状态
watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath];
  }
);

// 菜单点击处理
const handleMenuClick = (key: string) => {
  router.push(key);
};

// 刷新处理
const handleRefresh = () => {
  window.location.reload();
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-sider {
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px;
  border-radius: 6px;
}

.logo h2 {
  color: white;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.app-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  z-index: 99;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: left 0.2s;
}

.app-header.collapsed {
  left: 80px;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #165dff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-content {
  margin-left: 200px;
  margin-top: 64px;
  transition: margin-left 0.2s;
  background: #f2f3f5;
  min-height: calc(100vh - 64px);
}

.app-content.collapsed {
  margin-left: 80px;
}

.content-container {
  padding: 24px;
  height: 100%;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .app-sider {
    z-index: 200;
  }
  
  .app-header {
    left: 0;
  }
  
  .app-content {
    margin-left: 0;
  }
  
  .content-container {
    padding: 16px;
  }
}
</style>
