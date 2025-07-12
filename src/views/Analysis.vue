<template>
  <div class="analysis-view">
    <div class="analysis-header">
      <h2 class="page-title">数据分析</h2>
      <div class="header-actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleDateRangeChange"
        />
        <el-button @click="exportData">
          <ph-download :size="16" />
          导出数据
        </el-button>
      </div>
    </div>

    <!-- 总览统计 -->
    <div class="overview-stats">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ totalApplications }}</div>
              <div class="stat-label">总投递数</div>
              <div class="stat-trend" :class="applicationTrend.type">
                <ph-trend-up v-if="applicationTrend.type === 'up'" :size="16" />
                <ph-trend-down v-if="applicationTrend.type === 'down'" :size="16" />
                <span>{{ applicationTrend.value }}%</span>
              </div>
            </div>
            <ph-paper-plane-tilt class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ totalInterviews }}</div>
              <div class="stat-label">面试总数</div>
              <div class="stat-trend" :class="interviewTrend.type">
                <ph-trend-up v-if="interviewTrend.type === 'up'" :size="16" />
                <ph-trend-down v-if="interviewTrend.type === 'down'" :size="16" />
                <span>{{ interviewTrend.value }}%</span>
              </div>
            </div>
            <ph-calendar class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ totalOffers }}</div>
              <div class="stat-label">收到Offer</div>
              <div class="stat-trend" :class="offerTrend.type">
                <ph-trend-up v-if="offerTrend.type === 'up'" :size="16" />
                <ph-trend-down v-if="offerTrend.type === 'down'" :size="16" />
                <span>{{ offerTrend.value }}%</span>
              </div>
            </div>
            <ph-trophy class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ overallSuccessRate }}%</div>
              <div class="stat-label">总成功率</div>
              <div class="stat-trend" :class="successRateTrend.type">
                <ph-trend-up v-if="successRateTrend.type === 'up'" :size="16" />
                <ph-trend-down v-if="successRateTrend.type === 'down'" :size="16" />
                <span>{{ successRateTrend.value }}%</span>
              </div>
            </div>
            <ph-chart-line class="stat-icon" />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表分析 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>投递趋势分析</span>
          </template>
          <div ref="applicationTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>面试状态分布</span>
          </template>
          <div ref="interviewStatusChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>公司类型分析</span>
          </template>
          <div ref="companyTypeChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>行业分布</span>
          </template>
          <div ref="industryChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <span>面试轮次分析</span>
          </template>
          <div ref="interviewRoundChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细分析表格 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <span>公司投递统计</span>
          </template>
          <el-table :data="companyStats" stripe style="width: 100%">
            <el-table-column prop="name" label="公司名称" width="150" />
            <el-table-column prop="applications" label="投递数" width="80" align="center" />
            <el-table-column prop="interviews" label="面试数" width="80" align="center" />
            <el-table-column prop="offers" label="Offer数" width="80" align="center" />
            <el-table-column prop="successRate" label="成功率" width="80" align="center">
              <template #default="{ row }">
                <span>{{ row.successRate }}%</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <span>行业投递统计</span>
          </template>
          <el-table :data="industryStats" stripe style="width: 100%">
            <el-table-column prop="industry" label="行业" width="120" />
            <el-table-column prop="companies" label="公司数" width="80" align="center" />
            <el-table-column prop="applications" label="投递数" width="80" align="center" />
            <el-table-column prop="interviews" label="面试数" width="80" align="center" />
            <el-table-column prop="successRate" label="成功率" width="80" align="center">
              <template #default="{ row }">
                <span>{{ row.successRate }}%</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  PhDownload,
  PhTrendUp,
  PhTrendDown,
  PhPaperPlaneTilt,
  PhCalendar,
  PhTrophy,
  PhChartLine
} from '@phosphor-icons/vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { useInterviewStore } from '@/stores/interview'
import { useCompanyStore } from '@/stores/company'

const interviewStore = useInterviewStore()
const companyStore = useCompanyStore()

