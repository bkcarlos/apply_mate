<template>
  <div class="menu-wrapper">
    <div class="logo">
      <div class="logo-content">
                 <div class="logo-img">AM</div>
        <h1 v-if="!collapsed" class="logo-text">ApplyMate</h1>
      </div>
    </div>
    <a-scrollbar class="menu-scrollbar" outer-class="arco-layout-sider-scroll">
      <a-menu
        :mode="'vertical'"
        :selected-keys="selectedKey"
        :style="{ width: '100%', border: 'none' }"
        :auto-open="false"
        show-collapse-button
        auto-open-selected
        level-indent
        @menu-item-click="onMenuItemClick"
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
    </a-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  IconDashboard,
  IconUserGroup,
  IconHome,
  IconBarChart,
  IconSettings,
} from '@arco-design/web-vue/es/icon';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const props = defineProps<{
  collapsed?: boolean;
}>();

const collapsed = computed(() => props.collapsed || false);

const selectedKey = ref([route.path]);

watch(
  () => route.fullPath,
  (rPath) => {
    const key = rPath.split('/')[1];
    selectedKey.value = [`/${key}`];
  },
  { immediate: true }
);

const onMenuItemClick = (key: string) => {
  router.push(key);
};
</script>

<style scoped lang="less">
.menu-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  padding: 12px 12px;
  cursor: pointer;
  height: 60px;
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

.menu-scrollbar {
  height: calc(100vh - 60px);
  
  :deep(.arco-scrollbar-container) {
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  :deep(.arco-menu) {
    border-right: none;
  }
  
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
  
  :deep(.arco-menu-icon) {
    margin-right: 8px;
  }
}
</style> 