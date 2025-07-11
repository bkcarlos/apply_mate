<template>
  <div class="tab-bar">
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
    <div class="tab-bar-actions">
      <a-dropdown position="bottom" trigger="hover">
        <a-button type="text" size="small">
          <template #icon>
            <icon-down />
          </template>
        </a-button>
        <template #content>
          <a-doption @click="closeOtherTabs">
            {{ $t('tabBar.closeOther') }}
          </a-doption>
          <a-doption @click="closeAllTabs">
            {{ $t('tabBar.closeAll') }}
          </a-doption>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { IconDown } from '@arco-design/web-vue/es/icon';

interface TabItem {
  key: string;
  title: string;
  path: string;
}

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const tabs = ref<TabItem[]>([
  {
    key: '/dashboard',
    title: t('nav.dashboard'),
    path: '/dashboard',
  },
]);

const activeTab = ref('/dashboard');

// 监听路由变化，添加新标签页
watch(
  () => route.path,
  (newPath) => {
    activeTab.value = newPath;
    
    // 检查是否已存在该标签页
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
    
    // 如果关闭的是当前激活的标签页，切换到其他标签页
    if (key === activeTab.value) {
      const newActiveIndex = index === 0 ? 0 : index - 1;
      const newActiveTab = tabs.value[newActiveIndex];
      router.push(newActiveTab.path);
    }
  }
};

const closeOtherTabs = () => {
  const currentTab = tabs.value.find(tab => tab.key === activeTab.value);
  if (currentTab) {
    tabs.value = [currentTab];
  }
};

const closeAllTabs = () => {
  tabs.value = [tabs.value.find(tab => tab.key === '/dashboard')!];
  router.push('/dashboard');
};
</script>

<style scoped>
.tab-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 16px;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
}

.tab-bar-actions {
  margin-left: 8px;
}

:deep(.arco-tabs) {
  flex: 1;
}

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