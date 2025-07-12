<template>
  <div class="app-sidebar">
    <!-- 菜单切换按钮 -->
    <div class="sidebar-toggle" @click="handleToggle">
      <el-icon :size="18">
        <component :is="collapsed ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
    
    <!-- 导航菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      :unique-opened="true"
      router
      class="sidebar-menu"
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
    
    <!-- 底部信息 -->
    <div v-if="!collapsed" class="sidebar-footer">
      <div class="storage-info">
        <div class="storage-title">存储使用</div>
        <div class="storage-usage">
          <el-progress
            :percentage="storagePercentage"
            :stroke-width="4"
            :show-text="false"
            :color="storageColor"
          />
          <span class="storage-text">{{ storageUsed }} / {{ storageLimit }}</span>
        </div>
      </div>
      
      <div class="version-info">
        <span class="version">v1.4.0</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatFileSize } from '@/utils'
import { storageManager } from '@/utils/storage'

interface Props {
  collapsed: boolean
}

interface Emits {
  (e: 'toggle'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const route = useRoute()

// 菜单项配置
const menuItems = ref([
  {
    name: 'Dashboard',
    path: '/dashboard',
    title: '仪表盘',
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
  },
  {
    name: 'Settings',
    path: '/settings',
    title: '系统设置',
    icon: 'Setting'
  }
])

// 存储信息
const storageUsed = ref('0 KB')
const storageLimit = '5 MB'
const storagePercentage = ref(0)

// 计算属性
const activeMenu = computed(() => {
  // 根据当前路由确定激活的菜单项
  const path = route.path
  if (path.startsWith('/interviews')) {
    return '/interviews'
  }
  return path
})

const storageColor = computed(() => {
  if (storagePercentage.value >= 90) return '#F56C6C'
  if (storagePercentage.value >= 70) return '#E6A23C'
  return '#67C23A'
})

// 方法
const handleToggle = () => {
  emit('toggle')
}

const isActiveMenu = (menuName: string): boolean => {
  if (menuName === 'InterviewList') {
    return route.name?.toString().startsWith('Interview') || false
  }
  return route.name === menuName
}

const updateStorageInfo = async () => {
  try {
    const size = await storageManager.getStorageSize()
    storageUsed.value = formatFileSize(size)
    
    // 假设限制为5MB
    const limitBytes = 5 * 1024 * 1024
    storagePercentage.value = Math.min(Math.round((size / limitBytes) * 100), 100)
  } catch (error) {
    console.error('获取存储信息失败:', error)
  }
}

onMounted(() => {
  updateStorageInfo()
  
  // 定期更新存储信息
  setInterval(updateStorageInfo, 30000) // 30秒更新一次
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.app-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $color-white;
}

.sidebar-toggle {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: 1px solid $border-light;
  transition: all $transition-fast;
  
  &:hover {
    background-color: $bg-light;
  }
}

.sidebar-menu {
  flex: 1;
  border: none;
  
  :deep(.el-menu-item) {
    height: 48px;
    line-height: 48px;
    margin: 0 $spacing-sm;
    border-radius: $border-radius-md;
    transition: all $transition-base;
    
    &:hover {
      background-color: lighten($primary-orange, 45%);
      color: $primary-orange;
    }
    
    &.is-active,
    &.active {
      background-color: lighten($primary-orange, 30%);
      color: $primary-orange;
      font-weight: $font-weight-medium;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        background-color: $primary-orange;
        border-radius: 0 2px 2px 0;
      }
    }
    
    .el-icon {
      margin-right: $spacing-sm;
      font-size: 18px;
    }
  }
  
  // 折叠状态下的样式
  &.el-menu--collapse {
    :deep(.el-menu-item) {
      &.is-active,
      &.active {
        &::before {
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          width: 24px;
          height: 3px;
          border-radius: 2px;
        }
      }
    }
  }
}

.sidebar-footer {
  padding: $spacing-lg $spacing-md;
  border-top: 1px solid $border-light;
  background: $bg-section;
  
  .storage-info {
    margin-bottom: $spacing-md;
    
    .storage-title {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin-bottom: $spacing-xs;
    }
    
    .storage-usage {
      .storage-text {
        font-size: $font-size-xs;
        color: $color-text-secondary;
        margin-top: $spacing-xs;
        display: block;
      }
    }
  }
  
  .version-info {
    text-align: center;
    
    .version {
      font-size: $font-size-xs;
      color: $color-text-secondary;
      font-weight: $font-weight-medium;
    }
  }
}

// 响应式处理
@media (max-width: $breakpoint-md) {
  .app-sidebar {
    box-shadow: $shadow-deep;
  }
}
</style>
