<template>
  <div class="dashboard-container">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">{{ $t('pages.dashboard.title') }}</h1>
          <p class="page-subtitle">{{ $t('pages.dashboard.subtitle') }}</p>
        </div>
        <div class="action-section">
          <a-space>
            <a-button @click="loadData" :loading="loading">
              <template #icon><icon-refresh /></template>
              {{ $t('common.refresh') }}
            </a-button>
            <a-button type="primary" @click="goToNewInterview">
              <template #icon><icon-plus /></template>
              {{ $t('pages.dashboard.newInterviewProcess') }}
            </a-button>
          </a-space>
        </div>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-section">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="6" v-for="(stat, index) in dashboardStatsCards" :key="index">
          <div class="stat-card" :class="`stat-card-${stat.type}`">
            <div class="stat-card-inner">
              <div class="stat-icon">
                <component :is="stat.icon" />
              </div>
              <div class="stat-content">
                <div class="stat-value">
                  <a-statistic 
                    :value="stat.value" 
                    :precision="stat.precision || 0"
                    :value-style="{ fontSize: '28px', fontWeight: '600', color: stat.color }"
                  />
                </div>
                <div class="stat-title">{{ stat.title }}</div>
                <div class="stat-trend" v-if="stat.trend">
                  <span :class="stat.trend.type === 'up' ? 'trend-up' : 'trend-down'">
                    <icon-arrow-up v-if="stat.trend.type === 'up'" />
                    <icon-arrow-down v-else />
                    {{ stat.trend.value }}%
                  </span>
                  <span class="trend-text">{{ stat.trend.text }}</span>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 主要内容区域 -->
    <a-row :gutter="[24, 24]" class="main-content">
      <!-- 左侧列 -->
      <a-col :xs="24" :lg="16">
        <!-- 近期面试安排 -->
        <a-card class="content-card upcoming-interviews" :loading="loading">
          <template #title>
            <div class="card-title">
              <icon-calendar class="title-icon" />
              {{ $t('pages.dashboard.upcomingInterviewsSubtitle') }}
            </div>
          </template>
          <template #extra>
            <a-space>
              <a-button type="text" size="small" @click="goToCalendar">
                <template #icon><icon-eye /></template>
                {{ $t('nav.calendar') }}
              </a-button>
              <a-button type="text" size="small" @click="goToInterviews">
                {{ $t('pages.dashboard.viewAll') }}
                <template #icon><icon-right /></template>
              </a-button>
            </a-space>
          </template>

          <div v-if="upcomingInterviews.length > 0" class="interview-timeline">
            <div 
              v-for="(interview, index) in upcomingInterviews" 
              :key="interview.id"
              class="timeline-item"
              :class="{ 'is-today': isToday(interview.scheduledAt) }"
            >
              <div class="timeline-dot" :class="getTimelineDotClass(interview.scheduledAt)"></div>
              <div class="timeline-content">
                <div class="interview-info">
                  <div class="interview-header">
                    <span class="company-name">{{ interview.companyName }}</span>
                    <a-tag :color="getRoundTypeColor(interview.type)" size="small">
                      {{ $t(`roundType.${interview.type}`) }}
                    </a-tag>
                  </div>
                  <div class="interview-meta">
                    <span class="interview-time">
                      <icon-clock-circle />
                      {{ formatInterviewTime(interview.scheduledAt) }}
                    </span>
                    <span class="interview-round">
                      {{ $t('pages.interviews.roundNumber', { number: interview.round }) }}
                    </span>
                  </div>
                  <div class="interview-location" v-if="interview.location">
                    <icon-location />
                    {{ interview.location }}
                  </div>
                </div>
                <div class="interview-actions">
                  <a-button size="mini" @click="viewInterviewDetail(interview)">
                    {{ $t('common.view') }}
                  </a-button>
                </div>
              </div>
            </div>
          </div>

          <a-empty v-else :description="$t('pages.dashboard.noUpcomingInterviews')">
            <template #image>
              <icon-calendar style="font-size: 64px; color: var(--color-text-4);" />
            </template>
            <a-button type="primary" @click="goToNewInterview">
              {{ $t('pages.dashboard.newInterviewProcess') }}
            </a-button>
          </a-empty>
        </a-card>

        <!-- 智能推荐卡片 -->
        <a-card class="content-card recommendations" style="margin-top: 24px;">
          <template #title>
            <div class="card-title">
              <icon-bulb class="title-icon" />
              智能推荐
            </div>
          </template>

          <div class="recommendation-list">
            <div class="recommendation-item" v-for="rec in recommendations" :key="rec.id">
              <div class="rec-icon" :class="`rec-${rec.type}`">
                <component :is="rec.icon" />
              </div>
              <div class="rec-content">
                <div class="rec-title">{{ rec.title }}</div>
                <div class="rec-desc">{{ rec.description }}</div>
              </div>
              <div class="rec-action">
                <a-button size="small" @click="handleRecommendation(rec)">
                  {{ rec.actionText }}
                </a-button>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 右侧列 -->
      <a-col :xs="24" :lg="8">
        <!-- 薪资对比分析 -->
        <a-card class="content-card salary-analysis">
          <template #title>
            <div class="card-title">
              <icon-line-chart class="title-icon" />
              {{ $t('pages.dashboard.offerSalaryComparison') }}
            </div>
          </template>
          <template #extra>
            <a-button type="text" size="small" @click="goToAnalysis">
              {{ $t('pages.dashboard.detailedAnalysis') }}
              <template #icon><icon-right /></template>
            </a-button>
          </template>

          <div v-if="analyticsStore.salaryComparisonData.length > 0" class="salary-chart-container">
            <div ref="salaryChartRef" style="height: 280px;"></div>
          </div>
          <a-empty v-else :description="$t('pages.dashboard.noOfferEncouragement')">
            <template #image>
              <div class="empty-illustration">🌟</div>
            </template>
          </a-empty>
        </a-card>

        <!-- 快速操作 -->
        <a-card class="content-card quick-actions" style="margin-top: 24px;">
          <template #title>
            <div class="card-title">
              <icon-thunderbolt class="title-icon" />
              {{ $t('pages.dashboard.quickActions') }}
            </div>
          </template>

          <div class="action-grid">
            <div class="action-item" @click="goToNewInterview">
              <div class="action-icon primary">
                <icon-plus />
              </div>
              <div class="action-text">{{ $t('pages.dashboard.newInterviewProcess') }}</div>
            </div>
            <div class="action-item" @click="goToCompanies">
              <div class="action-icon success">
                <icon-home />
              </div>
              <div class="action-text">{{ $t('pages.dashboard.manageCompanies') }}</div>
            </div>
            <div class="action-item" @click="goToAnalysis">
              <div class="action-icon warning">
                <icon-bar-chart />
              </div>
              <div class="action-text">{{ $t('pages.dashboard.viewStatistics') }}</div>
            </div>
            <div class="action-item" @click="generateTestData" v-if="isDev">
              <div class="action-icon info">
                <icon-robot />
              </div>
              <div class="action-text">{{ $t('pages.dashboard.generateTestData') }}</div>
            </div>
          </div>
        </a-card>

        <!-- 最近活动 -->
        <a-card class="content-card recent-activities" style="margin-top: 24px;">
          <template #title>
            <div class="card-title">
              <icon-history class="title-icon" />
              最近活动
            </div>
          </template>

          <a-timeline class="activity-timeline">
            <a-timeline-item v-for="activity in recentActivities" :key="activity.id">
              <template #dot>
                <div class="activity-dot" :class="`activity-${activity.type}`">
                  <component :is="activity.icon" />
                </div>
              </template>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-desc">{{ activity.description }}</div>
                <div class="activity-time">{{ formatActivityTime(activity.createdAt) }}</div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as echarts from 'echarts';

