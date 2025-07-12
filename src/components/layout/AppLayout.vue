<template>
  <el-container class="app-layout">
    <!-- 顶部导航栏 -->
    <el-header class="app-header">
      <AppHeader />
    </el-header>
    
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
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from './AppHeader.vue'

// 响应式处理
const handleResize = () => {
  // 可以在这里添加响应式处理逻辑
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

.app-main {
  background: $bg-light;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 64px);
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
