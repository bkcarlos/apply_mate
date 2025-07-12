<template>
  <div class="dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">仪表盘</h1>
      <p class="page-subtitle">今日求职状态概览</p>
    </div>
    
    <!-- 统计卡片区域 -->
    <div class="stats-grid">
      <DashboardCard
        v-for="stat in stats"
        :key="stat.key"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :color="stat.color"
        :trend="stat.trend"
        :clickable="true"
        @click="handleCardClick(stat.key)"
      />
    </div>
    
    <!-- 主要内容区域 -->
    <div class="dashboard-content">
      <!-- 近期面试安排 -->
      <div class="content-section">
        <el-card class="section-card">
          <template #header>
            <div class="section-header">
              <h3>近期面试安排</h3>
              <el-button type="text" @click="goToCalendar">查看全部</el-button>
            </div>
          </template>
          
          <div class="timeline-container">
            <UpcomingInterviews :max-items="5" />
          </div>
        </el-card>
      </div>
      
      <!-- Offer薪资对比 -->
      <div class="content-section">
        <el-card class="section-card">
          <template #header>
            <div class="section-header">
              <h3>Offer 薪资对比</h3>
              <el-button type="text" @click="goToAnalysis">详细分析</el-button>
            </div>
          </template>
          
          <div class="chart-container">
            <OfferChart :height="300" />
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- 快速操作区域 -->
    <div class="quick-actions">
      <el-card class="action-card">
        <template #header>
          <h3>快速开始</h3>
        </template>
        
        <div class="action-buttons">
          <el-button
            type="primary"
            size="large"
            :icon="Plus"
            @click="createInterview"
          >
            新建面试流程
          </el-button>
          
          <el-button
            size="large"
            :icon="OfficeBuilding"
            @click="manageCompanies"
          >
            管理公司
          </el-button>
          
          <el-button
            size="large"
            :icon="Calendar"
            @click="goToCalendar"
          >
            查看日历
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Plus,
  OfficeBuilding,
  Calendar
} from '@element-plus/icons-vue'
import { useInterviewStore } from '@/stores/interview'
import { useRoundStore } from '@/stores/round'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import UpcomingInterviews from '@/components/dashboard/UpcomingInterviews.vue'
import OfferChart from '@/components/dashboard/OfferChart.vue'

const router = useRouter()
const interviewStore = useInterviewStore()
const roundStore = useRoundStore()

// 计算统计数据
const stats = computed(() => {
  const dashboardStats = interviewStore.getDashboardStats
  
  return [
    {
      key: 'ongoing',
      title: '进行中的面试',
      value: dashboardStats.ongoingInterviews,
      icon: 'Document',
      color: '#F28A31',
      trend: null
    },
    {
      key: 'pending',
      title: '待安排的面试',
      value: roundStore.getRoundsByStatus('pending').length,
      icon: 'Calendar',
      color: '#6975A7',
      trend: null
    },
    {
      key: 'offers',
      title: '已收到 Offer',
      value: dashboardStats.receivedOffers,
      icon: 'Trophy',
      color: '#67C23A',
      trend: null
    },
    {
      key: 'total',
      title: '总投递数量',
      value: dashboardStats.totalApplications,
      icon: 'TrendCharts',
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

onMounted(() => {
  // 页面加载完成时的欢迎提示
  setTimeout(() => {
    if (interviewStore.interviews.length === 0) {
      ElMessage({
        message: '欢迎使用 Apply Mate！开始创建您的第一个面试流程吧 🎉',
        type: 'success',
        duration: 3000
      })
    }
  }, 1000)
})
</script>

<style lang="scss" scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: $spacing-xl;
  
  .page-title {
    font-size: $font-size-4xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $spacing-xs;
    
    @media (max-width: $breakpoint-md) {
      font-size: $font-size-3xl;
    }
  }
  
  .page-subtitle {
    font-size: $font-size-lg;
    color: $color-text-secondary;
    margin: 0;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
  
  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
  
  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }
  
  .content-section {
    .section-card {
      height: 100%;
      
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        h3 {
          margin: 0;
          font-size: $font-size-xl;
          font-weight: $font-weight-semibold;
          color: $color-text-primary;
        }
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
}

.quick-actions {
  .action-card {
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
}

// 入场动画
.dashboard {
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
