<template>
  <div id="app">
    <AppLayout />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useCompanyStore } from '@/stores/company'
import { useInterviewStore } from '@/stores/interview'
import { useRoundStore } from '@/stores/round'
import { useUserStore } from '@/stores/user'
import { storageManager } from '@/utils/storage'

// 初始化数据存储
const companyStore = useCompanyStore()
const interviewStore = useInterviewStore()
const roundStore = useRoundStore()
const userStore = useUserStore()

onMounted(async () => {
  try {
    // 初始化默认数据结构
    await storageManager.initDefaultData()
    
    // 加载所有数据
    await Promise.all([
      companyStore.loadCompanies(),
      interviewStore.loadInterviews(),
      roundStore.loadRounds(),
      userStore.loadProfile()
    ])
    
    console.log('✅ 应用数据加载完成')
  } catch (error) {
    console.error('❌ 应用初始化失败:', error)
  }
})
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  background-color: $color-white;
  color: $color-text-primary;
  font-family: $font-family-body;
}

// 全局滚动优化
html {
  scroll-behavior: smooth;
}

// 响应式适配
@media (max-width: $breakpoint-md) {
  #app {
    font-size: $font-size-sm;
  }
}

// 减少动画的用户偏好设置
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
