<template>
  <a-config-provider :locale="locale">
    <a-layout class="app-layout">
      <!-- 侧边栏 -->
      <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        class="app-sider"
      >
        <div class="logo">
          <h2 v-if="!collapsed">ApplyMate</h2>
          <h2 v-else>AM</h2>
        </div>
        
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          theme="dark"
          @click="handleMenuClick"
        >
          <a-menu-item key="/dashboard">
            <DashboardOutlined />
            <span>仪表盘</span>
          </a-menu-item>
          
          <a-menu-item key="/interviews">
            <TeamOutlined />
            <span>面试管理</span>
          </a-menu-item>
          
          <a-menu-item key="/companies">
            <BankOutlined />
            <span>公司库</span>
          </a-menu-item>
          
          <a-menu-item key="/analysis">
            <BarChartOutlined />
            <span>统计分析</span>
          </a-menu-item>
          
          <a-menu-item key="/settings">
            <SettingOutlined />
            <span>设置</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout>
        <!-- 顶部导航 -->
        <a-layout-header class="app-header">
          <MenuUnfoldOutlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <MenuFoldOutlined
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          
          <div class="header-actions">
            <a-button type="text" @click="handleRefresh">
              <ReloadOutlined />
            </a-button>
          </div>
        </a-layout-header>

        <!-- 主内容区 -->
        <a-layout-content class="app-content">
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
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {
  DashboardOutlined,
  TeamOutlined,
  BankOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();

// 侧边栏状态
const collapsed = ref(false);
const locale = zhCN;

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
const handleMenuClick = ({ key }: { key: string }) => {
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
  color: #1890ff;
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
  background: #f0f2f5;
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