// 配置 dayjs 插件
dayjs.extend(relativeTime);
import {
  IconRefresh,
  IconPlus,
  IconArrowUp,
  IconArrowDown,
  IconCalendar,
  IconEye,
  IconRight,
  IconClockCircle,
  IconLocation,
  IconBulb,
  IconLineChart,
  IconThunderbolt,
  IconHome,
  IconBarChart,
  IconRobot,
  IconHistory,
  IconUser,
  IconTrophy,
  IconFile,
  IconUserGroup,
} from '@arco-design/web-vue/es/icon';

import { useAnalyticsStore } from '@/stores/analytics';
import { useInterviewStore } from '@/stores/interview';
import { useCompanyStore } from '@/stores/company';

const router = useRouter();
const { t } = useI18n();
const analyticsStore = useAnalyticsStore();
const interviewStore = useInterviewStore();
const companyStore = useCompanyStore();

// 状态
const loading = ref(false);
const salaryChartRef = ref<HTMLElement>();
const isDev = ref(process.env.NODE_ENV === 'development');

// 仪表盘统计数据
const dashboardStats = computed(() => analyticsStore.dashboardStats);

// 统计卡片配置
const dashboardStatsCards = computed(() => [
  {
    title: t('pages.dashboard.activeInterviews'),
    value: dashboardStats.value.ongoingInterviews,
    icon: IconUserGroup,
    color: '#165dff',
    type: 'primary',
    trend: { type: 'up', value: 12, text: '较上周' }
  },
  {
    title: t('pages.dashboard.pendingInterviews'),
    value: dashboardStats.value.pendingInterviews,
    icon: IconClockCircle,
    color: '#ff7d00',
    type: 'warning',
    trend: { type: 'down', value: 8, text: '较上周' }
  },
  {
    title: t('pages.dashboard.receivedOffers'),
    value: dashboardStats.value.receivedOffers,
    icon: IconTrophy,
    color: '#00b42a',
    type: 'success',
    trend: { type: 'up', value: 25, text: '较上月' }
  },
  {
    title: t('pages.dashboard.totalApplications'),
    value: dashboardStats.value.totalApplications,
    icon: IconFile,
    color: '#722ed1',
    type: 'info'
  }
]);