// 响应式数据
const dateRange = ref<[string, string]>(['', ''])
const applicationTrendChart = ref<HTMLElement>()
const interviewStatusChart = ref<HTMLElement>()
const companyTypeChart = ref<HTMLElement>()
const industryChart = ref<HTMLElement>()
const interviewRoundChart = ref<HTMLElement>()

// 计算属性
const totalApplications = computed(() => interviewStore.processes.length)
const totalInterviews = computed(() => interviewStore.rounds.length)
const totalOffers = computed(() => 
  interviewStore.processes.filter((p: any) => p.status === '已发Offer').length
)
const overallSuccessRate = computed(() => {
  if (totalApplications.value === 0) return 0
  return Math.round((totalOffers.value / totalApplications.value) * 100)
})

// 趋势计算（简化版本，实际应该比较不同时间段）
const applicationTrend = computed(() => ({ type: 'up', value: 12 }))
const interviewTrend = computed(() => ({ type: 'up', value: 8 }))
const offerTrend = computed(() => ({ type: 'down', value: 5 }))
const successRateTrend = computed(() => ({ type: 'up', value: 3 }))

const companyStats = computed(() => {
  const stats = companyStore.companies.map(company => {
    const applications = interviewStore.processes.filter(p => p.companyId === company.id).length
    const interviews = interviewStore.rounds.filter(r => r.companyId === company.id).length
    const offers = interviewStore.processes.filter((p: any) => 
      p.companyId === company.id && p.status === '已发Offer'
    ).length
    const successRate = applications > 0 ? Math.round((offers / applications) * 100) : 0
    
    return {
      name: company.name,
      applications,
      interviews,
      offers,
      successRate
    }
  }).filter(stat => stat.applications > 0)
  
  return stats.sort((a, b) => b.applications - a.applications)
})

const industryStats = computed(() => {
  const industryMap = new Map()
  
  companyStore.companies.forEach(company => {
    const industry = company.industry || '未分类'
    if (!industryMap.has(industry)) {
      industryMap.set(industry, {
        industry,
        companies: 0,
        applications: 0,
        interviews: 0,
        offers: 0
      })
    }
    
    const stat = industryMap.get(industry)
    stat.companies++
    stat.applications += interviewStore.processes.filter(p => p.companyId === company.id).length
    stat.interviews += interviewStore.rounds.filter(r => r.companyId === company.id).length
    stat.offers += interviewStore.processes.filter((p: any) => 
      p.companyId === company.id && p.status === '已发Offer'
    ).length
  })
  
  return Array.from(industryMap.values()).map(stat => ({
    ...stat,
    successRate: stat.applications > 0 ? Math.round((stat.offers / stat.applications) * 100) : 0
  })).sort((a, b) => b.applications - a.applications)
})

// 方法
const handleDateRangeChange = (dates: [string, string] | null) => {
  if (dates) {
    dateRange.value = dates
    // 重新加载数据和图表
    initCharts()
  }
}

const exportData = () => {
  // TODO: 实现数据导出功能
  ElMessage.success('数据导出功能开发中...')
}

const initApplicationTrendChart = () => {
  if (!applicationTrendChart.value) return
  
  const chart = echarts.init(applicationTrendChart.value)
  
  // 生成最近30天的数据
  const dates = []
  const data = []
  for (let i = 29; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day')
    dates.push(date.format('MM-DD'))
    // 模拟数据，实际应该从真实数据计算
    data.push(Math.floor(Math.random() * 10) + 1)
  }
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: data,
      type: 'line',
      smooth: true,
      areaStyle: {},
      itemStyle: {
        color: '#F28A31'
      }
    }]
  }
  
  chart.setOption(option)
}

