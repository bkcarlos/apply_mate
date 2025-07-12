<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInterviewsStore } from '@/stores/interviews'
import { useCompaniesStore } from '@/stores/companies'
import { 
  Plus, 
  Calendar, 
  TrendCharts, 
  OfficeBuilding, 
  ChatLineRound, 
  Clock, 
  Trophy, 
  DataAnalysis, 
  ArrowRight 
} from '@element-plus/icons-vue'

const router = useRouter()
const interviewsStore = useInterviewsStore()
const companiesStore = useCompaniesStore()

// Get dashboard data
const stats = computed(() => interviewsStore.dashboardStats)
const upcomingInterviews = computed(() => interviewsStore.upcomingInterviews)
const offeredProcesses = computed(() => interviewsStore.processesByStatus('已发Offer'))

// Format date for display
const formatDate = (date: Date) => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return '今天'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return '明天'
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
}

// Format time for display
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// Get company name by ID
const getCompanyName = (companyId: string) => {
  const company = companiesStore.getCompanyById(companyId)
  return company?.name || '未知公司'
}

// Navigate to interview detail
const viewInterview = (processId: string) => {
  router.push(`/interviews/${processId}`)
}

// Navigate to create new interview
const createInterview = () => {
  router.push('/interviews/new')
}

// Chart data for offers
const chartData = computed(() => {
  const processes = offeredProcesses.value
  if (processes.length === 0) return null
  
  return {
    labels: processes.map(p => getCompanyName(p.companyId)),
    datasets: [{
      label: '年度总包 (万元)',
      data: processes.map(p => p.offeredSalary ? p.offeredSalary.total / 10000 : 0),
      backgroundColor: ['#F28A31', '#6975A7', '#4CAF50', '#FF9800', '#2196F3']
    }]
  }
})
</script>

<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <h1>仪表盘</h1>
      <p class="page-description">欢迎回来！这里是你的求职进展概览</p>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <el-card class="stat-card ongoing">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><ChatLineRound /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.ongoingInterviews }}</div>
            <div class="stat-label">进行中的面试</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card pending">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.pendingInterviews }}</div>
            <div class="stat-label">待安排的面试</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card offers">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><Trophy /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.receivedOffers }}</div>
            <div class="stat-label">已收到 Offer</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card total">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><DataAnalysis /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalApplications }}</div>
            <div class="stat-label">总投递数量</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Upcoming Interviews -->
      <el-card class="upcoming-interviews">
        <template #header>
          <div class="card-header">
            <h3>近期面试安排</h3>
            <el-button 
              type="text" 
              @click="router.push('/calendar')"
              :icon="Calendar"
            >
              查看日历
            </el-button>
          </div>
        </template>

        <div v-if="upcomingInterviews.length === 0" class="empty-state">
          <el-empty description="暂无近期面试安排" />
          <el-button 
            type="primary" 
            @click="createInterview"
            :icon="Plus"
          >
            新建面试流程
          </el-button>
        </div>

        <div v-else class="interviews-timeline">
          <div 
            v-for="interview in upcomingInterviews" 
            :key="interview.id"
            class="interview-item"
            @click="viewInterview(interview.processId)"
          >
            <div class="interview-date">
              <div class="date-text">{{ formatDate(interview.scheduledTime) }}</div>
              <div class="time-text">{{ formatTime(interview.scheduledTime) }}</div>
            </div>
            <div class="interview-info">
              <div class="company-position">
                <span class="company">{{ getCompanyName(interviewsStore.getProcessById(interview.processId)?.companyId || '') }}</span>
                <span class="position">{{ interviewsStore.getProcessById(interview.processId)?.position }}</span>
              </div>
              <div class="round-name">{{ interview.roundName }}</div>
            </div>
            <div class="interview-actions">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </el-card>

      <!-- Offer Comparison Chart -->
      <el-card class="offer-chart">
        <template #header>
          <div class="card-header">
            <h3>Offer 薪资对比</h3>
            <el-button 
              type="text" 
              @click="router.push('/analysis')"
              :icon="TrendCharts"
            >
              详细分析
            </el-button>
          </div>
        </template>

        <div v-if="!chartData" class="empty-state">
          <el-empty description="暂无 Offer 数据" />
          <p class="empty-tip">开始你的求职旅程，获得心仪的 Offer 吧！</p>
        </div>

        <div v-else class="chart-container">
          <div class="chart-placeholder">
            <el-icon class="chart-icon"><TrendCharts /></el-icon>
            <p>图表功能开发中...</p>
            <div class="offer-summary">
              <div 
                v-for="(process, index) in offeredProcesses" 
                :key="process.id"
                class="offer-item"
              >
                <div class="offer-company">{{ getCompanyName(process.companyId) }}</div>
                <div class="offer-amount">{{ (process.offeredSalary?.total || 0) / 10000 }}万</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>快速操作</h3>
      <div class="actions-grid">
        <el-button 
          type="primary" 
          size="large" 
          @click="createInterview"
          :icon="Plus"
        >
          新建面试流程
        </el-button>
        <el-button 
          size="large" 
          @click="router.push('/companies')"
          :icon="OfficeBuilding"
        >
          查看所有公司
        </el-button>
        <el-button 
          size="large" 
          @click="router.push('/analysis')"
          :icon="TrendCharts"
        >
          数据分析
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.page-description {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  cursor: pointer;
  transition: var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-card.ongoing .stat-icon {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.stat-card.pending .stat-icon {
  background-color: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.stat-card.offers .stat-icon {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.stat-card.total .stat-icon {
  background-color: rgba(242, 138, 49, 0.1);
  color: var(--color-primary);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: var(--color-text-primary);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.empty-tip {
  color: var(--color-text-secondary);
  margin: var(--spacing-md) 0;
}

.interviews-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.interview-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);
}

.interview-item:hover {
  border-color: var(--color-primary);
  background-color: rgba(242, 138, 49, 0.05);
}

.interview-date {
  min-width: 80px;
  text-align: center;
}

.date-text {
  font-weight: 600;
  color: var(--color-text-primary);
}

.time-text {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.interview-info {
  flex: 1;
}

.company-position {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  margin-bottom: 4px;
}

.company {
  font-weight: 600;
  color: var(--color-text-primary);
}

.position {
  color: var(--color-text-secondary);
}

.round-name {
  font-size: 0.9rem;
  color: var(--color-primary);
}

.interview-actions {
  color: var(--color-text-secondary);
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: var(--color-text-secondary);
}

.chart-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.offer-summary {
  margin-top: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.offer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
}

.offer-company {
  font-weight: 500;
}

.offer-amount {
  font-weight: 600;
  color: var(--color-primary);
}

.quick-actions {
  padding: var(--spacing-lg) 0;
}

.quick-actions h3 {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.actions-grid {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    flex-direction: column;
  }
  
  .actions-grid .el-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .interview-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .interview-date {
    min-width: auto;
    text-align: left;
  }
}
</style>