// 智能推荐
const recommendations = ref([
  {
    id: '1',
    type: 'interview',
    icon: IconCalendar,
    title: '即将到来的面试',
    description: '明天下午2点有腾讯的技术面试，建议提前准备算法题',
    actionText: '查看详情'
  },
  {
    id: '2',
    type: 'follow',
    icon: IconUser,
    title: '跟进提醒',
    description: '字节跳动的面试已经过去3天，建议主动跟进结果',
    actionText: '发送邮件'
  },
  {
    id: '3',
    type: 'optimize',
    icon: IconBulb,
    title: '优化建议',
    description: '您的简历可以增加项目经验描述，提高面试通过率',
    actionText: '去优化'
  }
]);

// 最近活动
const recentActivities = ref([
  {
    id: '1',
    type: 'interview',
    icon: IconUser,
    title: '完成了阿里巴巴二面',
    description: '技术面试顺利完成，等待HR面试通知',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2小时前
  },
  {
    id: '2',
    type: 'apply',
    icon: IconFile,
    title: '投递了新职位',
    description: '向美团投递了高级前端工程师职位',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6小时前
  },
  {
    id: '3',
    type: 'offer',
    icon: IconTrophy,
    title: '收到Offer',
    description: '腾讯发送了正式Offer，待确认',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1天前
  }
]);

// 未来面试安排
const upcomingInterviews = computed(() => {
  const today = dayjs().startOf('day');
  const sevenDaysLater = today.add(7, 'day').endOf('day');
  
  const allRoundsWithCompany = interviewStore.rounds
    .filter(round => round.scheduledAt && round.result === 'pending')
    .map(round => {
      const process = interviewStore.getProcessById(round.processId);
      const company = process ? companyStore.getCompanyById(process.companyId) : null;
      return {
        ...round,
        companyName: company?.name || t('interview.unknownCompany'),
      };
    });
  
  return allRoundsWithCompany
    .filter(round => {
      const interviewDay = dayjs(round.scheduledAt).startOf('day');
      return (interviewDay.isSame(today) || interviewDay.isAfter(today)) && 
             interviewDay.isBefore(sevenDaysLater.add(1, 'day'));
    })
    .sort((a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf())
    .slice(0, 8);
});

// 工具函数
const isToday = (date: Date) => {
  return dayjs(date).isSame(dayjs(), 'day');
};

const getTimelineDotClass = (date: Date) => {
  const now = dayjs();
  const interviewTime = dayjs(date);
  
  if (interviewTime.isSame(now, 'day')) {
    return 'today';
  } else if (interviewTime.diff(now, 'hour') <= 24) {
    return 'soon';
  }
  return 'normal';
};

const getRoundTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    phone: 'blue',
    video: 'green',
    onsite: 'orange',
    technical: 'purple',
    hr: 'cyan',
    final: 'red'
  };
  return colors[type] || 'default';
};

