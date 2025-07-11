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
      <!-- 近期面试安排 - 未来7天 -->
      <a-col :xs="24" :lg="12">
        <a-card size="small">
          <template #title>
            <div class="upcoming-interviews-title">
              <CalendarOutlined style="margin-right: 8px;" />
              {{ $t('pages.dashboard.upcomingInterviewsSubtitle') }}
            </div>
          </template>
          <template #extra>
            <a-button type="text" size="small" @click="goToInterviews">
              {{ $t('pages.dashboard.viewAll') }}
            </a-button>
          </template>
          
          <a-table
            :columns="upcomingInterviewColumns"
            :data-source="upcomingInterviews"
            :pagination="false"
            size="small"
            :locale="{ emptyText: $t('pages.dashboard.noUpcomingInterviews') }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'scheduledAt'">
                <div class="interview-time">
                  <div class="interview-date">{{ formatUpcomingDate(record.scheduledAt) }}</div>
                  <div class="interview-day-info">{{ getRelativeDayText(record.scheduledAt) }}</div>
                </div>
              </template>
              <template v-else-if="column.key === 'round'">
                <a-tag color="blue">{{ $t('pages.interviews.roundNumber', { number: record.round }) }}</a-tag>
              </template>
              <template v-else-if="column.key === 'type'">
                <span class="interview-type">{{ $t(`roundType.${record.type}`) }}</span>
              </template>
            </template>
          </a-table>
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
            <a-button block type="dashed" @click="generateTestData" :loading="testDataLoading">
              生成测试数据
            </a-button>
            <a-button block type="dashed" danger @click="clearTestData" :loading="clearDataLoading">
              清理测试数据
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
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
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

// 配置dayjs
dayjs.extend(relativeTime);
dayjs.locale(locale.value === 'zh' ? 'zh-cn' : 'en');

const salaryChartRef = ref<HTMLElement>();
const testDataLoading = ref(false);
const clearDataLoading = ref(false);

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

// 未来面试表格列定义
const upcomingInterviewColumns = computed(() => [
  {
    title: t('form.company'),
    dataIndex: 'companyName',
    key: 'companyName',
    width: 120,
  },
  {
    title: t('form.round'),
    key: 'round',
    width: 80,
  },
  {
    title: t('form.roundType'),
    key: 'type',
    width: 120,
  },
  {
    title: t('pages.dashboard.interviewTime'),
    key: 'scheduledAt',
    width: 140,
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

// 未来 7 天面试安排
const upcomingInterviews = computed(() => {
  // 使用dayjs来处理日期，确保准确性
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
      // 面试时间要在今天(包含)到未来7天内
      return (interviewDay.isSame(today) || interviewDay.isAfter(today)) && 
             interviewDay.isBefore(sevenDaysLater.add(1, 'day'));
    })
    .sort((a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf())
    .slice(0, 8); // 显示未来7天内的前8个面试
});

// 格式化日期
const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  return dayjs(date).format('MM-DD');
};

// 格式化未来面试日期
const formatUpcomingDate = (date: Date | undefined) => {
  if (!date) return '';
  return dayjs(date).format('MM-DD HH:mm');
};

// 获取相对日期文本
const getRelativeDayText = (date: Date | undefined) => {
  if (!date) return '';
  
  // 使用startOf('day')来比较日期，忽略具体时间
  const today = dayjs().startOf('day');
  const interviewDay = dayjs(date).startOf('day');
  const diffDays = interviewDay.diff(today, 'day');
  
  // 临时调试日志
  console.log('Date comparison debug:', {
    originalDate: date,
    today: today.format('YYYY-MM-DD'),
    interviewDay: interviewDay.format('YYYY-MM-DD'),
    diffDays: diffDays
  });
  
  if (diffDays === 0) {
    return t('pages.dashboard.today');
  } else if (diffDays === 1) {
    return t('pages.dashboard.tomorrow');
  } else if (diffDays === 2) {
    return t('pages.dashboard.dayAfterTomorrow');
  } else if (diffDays > 0 && diffDays <= 7) {
    // 使用本地化的星期几显示
    return interviewDay.format('dddd');
  } else {
    return interviewDay.format('MM-DD');
  }
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

// 测试数据操作
const generateTestData = async () => {
  testDataLoading.value = true;
  try {
    // 添加测试公司和面试流程
    const testCompanies = ['阿里巴巴', '腾讯', '字节跳动', '美团', '滴滴出行'];
    
    for (const companyName of testCompanies) {
      // 创建公司
      const company = await companyStore.addCompany({
        name: companyName,
        industry: '互联网',
        scale: '1000+人'
      });
      
      // 创建面试流程
      const process = await interviewStore.addProcess({
        companyId: company.id,
        position: '前端开发工程师',
        city: '北京',
        status: 'interviewing',
        conclusion: 'in_progress',
        sourceChannel: 'Boss直聘',
        expectedSalary: { min: 20000, max: 35000 }
      });
      
      // 创建未来面试轮次
      const now = new Date();
      const roundTypes = ['phone', 'video', 'technical', 'hr', 'final'] as const;
      
      for (let i = 1; i <= 2; i++) {
        const daysFromNow = Math.floor(Math.random() * 7) + 1;
        const scheduledAt = new Date(now);
        scheduledAt.setDate(now.getDate() + daysFromNow);
        scheduledAt.setHours(9 + Math.floor(Math.random() * 9), Math.random() > 0.5 ? 0 : 30, 0, 0);
        
        await interviewStore.addRound({
          processId: process.id,
          round: i,
          type: roundTypes[Math.floor(Math.random() * roundTypes.length)],
          scheduledAt,
          result: 'pending',
          interviewer: `${companyName}面试官`,
          location: '视频会议'
        });
      }
    }
    
    await loadData(); // 重新加载数据
    console.log('测试数据生成成功');
  } catch (error) {
    console.error('生成测试数据失败:', error);
  } finally {
    testDataLoading.value = false;
  }
};

const clearTestData = async () => {
  clearDataLoading.value = true;
  try {
    // 清理所有数据
    const rounds = await interviewStore.rounds;
    for (const round of rounds) {
      await interviewStore.deleteRound(round.id);
    }
    
    const processes = await interviewStore.processes;
    for (const process of processes) {
      await interviewStore.deleteProcess(process.id);
    }
    
    const companies = await companyStore.companies;
    for (const company of companies) {
      await companyStore.deleteCompany(company.id);
    }
    
    await loadData(); // 重新加载数据
    console.log('测试数据清理成功');
  } catch (error) {
    console.error('清理测试数据失败:', error);
  } finally {
    clearDataLoading.value = false;
  }
};

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

// 监听语言变化，重新初始化图表和dayjs本地化
watch(locale, (newLocale) => {
  dayjs.locale(newLocale === 'zh' ? 'zh-cn' : 'en');
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

.upcoming-interviews-title {
  display: flex;
  align-items: center;
  color: #1890ff;
  font-weight: 600;
}

.interview-time {
  text-align: center;
}

.interview-date {
  font-weight: 600;
  color: #262626;
  margin-bottom: 2px;
}

.interview-day-info {
  font-size: 12px;
  color: #8c8c8c;
}

.interview-type {
  color: #595959;
  font-size: 13px;
}
</style>
