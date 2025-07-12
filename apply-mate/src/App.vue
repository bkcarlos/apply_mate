<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCompaniesStore } from '@/stores/companies'
import { useInterviewsStore } from '@/stores/interviews'
import { Plus, Menu, Close, Monitor, List, Calendar, OfficeBuilding, TrendCharts, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const companiesStore = useCompaniesStore()
const interviewsStore = useInterviewsStore()

// Navigation menu items
const menuItems = [
  { path: '/dashboard', name: 'dashboard', title: '仪表盘', icon: 'Monitor' },
  { path: '/interviews', name: 'interviews', title: '面试管理', icon: 'List' },
  { path: '/calendar', name: 'calendar', title: '面试日历', icon: 'Calendar' },
  { path: '/companies', name: 'companies', title: '公司管理', icon: 'OfficeBuilding' },
  { path: '/analysis', name: 'analysis', title: '数据分析', icon: 'TrendCharts' },
  { path: '/settings', name: 'settings', title: '系统设置', icon: 'Setting' }
]

// Mobile menu toggle
const mobileMenuVisible = ref(false)

const handleMenuSelect = (path: string) => {
  router.push(path)
  mobileMenuVisible.value = false
}

// Initialize stores with mock data
onMounted(() => {
  companiesStore.loadMockData()
  interviewsStore.loadMockData()
})
</script>

<template>
  <el-container class="app-container">
    <!-- Header -->
    <el-header class="app-header">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo-section">
          <el-button 
            class="mobile-menu-btn"
            @click="mobileMenuVisible = !mobileMenuVisible"
            :icon="mobileMenuVisible ? Close : Menu"
            text
          />
          <router-link to="/dashboard" class="logo">
            <span class="logo-text">ApplyMate</span>
            <span class="logo-subtitle">求职伙伴</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <el-menu
          :default-active="route.path"
          class="desktop-menu"
          mode="horizontal"
          @select="handleMenuSelect"
        >
          <el-menu-item 
            v-for="item in menuItems" 
            :key="item.path"
            :index="item.path"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-menu>

        <!-- Actions -->
        <div class="header-actions">
          <el-button 
            type="primary" 
            @click="router.push('/interviews/new')"
            :icon="Plus"
          >
            新建面试
          </el-button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuVisible" class="mobile-menu">
        <el-menu
          :default-active="route.path"
          @select="handleMenuSelect"
        >
          <el-menu-item 
            v-for="item in menuItems" 
            :key="item.path"
            :index="item.path"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-header>

    <!-- Main Content -->
    <el-main class="app-main">
      <div class="main-content">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--color-surface);
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.mobile-menu-btn {
  display: none;
  color: var(--color-text-primary);
}

.logo {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-text-primary);
  transition: var(--transition-base);
}

.logo:hover {
  color: var(--color-primary);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1;
  margin-top: -2px;
}

.desktop-menu {
  border-bottom: none;
  background: transparent;
}

.desktop-menu .el-menu-item {
  color: var(--color-text-primary);
  border-bottom: 2px solid transparent;
  transition: var(--transition-base);
}

.desktop-menu .el-menu-item:hover {
  color: var(--color-primary);
  background-color: rgba(242, 138, 49, 0.1);
}

.desktop-menu .el-menu-item.is-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  display: none;
}

.app-main {
  padding: 0;
  overflow-x: hidden;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
}

/* Responsive */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .desktop-menu {
    display: none;
  }

  .mobile-menu {
    display: block;
  }

  .header-actions {
    gap: var(--spacing-xs);
  }

  .header-actions .el-button span {
    display: none;
  }

  .logo-text {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 var(--spacing-sm);
  }

  .main-content {
    padding: var(--spacing-md) var(--spacing-sm);
  }
}
</style>