const formatInterviewTime = (date: Date) => {
  const now = dayjs();
  const interviewTime = dayjs(date);
  
  if (interviewTime.isSame(now, 'day')) {
    return `今天 ${interviewTime.format('HH:mm')}`;
  } else if (interviewTime.diff(now, 'day') === 1) {
    return `明天 ${interviewTime.format('HH:mm')}`;
  } else {
    return interviewTime.format('MM-DD HH:mm');
  }
};

const formatActivityTime = (date: Date) => {
  return dayjs(date).fromNow();
};

// 事件处理
const goToNewInterview = () => router.push('/interviews/new');
const goToInterviews = () => router.push('/interviews');
const goToCompanies = () => router.push('/companies');
const goToAnalysis = () => router.push('/analysis');
const goToCalendar = () => router.push('/calendar');

const viewInterviewDetail = (interview: any) => {
  const process = interviewStore.getProcessById(interview.processId);
  if (process) {
    router.push(`/interviews/${process.id}`);
  }
};

const handleRecommendation = (rec: any) => {
  // 处理推荐项点击
  console.log('Handle recommendation:', rec);
};

const generateTestData = async () => {
  // 生成测试数据的逻辑
  console.log('Generate test data');
};

// 初始化薪资图表
const initSalaryChart = () => {
  if (!salaryChartRef.value) return;
  
  const chart = echarts.init(salaryChartRef.value);
  const salaryData = analyticsStore.salaryComparisonData;
  
  if (salaryData.length === 0) {
    chart.clear();
    return;
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: salaryData.map(item => item.companyName),
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      name: '年薪 (万元)'
    },
    series: [
      {
        name: '年度总包',
        type: 'bar',
        barWidth: '60%',
        data: salaryData.map(item => ({
          value: item.annualSalary / 10000,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#165dff' },
              { offset: 1, color: '#4080ff' }
            ])
          }
        }))
      }
    ]
  };

  chart.setOption(option);
  
  // 响应式
  const resizeHandler = () => chart.resize();
  window.addEventListener('resize', resizeHandler);
  
  // 组件卸载时清理
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler);
    chart.dispose();
  });
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      interviewStore.loadProcesses(),
      interviewStore.loadRounds(),
      companyStore.loadCompanies(),
      analyticsStore.loadDashboardStats()
    ]);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadData();
  nextTick(() => {
    initSalaryChart();
  });
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-3);
  margin: 0;
}

.action-section {
  flex-shrink: 0;
}

/* 统计卡片 */
.stats-section {
  margin-bottom: 24px;
}

