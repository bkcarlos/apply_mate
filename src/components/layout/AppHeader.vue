<template>
  <div class="app-header">
    <div class="header-left">
      <!-- Logo和品牌名 -->
      <div class="brand" @click="goHome">
        <div class="logo">
          <img src="/src/assets/images/logo.svg" alt="ApplyMate Logo" class="logo-image" />
        </div>
        <h1 class="brand-name">Apply Mate</h1>
      </div>
    </div>
    
    <div class="header-center">
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        router
        class="header-menu"
      >
        <el-menu-item
          v-for="menu in menuItems"
          :key="menu.name"
          :index="menu.path"
          :class="{ active: isActiveMenu(menu.name) }"
        >
          <el-icon>
            <component :is="menu.icon" />
          </el-icon>
          <template #title>
            <span>{{ menu.title }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    
    <div class="header-right">
      <!-- 快捷操作 -->
      <div class="quick-actions">
        <el-tooltip content="新建面试流程" placement="bottom">
          <el-button
            type="primary"
            :icon="Plus"
            @click="createInterview"
          >
            新建面试
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="今日面试" placement="bottom">
          <el-badge :value="todayInterviewsCount" :hidden="todayInterviewsCount === 0">
            <el-button
              :icon="Calendar"
              circle
              @click="goToCalendar"
            />
          </el-badge>
        </el-tooltip>
        
        <el-tooltip content="通知" placement="bottom">
          <el-badge :value="notificationCount" :hidden="notificationCount === 0">
            <el-button
              :icon="Bell"
              circle
              @click="showNotifications"
            />
          </el-badge>
        </el-tooltip>
      </div>
      
      <!-- 用户菜单 -->
      <el-dropdown class="user-menu" @command="handleCommand">
        <div class="user-avatar">
          <el-avatar :size="32" src="">
            <el-icon><User /></el-icon>
          </el-avatar>
        </div>
        
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人资料
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="about">
              <el-icon><InfoFilled /></el-icon>
              关于
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Calendar,
  Bell,
  User,
  Setting,
  InfoFilled,
  House,
  Document,
  OfficeBuilding,
  DataAnalysis
} from '@element-plus/icons-vue'
import { useInterviewStore } from '@/stores/interview'
import { useRoundStore } from '@/stores/round'
import { formatFileSize } from '@/utils'

const router = useRouter()
const route = useRoute()
const interviewStore = useInterviewStore()
const roundStore = useRoundStore()

// 菜单项配置
const menuItems = ref([
  {
    name: 'Dashboard',
    path: '/dashboard',
    title: '工作台',
    icon: 'House'
  },
  {
    name: 'Calendar',
    path: '/calendar',
    title: '面试日历',
    icon: 'Calendar'
  },
  {
    name: 'InterviewList',
    path: '/interviews',
    title: '面试管理',
    icon: 'Document'
  },
  {
    name: 'CompanyList',
    path: '/companies',
    title: '公司管理',
    icon: 'OfficeBuilding'
  },
  {
    name: 'Analysis',
    path: '/analysis',
    title: '数据分析',
    icon: 'DataAnalysis'
  }
])

// 计算属性
const activeMenu = computed(() => {
  // 根据当前路由确定激活的菜单项
  const path = route.path
  if (path.startsWith('/interviews')) {
    return '/interviews'
  }
  return path
})

const todayInterviewsCount = computed(() => {
  return roundStore.getTodayRounds.length
})

const notificationCount = computed(() => {
  // 计算需要提醒的事项数量
  const upcomingRounds = roundStore.getUpcomingRounds(3) // 3天内的面试
  const pendingInterviews = interviewStore.getInterviewsByStatus('投递中').length
  return upcomingRounds.length + pendingInterviews
})

// 方法
const isActiveMenu = (menuName: string): boolean => {
  if (menuName === 'InterviewList') {
    return route.name?.toString().startsWith('Interview') || false
  }
  return route.name === menuName
}

// 快捷操作
const goHome = () => {
  router.push('/')
}

const createInterview = () => {
  router.push('/interviews/new')
}

const goToCalendar = () => {
  router.push('/calendar')
}

const showNotifications = () => {
  ElMessage.info('通知功能开发中...')
}

// 用户菜单处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中...')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'about':
      ElMessageBox.alert(
        'Apply Mate v1.4.0\n求职面试管理应用\n\n一个帮助您高效管理面试流程的工具',
        '关于 Apply Mate',
        {
          confirmButtonText: '确定',
          type: 'info'
        }
      )
      break
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-lg;
  background: $color-white;
  
  @media (max-width: $breakpoint-md) {
    padding: 0 $spacing-md;
  }
}

.header-left {
  display: flex;
  align-items: center;
  
  .brand {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: opacity $transition-fast;
    
    &:hover {
      opacity: 0.8;
    }
    
    .logo {
      margin-right: $spacing-sm;
      
      .logo-image {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }
    }
    
    .brand-name {
      font-family: $font-family-heading;
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
      color: $primary-orange;
      margin: 0;
      
      @media (max-width: 480px) {
        display: none;
      }
    }
  }
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
  overflow: visible;
  
  @media (max-width: $breakpoint-md) {
    justify-content: center;
    flex-shrink: 0;
  }
  
  .header-menu {
    border: none;
    background: transparent;
    width: auto;
    overflow: visible;
    
    :deep(.el-menu-item) {
      height: 64px;
      line-height: 64px;
      padding: 0 $spacing-md;
      border-radius: $border-radius-md;
      margin: 0 $spacing-xs;
      transition: all $transition-base;
      display: flex !important;
      visibility: visible !important;
      
      &:hover {
        background-color: lighten($primary-orange, 45%);
        color: $primary-orange;
      }
      
      &.is-active,
      &.active {
        background-color: lighten($primary-orange, 30%);
        color: $primary-orange;
        font-weight: $font-weight-medium;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          background-color: $primary-orange;
          border-radius: 2px 2px 0 0;
        }
      }
      
      .el-icon {
        margin-right: $spacing-xs;
        font-size: 16px;
      }
      
      span {
        font-size: $font-size-sm;
      }
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  
  .quick-actions {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    

  }
  
  .user-menu {
    .user-avatar {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: $spacing-xs;
      border-radius: $border-radius-md;
      transition: background-color $transition-fast;
      
      &:hover {
        background-color: $bg-light;
      }
    }
  }
}

// 响应式处理 - 保持所有内容始终显示
@media (max-width: $breakpoint-md) {
  .app-header {
    padding: 0 $spacing-sm;
  }
  
  .header-center {
    .header-menu {
      :deep(.el-menu-item) {
        padding: 0 $spacing-sm;
        margin: 0 2px;
        display: flex !important;
        visibility: visible !important;
        
        .el-icon {
          font-size: 14px;
        }
        
        span {
          font-size: $font-size-xs;
          display: inline !important;
        }
      }
    }
  }
  
  .header-right {
    .quick-actions {
      gap: $spacing-xs;
      
      .el-button {
        padding: $spacing-xs $spacing-sm;
        font-size: $font-size-xs;
      }
    }
  }
}
</style>
