<template>
  <el-container class="app-layout">
    <!-- 顶部导航栏 -->
    <el-header class="app-header">
      <AppHeader />
    </el-header>
    
    <!-- 主体内容区 -->
    <el-container class="app-body">
      <!-- 侧边导航栏 -->
      <el-aside class="app-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <AppSidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
      </el-aside>
      
      <!-- 主要内容区域 -->
      <el-main class="app-main">
        <div class="main-content">
          <!-- 路由视图 -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

// 切换侧边栏状态
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 响应式处理
const handleResize = () => {
  const width = window.innerWidth
  if (width < 768) {
    sidebarCollapsed.value = true
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  background-color: $bg-light;
}

.app-header {
  height: 64px;
  padding: 0;
  background: $color-white;
  border-bottom: 1px solid $border-light;
  box-shadow: $shadow-light;
  position: sticky;
  top: 0;
  z-index: $z-sticky;
}

.app-body {
  height: calc(100vh - 64px);
}

.app-sidebar {
  width: 240px;
  background: $color-white;
  border-right: 1px solid $border-light;
  transition: width $transition-base;
  overflow: hidden;
  
  &.collapsed {
    width: 60px;
  }
  
  @media (max-width: $breakpoint-md) {
    position: fixed;
    left: 0;
    top: 64px;
    height: calc(100vh - 64px);
    z-index: $z-fixed;
    transform: translateX(-100%);
    transition: transform $transition-base;
    
    &:not(.collapsed) {
      transform: translateX(0);
    }
  }
}

.app-main {
  background: $bg-light;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.main-content {
  min-height: 100%;
  padding: $spacing-lg;
  
  @media (max-width: $breakpoint-md) {
    padding: $spacing-md;
  }
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