.stat-card {
  height: 120px;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border-1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-card-inner {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 20px;
  position: relative;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-right: 16px;
  flex-shrink: 0;
}

.stat-card-primary .stat-icon {
  background: linear-gradient(135deg, #165dff, #4080ff);
}

.stat-card-warning .stat-icon {
  background: linear-gradient(135deg, #ff7d00, #ff9a33);
}

.stat-card-success .stat-icon {
  background: linear-gradient(135deg, #00b42a, #33c456);
}

.stat-card-info .stat-icon {
  background: linear-gradient(135deg, #722ed1, #9254de);
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  margin-bottom: 4px;
}

.stat-title {
  font-size: 14px;
  color: var(--color-text-2);
  margin-bottom: 8px;
  line-height: 1.2;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.trend-up {
  color: var(--color-success-6);
}

.trend-down {
  color: var(--color-danger-6);
}

.trend-text {
  color: var(--color-text-3);
}

/* 内容卡片 */
.content-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-border-1);
}

.content-card :deep(.arco-card-header) {
  border-bottom: 1px solid var(--color-border-1);
  padding: 20px 24px 16px;
}

.content-card :deep(.arco-card-body) {
  padding: 24px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-1);
}

.title-icon {
  font-size: 18px;
  color: var(--color-primary-6);
}

/* 面试时间轴 */
.interview-timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  position: relative;
  border-left: 2px solid var(--color-border-2);
  margin-left: 12px;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: -1px;
  bottom: 0;
  width: 2px;
  height: 16px;
  background: var(--color-border-2);
}

.timeline-item.is-today {
  border-left-color: var(--color-primary-6);
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  left: -6px;
  top: 20px;
  background: var(--color-bg-2);
  border: 2px solid var(--color-border-2);
}

.timeline-dot.today {
  background: var(--color-primary-6);
  border-color: var(--color-primary-6);
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.timeline-dot.soon {
  background: var(--color-warning-6);
  border-color: var(--color-warning-6);
}

.timeline-content {
  flex: 1;
  margin-left: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.interview-info {
  flex: 1;
  min-width: 0;
}

.interview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.company-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-1);
}

.interview-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;
  font-size: 14px;
  color: var(--color-text-2);
}

.interview-meta > span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.interview-location {
  font-size: 13px;
  color: var(--color-text-3);
  display: flex;
  align-items: center;
  gap: 4px;
}

.interview-actions {
  flex-shrink: 0;
  margin-left: 16px;
}

/* 推荐列表 */
.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
  transition: all 0.2s;
}

.recommendation-item:hover {
  background: var(--color-fill-2);
}

.rec-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  font-size: 18px;
}

.rec-interview {
  background: linear-gradient(135deg, #165dff, #4080ff);
}

.rec-follow {
  background: linear-gradient(135deg, #ff7d00, #ff9a33);
}

.rec-optimize {
  background: linear-gradient(135deg, #00b42a, #33c456);
}

.rec-content {
  flex: 1;
  min-width: 0;
}

.rec-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.rec-desc {
  font-size: 13px;
  color: var(--color-text-3);
  line-height: 1.4;
}

.rec-action {
  flex-shrink: 0;
}

/* 快速操作网格 */
.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.action-item:hover {
  background: var(--color-fill-2);
  transform: translateY(-1px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 20px;
  color: white;
}

.action-icon.primary {
  background: linear-gradient(135deg, #165dff, #4080ff);
}

.action-icon.success {
  background: linear-gradient(135deg, #00b42a, #33c456);
}

.action-icon.warning {
  background: linear-gradient(135deg, #ff7d00, #ff9a33);
}

.action-icon.info {
  background: linear-gradient(135deg, #722ed1, #9254de);
}

.action-text {
  font-size: 13px;
  color: var(--color-text-1);
  line-height: 1.3;
}

/* 活动时间轴 */
.activity-timeline {
  margin-top: 16px;
}

.activity-timeline :deep(.arco-timeline-item-content) {
  margin-left: 16px;
  padding-bottom: 20px;
}

.activity-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.activity-interview {
  background: var(--color-primary-6);
}

.activity-apply {
  background: var(--color-warning-6);
}

.activity-offer {
  background: var(--color-success-6);
}

.activity-content {
  margin-left: 8px;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.activity-desc {
  font-size: 13px;
  color: var(--color-text-3);
  margin-bottom: 8px;
  line-height: 1.4;
}

.activity-time {
  font-size: 12px;
  color: var(--color-text-4);
}

/* 空状态 */
.empty-illustration {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0;
  }
  
  .stat-card-inner {
    padding: 16px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
    margin-right: 12px;
  }
  
  .content-card :deep(.arco-card-header) {
    padding: 16px 20px 12px;
  }
  
  .content-card :deep(.arco-card-body) {
    padding: 20px;
  }
  
  .timeline-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .interview-actions {
    margin-left: 0;
    align-self: stretch;
  }
}
</style>
