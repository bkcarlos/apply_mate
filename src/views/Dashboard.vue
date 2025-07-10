<template>
  <div class="dashboard">
    <a-row :gutter="[16, 16]">
      <!-- 统计卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic
            title="进行中的面试"
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
            title="待安排的面试"
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
            title="已收到 Offer"
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
            title="总投递数"
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
        <a-card title="近期面试安排" size="small">
          <template #extra>
            <a-button type="text" size="small" @click="goToInterviews">
              查看全部
            </a-button>
          </template>
          
          <a-list
            :data-source="upcomingInterviews"
            :locale="{ emptyText: '暂无安排的面试' }"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <span>{{ item.roundName }} - {{ item.companyName }}</span>
                  </template>
                  <template #description>
                    <a-space>
                      <CalendarOutlined />
                      {{ formatDate(item.scheduledTime) }}
                    </a-space>
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a-tag :color="getStatusColor(item.status)">
                    {{ item.status }}
                  </a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- Offer 薪资对比 -->
      <a-col :xs="24" :lg="12">
        <a-card title="Offer 薪资对比" size="small">
          <template #extra>
            <a-button type="text" size="small" @click="goToAnalysis">
              详细分析
            </a-button>
          </template>
          
          <div ref="salaryChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快速操作 -->
    <a-row style="margin-top: 16px;">
      <a-col :span="24">
        <a-card title="快速操作" size="small">
          <a-space wrap>
            <a-button type="primary" @click="goToNewInterview">
              <PlusOutlined />
              新建面试流程
            </a-button>
            
            <a-button @click="goToCompanies">
              <BankOutlined />
              管理公司库
            </a-button>
            
            <a-button @click="goToAnalysis">
              <BarChartOutlined />
              查看统计
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
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
const analyticsStore = useAnalyticsStore();
const interviewStore = useInterviewStore();
const companyStore = useCompanyStore();

const salaryChartRef = ref<HTMLElement>();

// 仪表盘统计数据
const dashboardStats = computed(() => analyticsStore.dashboardStats);

// 近期面试（7天内）
const upcomingInterviews = computed(() => {
  const sevenDaysLater = dayjs().add(7, 'day');
  
  return interviewStore.rounds
    .filter(round => {
      return round.scheduledTime && 
             round.status === '已安排' &&
             dayjs(round.scheduledTime).isBefore(sevenDaysLater);
    })
    .map(round => {
      const process = interviewStore.getProcessById(round.processId);
      const company = process ? companyStore.getCompanyById(process.companyId) : null;
      
      return {
        ...round,
        companyName: company?.name || 'Unknown',
      };
    })
    .sort((a, b) => {
      if (!a.scheduledTime || !b.scheduledTime) return 0;
      return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
    })
    .slice(0, 5); // 只显示前5个
});

// 格式化日期
const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  return dayjs(date).format('MM-DD');
};

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    '待安排': 'orange',
    '已安排': 'blue',
    '已完成': 'green',
    '已取消': 'red',
  };
  return colorMap[status] || 'default';
};

// 页面跳转
const goToInterviews = () => router.push('/interviews');
const goToNewInterview = () => router.push('/interviews/new');
const goToCompanies = () => router.push('/companies');
const goToAnalysis = () => router.push('/analysis');

// 初始化薪资对比图表
const initSalaryChart = async () => {
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
      name: '年薪 (k)',
      axisLabel: {
        formatter: '¥{value}k'
      }
    },
    series: [
      {
        name: '年度总包',
        type: 'bar',
        data: salaryData.map(item => Math.round(item.salary.total / 1000)),
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
