<template>
  <div class="dashboard-view">
    <!-- 页面标题 -->
    <div class="dashboard-header">
      <h2 class="page-title">{{ $t('dashboard.title') }}</h2>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="createInterview">
          {{ $t('dashboard.newInterview') }}
        </el-button>
        <el-button :icon="Calendar" @click="goToCalendar">
          {{ $t('dashboard.viewCalendar') }}
        </el-button>
      </div>
    </div>
    
    <!-- 统计卡片区域 -->
    <div class="dashboard-stats">
      <el-row :gutter="16">
        <el-col :span="6" v-for="stat in stats" :key="stat.key">
          <el-card class="stat-card" :class="{ clickable: true }" @click="handleCardClick(stat.key)">
            <div class="stat-content">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.title }}</div>
            </div>
                         <div class="stat-icon" :style="{ backgroundColor: stat.color }">
             </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 主要内容区域 -->
    <el-row :gutter="16">
      <!-- 近期面试安排 -->
      <el-col :span="12">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.upcomingSchedule') }}</span>
              <el-button type="text" @click="goToCalendar">{{ $t('dashboard.viewAll') }}</el-button>
            </div>
          </template>
          
          <div class="timeline-container">
            <UpcomingInterviews :max-items="5" />
          </div>
        </el-card>
      </el-col>
      
      <!-- Offer薪资对比 -->
      <el-col :span="12">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.offerSalaryComparison') }}</span>
              <el-button type="text" @click="goToAnalysis">{{ $t('dashboard.detailedAnalysis') }}</el-button>
            </div>
          </template>
          
          <div class="chart-container">
            <OfferChart :height="300" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 快速操作区域 -->
    <el-card class="quick-actions-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('dashboard.quickStart') }}</span>
        </div>
      </template>
      
      <div class="action-buttons">
        <el-button
          type="primary"
          size="large"
          :icon="Plus"
          @click="createInterview"
        >
          {{ $t('dashboard.newInterviewProcess') }}
        </el-button>
        
        <el-button
          size="large"
          :icon="OfficeBuilding"
          @click="manageCompanies"
        >
          {{ $t('dashboard.manageCompanies') }}
        </el-button>
        
        <el-button
          size="large"
          :icon="Calendar"
          @click="goToCalendar"
        >
          {{ $t('dashboard.viewCalendar') }}
        </el-button>
        
        <!-- 测试数据按钮 -->
        <el-divider direction="vertical" />
        
        <el-button
          size="large"
          :icon="DataBoard"
          @click="generateTestData"
          :loading="generatingData"
          type="success"
          plain
        >
          {{ $t('dashboard.generateTestData') }}
        </el-button>
        
        <el-button
          size="large"
          :icon="Delete"
          @click="clearTestData"
          :loading="clearingData"
          type="danger"
          plain
        >
          {{ $t('dashboard.clearTestData') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  OfficeBuilding,
  Calendar,
  DataBoard,
  Delete
} from '@element-plus/icons-vue'
import { useInterviewStore } from '@/stores/interview'
import { useRoundStore } from '@/stores/round'
import { useCompanyStore } from '@/stores/company'
import { generateCompleteTestData, clearAllTestData } from '@/utils/testData'
// import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import UpcomingInterviews from '@/components/dashboard/UpcomingInterviews.vue'
import OfferChart from '@/components/dashboard/OfferChart.vue'

const router = useRouter()
const { t } = useI18n()
const interviewStore = useInterviewStore()
const roundStore = useRoundStore()
const companyStore = useCompanyStore()

// 计算统计数据
const stats = computed(() => {
  const dashboardStats = interviewStore.getDashboardStats
  
  return [
    {
      key: 'ongoing',
      title: t('dashboard.ongoingInterviews'),
      value: dashboardStats.ongoingInterviews,
      color: '#F28A31',
      trend: null
    },
    {
      key: 'pending',
      title: t('dashboard.pendingSchedule'),
      value: roundStore.getRoundsByStatus('pending').length,
      color: '#6975A7',
      trend: null
    },
    {
      key: 'offers',
      title: t('dashboard.receivedOffers'),
      value: dashboardStats.receivedOffers,
      color: '#67C23A',
      trend: null
    },
    {
      key: 'total',
      title: t('dashboard.totalApplications'),
      value: dashboardStats.totalApplications,
      color: '#E6A23C',
      trend: null
    }
  ]
})

// 方法
const handleCardClick = (key: string) => {
  switch (key) {
    case 'ongoing':
      router.push({
        name: 'InterviewList',
        query: { status: '评估中,面试中' }
      })
      break
    case 'pending':
      router.push('/calendar')
      break
    case 'offers':
      router.push({
        name: 'InterviewList',
        query: { status: '已发Offer' }
      })
      break
    case 'total':
      router.push('/interviews')
      break
  }
}

const createInterview = () => {
  router.push('/interviews/new')
}

const manageCompanies = () => {
  router.push('/companies')
}

const goToCalendar = () => {
  router.push('/calendar')
}

const goToAnalysis = () => {
  router.push('/analysis')
}

// 测试数据生成和清除
const generatingData = ref(false)
const clearingData = ref(false)

const generateTestData = async () => {
  try {
    await ElMessageBox.confirm(
      t('dashboard.generateTestDataConfirm'),
      t('dashboard.generateTestDataTitle'),
      {
        confirmButtonText: t('dashboard.confirm'),
        cancelButtonText: t('dashboard.cancel'),
        type: 'info',
      }
    )
    
    generatingData.value = true
    
    try {
      // 首先清空现有数据，避免ID关联问题
      console.log('🧹 清空现有数据...')
      await companyStore.clearAll()
      await interviewStore.clearAll()
      await roundStore.clearAll()
      
      // 生成测试数据
      console.log('📊 生成新的测试数据...')
      const testData = generateCompleteTestData()
      
      // 调试信息：检查数据关联
      console.log('🏢 生成的公司数量:', testData.companies.length)
      console.log('📋 生成的面试数量:', testData.interviews.length)
      console.log('🔄 生成的轮次数量:', testData.rounds.length)
      
      // 检查面试数据的公司关联
      const companyIds = new Set(testData.companies.map(c => c.id))
      const orphanInterviews = testData.interviews.filter(i => !companyIds.has(i.companyId))
      
      console.log('🏢 公司ID列表:', Array.from(companyIds))
      console.log('📋 孤立的面试流程 (未关联公司):', orphanInterviews.length)
      
      if (orphanInterviews.length > 0) {
        console.warn('⚠️ 发现未关联公司的面试流程:', orphanInterviews)
      }
      
      // 导入到各个store
      console.log('💾 保存数据到存储...')
      await companyStore.importCompanies(testData.companies, { mode: 'replace' })
      await interviewStore.importInterviews(testData.interviews)
      await roundStore.importRounds(testData.rounds)
      
      ElMessage.success(t('dashboard.testDataGenerated'))
      
      // 刷新页面数据
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      ElMessage.error(t('dashboard.testDataGenerationFailed'))
      console.error('测试数据生成失败:', error)
    } finally {
      generatingData.value = false
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('dashboard.testDataGenerationFailed'))
      console.error(error)
    }
  }
}

