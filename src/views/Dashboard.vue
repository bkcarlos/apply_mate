<template>
  <div class="dashboard">
    <a-row :gutter="[16, 16]">
      <!-- 统计卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic
            :title="$t('pages.dashboard.activeInterviews')"
            :value="dashboardStats.ongoingInterviews"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <TeamOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic
            :title="$t('pages.dashboard.pendingInterviews')"
            :value="dashboardStats.pendingInterviews"
            :value-style="{ color: '#fa8c16' }"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic
            :title="$t('pages.dashboard.receivedOffers')"
            :value="dashboardStats.receivedOffers"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <TrophyOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic
            :title="$t('pages.dashboard.totalApplications')"
            :value="dashboardStats.totalApplications"
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix>
              <FileTextOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px;">
      <!-- 近期面试 -->
      <a-col :xs="24" :lg="12">
        <a-card :title="$t('pages.dashboard.recentInterviews')" size="small">
          <template #extra>
            <a-button type="text" size="small" @click="goToInterviews">
                              {{ $t('pages.dashboard.viewAll') }}
            </a-button>
          </template>
          
          <a-table
            :columns="interviewColumns"
            :data-source="recentInterviews"
            :pagination="false"
            size="small"
            :locale="{ emptyText: $t('pages.dashboard.noScheduledInterviews') }"
          />
        </a-card>
      </a-col>

      <!-- Offer 薪资对比 -->
      <a-col :xs="24" :lg="12">
        <a-card :title="$t('pages.dashboard.offerSalaryComparison')" size="small">
          <template #extra>
            <a-button type="text" size="small" @click="goToAnalysis">
              {{ $t('pages.dashboard.detailedAnalysis') }}
            </a-button>
          </template>
          
          <div ref="salaryChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快速操作 -->
    <a-row style="margin-top: 16px;">
      <a-col :span="24">
        <a-card :title="$t('pages.dashboard.quickActions')" size="small">
          <a-space wrap>
            <a-button block type="primary" @click="goToNewInterview">
              {{ $t('pages.dashboard.newInterviewProcess') }}
            </a-button>
            <a-button block @click="goToCompanies">
              {{ $t('pages.dashboard.manageCompanies') }}
            </a-button>
            <a-button block @click="goToAnalysis">
              {{ $t('pages.dashboard.viewStatistics') }}
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import {
  TeamOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
  CalendarOutlined,
  PlusOutlined,
  BankOutlined,
  BarChartOutlined,
} from '@ant-design/icons-vue';

import { useAnalyticsStore } from '@/stores/analytics';
import { useInterviewStore } from '@/stores/interview';
import { useCompanyStore } from '@/stores/company';

const router = useRouter();
const { t, locale } = useI18n();
const analyticsStore = useAnalyticsStore();
const interviewStore = useInterviewStore();
const companyStore = useCompanyStore();

const salaryChartRef = ref<HTMLElement>();

// 仪表盘统计数据
const dashboardStats = computed(() => analyticsStore.dashboardStats);

// 表格列定义
const interviewColumns = computed(() => [
  {
    title: t('form.company'),
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: t('form.round'),
    dataIndex: 'round',
    key: 'round',
  },
  {
    title: t('form.scheduledAt'),
    dataIndex: 'scheduledAt',
    key: 'scheduledAt',
    customRender: ({ record }: any) => formatDate(record.scheduledAt),
  },
]);

// 近期面试（7天内）
const recentInterviews = computed(() => {
  const now = new Date();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  
  const allRoundsWithCompany = interviewStore.rounds
    .filter(round => round.scheduledAt)
    .map(round => {
      const process = interviewStore.getProcessById(round.processId);
      const company = process ? companyStore.getCompanyById(process.companyId) : null;
      return {
        ...round,
        companyName: company?.name || 'Unknown',
      };
    });
  
  return allRoundsWithCompany
    .filter(round => 
      round.scheduledAt &&
      Math.abs(now.getTime() - round.scheduledAt.getTime()) <= oneWeek
    )
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5); // 只显示前5个
});

// 格式化日期
const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  return dayjs(date).format('MM-DD');
};

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    [t('pages.dashboard.pendingStatus')]: 'orange',
    [t('pages.dashboard.scheduledStatus')]: 'blue', 
    [t('pages.dashboard.completedStatus')]: 'green',
    [t('pages.dashboard.cancelledStatus')]: 'red',
  };
  return colors[status] || 'default';
};

// 页面跳转
const goToInterviews = () => router.push('/interviews');
const goToNewInterview = () => router.push('/interviews/new');
const goToCompanies = () => router.push('/companies');
const goToAnalysis = () => router.push('/analysis');

// 初始化薪资对比图表
const initSalaryChart = () => {
  if (!salaryChartRef.value) return;
  
  const chart = echarts.init(salaryChartRef.value);
  const salaryData = analyticsStore.salaryComparisonData;
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a}: ¥{c}k'
    },
    xAxis: {
      type: 'category',
      data: salaryData.map(item => item.companyName),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: t('pages.dashboard.annualSalary'),
      axisLabel: {
        formatter: '¥{value}k'
      }
    },
    series: [
      {
        name: t('pages.dashboard.annualPackage'),
        type: 'bar',
        data: salaryData.map(item => Math.round((item.salary.base * 12 + item.salary.base * (item.salary.yearEndMonths || 0)) / 1000)),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        }
      }
    ],
    grid: {
      left: '50px',
      right: '20px',
      bottom: '80px',
      top: '40px'
    }
  };
  
  chart.setOption(option);
  
  // 响应式
  window.addEventListener('resize', () => {
    chart.resize();
  });
};

// 加载数据
const loadData = async () => {
  try {
    await Promise.all([
      interviewStore.loadProcesses(),
      interviewStore.loadRounds(),
      companyStore.loadCompanies(),
    ]);
    
    // 数据加载完成后初始化图表
    await nextTick();
    initSalaryChart();
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
};

// 监听语言变化，重新初始化图表
watch(locale, () => {
  nextTick(() => {
    initSalaryChart();
  });
});

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.dashboard {
  width: 100%;
}

:deep(.ant-statistic-title) {
  color: #666;
  font-size: 14px;
}

:deep(.ant-statistic-content) {
  font-size: 24px;
  font-weight: 600;
}

:deep(.ant-list-item-meta-title) {
  font-size: 14px;
  margin-bottom: 4px;
}

:deep(.ant-list-item-meta-description) {
  font-size: 12px;
  color: #999;
}
</style>
