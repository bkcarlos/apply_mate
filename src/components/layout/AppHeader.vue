<template>
  <div class="app-header">
    <div class="header-left">
      <!-- Logo和品牌名 -->
      <div class="brand" @click="goHome">
        <div class="logo">
          <el-icon :size="32" color="#F28A31">
            <Briefcase />
          </el-icon>
        </div>
        <h1 class="brand-name">Apply Mate</h1>
      </div>
    </div>
    
    <div class="header-center">
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索面试、公司..."
          :prefix-icon="Search"
          size="default"
          style="width: 300px"
          @keyup.enter="handleSearch"
          @input="handleSearchInput"
        />
        
        <!-- 搜索建议 -->
        <div v-if="showSuggestions && suggestions.length > 0" class="search-suggestions">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            <el-icon class="suggestion-icon">
              <component :is="suggestion.type === 'company' ? 'OfficeBuilding' : 'Document'" />
            </el-icon>
            <span class="suggestion-text">{{ suggestion.label }}</span>
            <span class="suggestion-type">{{ suggestion.type === 'company' ? '公司' : '面试' }}</span>
          </div>
        </div>
      </div>
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
            新建
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
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Plus,
  Calendar,
  Bell,
  User,
  ArrowDown,
  Setting,
  InfoFilled,
  Briefcase
} from '@element-plus/icons-vue'
import { useCompanyStore } from '@/stores/company'
import { useInterviewStore } from '@/stores/interview'
import { useRoundStore } from '@/stores/round'
import { debounce } from '@/utils'

const router = useRouter()
const companyStore = useCompanyStore()
const interviewStore = useInterviewStore()
const roundStore = useRoundStore()

// 搜索相关
const searchKeyword = ref('')
const showSuggestions = ref(false)
const suggestions = ref<Array<{
  id: string
  label: string
  type: 'company' | 'interview'
  data: any
}>>([])

// 计算属性
const todayInterviewsCount = computed(() => {
  return roundStore.getTodayRounds.length
})

const notificationCount = computed(() => {
  // 计算需要提醒的事项数量
  const upcomingRounds = roundStore.getUpcomingRounds(3) // 3天内的面试
  const pendingInterviews = interviewStore.getInterviewsByStatus('投递中').length
  return upcomingRounds.length + pendingInterviews
})

// 搜索处理
const handleSearchInput = debounce(async (value: string) => {
  if (!value.trim()) {
    showSuggestions.value = false
    return
  }
  
  try {
    // 搜索公司
    const companies = await companyStore.searchCompanies(value)
    const companySuggestions = companies.slice(0, 3).map(company => ({
      id: company.id,
      label: company.name,
      type: 'company' as const,
      data: company
    }))
    
    // 搜索面试
    const interviews = await interviewStore.filterInterviews({ keyword: value })
    const interviewSuggestions = interviews.slice(0, 3).map(interview => ({
      id: interview.id,
      label: `${interview.position} - ${interview.companyId}`,
      type: 'interview' as const,
      data: interview
    }))
    
    suggestions.value = [...companySuggestions, ...interviewSuggestions]
    showSuggestions.value = suggestions.value.length > 0
  } catch (error) {
    console.error('搜索失败:', error)
  }
}, 300)

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      name: 'InterviewList',
      query: { keyword: searchKeyword.value }
    })
    showSuggestions.value = false
  }
}

const selectSuggestion = (suggestion: any) => {
  if (suggestion.type === 'company') {
    router.push({
      name: 'CompanyList',
      query: { companyId: suggestion.id }
    })
  } else {
    router.push({
      name: 'InterviewDetail',
      params: { id: suggestion.id }
    })
  }
  showSuggestions.value = false
  searchKeyword.value = ''
}

// 点击外部关闭建议框
const handleClickOutside = (event: Event) => {
  const searchBox = document.querySelector('.search-box')
  if (searchBox && !searchBox.contains(event.target as Node)) {
    showSuggestions.value = false
  }
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
    }
    
    .brand-name {
      font-family: $font-family-heading;
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
      color: $primary-orange;
      margin: 0;
      
      @media (max-width: $breakpoint-sm) {
        display: none;
      }
    }
  }
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  
  .search-box {
    position: relative;
    
    @media (max-width: $breakpoint-md) {
      width: 100%;
      max-width: 300px;
    }
    
    .search-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: $color-white;
      border: 1px solid $border-light;
      border-radius: $border-radius-md;
      box-shadow: $shadow-deep;
      z-index: $z-dropdown;
      margin-top: 4px;
      max-height: 300px;
      overflow-y: auto;
      
      .suggestion-item {
        display: flex;
        align-items: center;
        padding: $spacing-sm $spacing-md;
        cursor: pointer;
        transition: background-color $transition-fast;
        
        &:hover {
          background-color: $bg-light;
        }
        
        .suggestion-icon {
          margin-right: $spacing-sm;
          color: $color-text-secondary;
        }
        
        .suggestion-text {
          flex: 1;
          color: $color-text-primary;
        }
        
        .suggestion-type {
          font-size: $font-size-xs;
          color: $color-text-secondary;
          background: $bg-section;
          padding: 2px 6px;
          border-radius: $border-radius-sm;
        }
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
    
    @media (max-width: $breakpoint-sm) {
      .el-button span {
        display: none;
      }
    }
  }
  
  .user-menu {
    .user-avatar {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      cursor: pointer;
      padding: $spacing-xs;
      border-radius: $border-radius-md;
      transition: background-color $transition-fast;
      
      &:hover {
        background-color: $bg-light;
      }
      
      .dropdown-icon {
        font-size: 12px;
        color: $color-text-secondary;
      }
    }
  }
}

// 响应式隐藏
@media (max-width: $breakpoint-sm) {
  .header-center {
    display: none;
  }
}
</style>