const clearTestData = async () => {
  try {
    await ElMessageBox.confirm(
      t('dashboard.clearTestDataConfirm'),
      t('dashboard.clearTestDataTitle'),
      {
        confirmButtonText: t('dashboard.confirm'),
        cancelButtonText: t('dashboard.cancel'),
        type: 'warning',
      }
    )
    
    clearingData.value = true
    
    // 清除所有测试数据
    clearAllTestData()
    
    // 重置store状态
    companyStore.companies = []
    interviewStore.interviews = []
    
    ElMessage.success(t('dashboard.testDataCleared'))
    
    // 刷新页面数据
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('dashboard.testDataClearingFailed'))
      console.error(error)
    }
  } finally {
    clearingData.value = false
  }
}

onMounted(() => {
  // 页面加载完成时的初始化
  // 移除了欢迎提示弹窗
})
</script>

<style lang="scss" scoped>
.dashboard-view {
  // 页面容器样式与其他页面保持一致
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  
  .page-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    gap: $spacing-sm;
  }
}

.dashboard-stats {
  margin-bottom: $spacing-lg;
  
  .stat-card {
    cursor: pointer;
    transition: all $transition-base;
    
    &:hover {
      box-shadow: $shadow-deep;
      transform: translateY(-2px);
    }
    
    &.clickable {
      cursor: pointer;
    }
    
    .stat-content {
      display: flex;
      flex-direction: column;
      
      .stat-number {
        font-size: $font-size-3xl;
        font-weight: $font-weight-bold;
        color: $color-text-primary;
        margin-bottom: $spacing-xs;
      }
      
      .stat-label {
        font-size: $font-size-sm;
        color: $color-text-secondary;
        font-weight: $font-weight-medium;
      }
    }
    
         .stat-icon {
       position: absolute;
       top: $spacing-md;
       right: $spacing-md;
       width: 8px;
       height: 8px;
       border-radius: 50%;
       opacity: 0.8;
     }
    
    :deep(.el-card__body) {
      position: relative;
      padding: $spacing-lg;
    }
  }
}

.content-card {
  margin-bottom: $spacing-lg;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
  }
  
  .timeline-container {
    min-height: 300px;
  }
  
  .chart-container {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.quick-actions-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: $spacing-md;
    justify-content: center;
    flex-wrap: wrap;
    
    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
      align-items: center;
      
      .el-button {
        width: 100%;
        max-width: 300px;
      }
    }
  }
}

// 响应式处理
@media (max-width: $breakpoint-lg) {
  .dashboard-stats {
    .stat-card {
      margin-bottom: $spacing-md;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;
    
    .header-actions {
      width: 100%;
      justify-content: flex-start;
    }
  }
  
  .dashboard-stats {
    :deep(.el-col) {
      margin-bottom: $spacing-md;
    }
  }
}

// 入场动画
.dashboard-view {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