const initInterviewStatusChart = () => {
  if (!interviewStatusChart.value) return
  
  const chart = echarts.init(interviewStatusChart.value)
  
  const statusCount = {
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    pending: 0
  }
  
  interviewStore.rounds.forEach(round => {
    statusCount[round.status as keyof typeof statusCount]++
  })
  
  const data = Object.entries(statusCount).map(([status, count]) => ({
    name: getStatusName(status),
    value: count
  }))
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: '50%',
      data: data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  chart.setOption(option)
}

const initCompanyTypeChart = () => {
  if (!companyTypeChart.value) return
  
  const chart = echarts.init(companyTypeChart.value)
  
  const typeCount = new Map()
  companyStore.companies.forEach(company => {
    const type = company.type || '未分类'
    typeCount.set(type, (typeCount.get(type) || 0) + 1)
  })
  
  const data = Array.from(typeCount.entries()).map(([type, count]) => ({
    name: type,
    value: count
  }))
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  chart.setOption(option)
}

const initIndustryChart = () => {
  if (!industryChart.value) return
  
  const chart = echarts.init(industryChart.value)
  
  const industryCount = new Map()
  companyStore.companies.forEach(company => {
    const industry = company.industry || '未分类'
    industryCount.set(industry, (industryCount.get(industry) || 0) + 1)
  })
  
  const sortedData = Array.from(industryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // 只显示前10个
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: sortedData.map(([industry]) => industry),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: sortedData.map(([, count]) => count),
      type: 'bar',
      itemStyle: {
        color: '#6975A7'
      }
    }]
  }
  
  chart.setOption(option)
}

const initInterviewRoundChart = () => {
  if (!interviewRoundChart.value) return
  
  const chart = echarts.init(interviewRoundChart.value)
  
  const roundCount = new Map()
  interviewStore.processes.forEach((process, index) => {
    const roundKey = process.position || `面试${index + 1}`
    roundCount.set(roundKey, (roundCount.get(roundKey) || 0) + 1)
  })
  
  const sortedData = Array.from(roundCount.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: sortedData.map(([round]) => round)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: sortedData.map(([, count]) => count),
      type: 'bar',
      itemStyle: {
        color: '#F28A31'
      }
    }]
  }
  
  chart.setOption(option)
}

const getStatusName = (status: string) => {
  const statusMap: Record<string, string> = {
    'scheduled': '已安排',
    'completed': '已完成',
    'cancelled': '已取消',
    'pending': '待确认'
  }
  return statusMap[status] || status
}

const initCharts = async () => {
  await nextTick()
  initApplicationTrendChart()
  initInterviewStatusChart()
  initCompanyTypeChart()
  initIndustryChart()
  initInterviewRoundChart()
}

// 生命周期
onMounted(async () => {
  // 设置默认日期范围为最近30天
  const endDate = dayjs().format('YYYY-MM-DD')
  const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
  dateRange.value = [startDate, endDate]
  
  await Promise.all([
    interviewStore.loadProcesses(),
    interviewStore.loadRounds(),
    companyStore.loadCompanies()
  ])
  
  initCharts()
})
</script>

<style scoped lang="scss">
.analysis-view {
  padding: 24px;
  
  .analysis-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .page-title {
      margin: 0;
      color: var(--text-primary);
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
  
  .overview-stats {
    margin-bottom: 24px;
    
    .stat-card {
      .el-card__body {
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .stat-content {
        .stat-number {
          font-size: 28px;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        
        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          
          &.up {
            color: var(--success-color);
          }
          
          &.down {
            color: var(--error-color);
          }
        }
      }
      
      .stat-icon {
        font-size: 40px;
        color: var(--primary-color);
        opacity: 0.6;
      }
    }
  }
  
  .chart-card,
  .table-card {
    margin-bottom: 16px;
    
    .chart-container {
      height: 300px;
      width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .analysis-view {
    padding: 16px;
    
    .analysis-header {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
      
      .header-actions {
        justify-content: center;
        flex-wrap: wrap;
      }
    }
    
    .overview-stats {
      .el-col {
        margin-bottom: 16px;
      }
    }
    
    .chart-container {
      height: 250px !important;
    }
  }
}
</style>
