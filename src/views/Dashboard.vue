<template>
  <div class="dashboard">
    <a-row :gutter="[16, 16]">
      <!-- 统计卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic
            :title="$t('pages.dashboard.activeInterviews')"
            :value="dashboardStats.ongoingInterviews"
            :value-style="{ color: '#165dff' }"
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic
            :title="$t('pages.dashboard.pendingInterviews')"
            :value="dashboardStats.pendingInterviews"
            :value-style="{ color: '#ff7d00' }"
          >
            <template #prefix>
              <icon-clock-circle />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic
            :title="$t('pages.dashboard.receivedOffers')"
            :value="dashboardStats.receivedOffers"
            :value-style="{ color: '#00b42a' }"
          >
            <template #prefix>
              <icon-trophy />
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
              <icon-file />
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
              <icon-calendar style="margin-right: 8px;" />
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
          
          <div v-if="analyticsStore.salaryComparisonData.length > 0" ref="salaryChartRef" style="height: 300px;"></div>
          <div v-else style="height: 300px; display: flex; align-items: center; justify-content: center; color: #666;">
            <div style="text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">🌟</div>
              <div style="font-size: 16px; font-weight: 500;">{{ $t('pages.dashboard.noOfferEncouragement') }}</div>
            </div>
          </div>
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
              {{ $t('pages.dashboard.generateTestData') }}
            </a-button>
            <a-button block type="dashed" danger @click="clearTestData" :loading="clearDataLoading">
              {{ $t('pages.dashboard.clearTestData') }}
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
  IconUser,
  IconClockCircle,
  IconTrophy,
  IconFile,
  IconCalendar,
} from '@arco-design/web-vue/es/icon';

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
    const testCompanies = [
      // 传统互联网大厂：月薪中等，年终奖丰厚
      { name: '阿里巴巴', hasOffer: true, salary: { base: 28000, yearEndMonths: 15, guaranteedMonths: 13, typicalMonths: 14 } },
      { name: '腾讯', hasOffer: true, salary: { base: 32000, yearEndMonths: 16, guaranteedMonths: 14, typicalMonths: 15 } },
      
      // 外企：月薪很高，但年终奖少
      { name: 'Google', hasOffer: true, salary: { base: 45000, yearEndMonths: 3, guaranteedMonths: 1, typicalMonths: 2 } },
      { name: 'Microsoft', hasOffer: true, salary: { base: 42000, yearEndMonths: 2, guaranteedMonths: 1, typicalMonths: 1.5 } },
      
      // 创业公司：月薪高，几乎没有年终奖
      { name: '某创业公司', hasOffer: true, salary: { base: 38000, yearEndMonths: 1, guaranteedMonths: 0, typicalMonths: 0.5 } },
      
      // 进行中的面试
      { name: '字节跳动', hasOffer: false, salary: undefined },
      { name: '美团', hasOffer: false, salary: undefined }
    ];
    
    for (const companyData of testCompanies) {
      // 创建公司
      const company = await companyStore.addCompany({
        name: companyData.name,
        industry: '互联网',
        scale: '1000+人'
      });
      
      // 创建面试流程
      const process = await interviewStore.addProcess({
        companyId: company.id,
        position: '前端开发工程师',
        city: '北京',
        status: companyData.hasOffer ? 'offered' : 'interviewing',
        conclusion: companyData.hasOffer ? 'passed' : 'in_progress',
        sourceChannel: 'Boss直聘',
        expectedSalary: { min: 20000, max: 35000 },
        offeredSalary: companyData.salary
      });
      
      // 如果没有offer，创建合理的面试轮次
      if (!companyData.hasOffer) {
        const now = new Date();
        const roundTypes = ['phone', 'video', 'technical', 'hr', 'final'] as const;
        
        // 随机确定当前进展到第几轮
        const currentRound = Math.floor(Math.random() * 3) + 1; // 1-3轮
        
        // 创建已完成的历史轮次
        for (let i = 1; i < currentRound; i++) {
          const pastDate = new Date(now);
          pastDate.setDate(now.getDate() - (currentRound - i) * 3 - Math.floor(Math.random() * 3)); // 几天前
          pastDate.setHours(14 + Math.floor(Math.random() * 4), Math.random() > 0.5 ? 0 : 30, 0, 0);
          
          await interviewStore.addRound({
            processId: process.id,
            round: i,
            type: roundTypes[i - 1], // 按顺序进行
            scheduledAt: pastDate,
            result: 'passed',
            interviewer: `${companyData.name}面试官${i}`,
            location: i === 1 ? '电话面试' : '视频会议',
            feedback: `第${i}轮面试通过`
          });
        }
        
        // 创建下一轮待进行的面试（只有一轮）
        const daysFromNow = Math.floor(Math.random() * 7) + 1;
        const scheduledAt = new Date(now);
        scheduledAt.setDate(now.getDate() + daysFromNow);
        scheduledAt.setHours(9 + Math.floor(Math.random() * 9), Math.random() > 0.5 ? 0 : 30, 0, 0);
        
        await interviewStore.addRound({
          processId: process.id,
          round: currentRound,
          type: roundTypes[currentRound - 1],
          scheduledAt,
          result: 'pending',
          interviewer: `${companyData.name}面试官${currentRound}`,
          location: '视频会议',
          notes: `第${currentRound}轮面试`
        });
      } else {
        // 如果有offer，创建一些已完成的历史面试轮次
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30) - 1); // 1-30天前
        
        for (let i = 1; i <= 3; i++) {
          const roundDate = new Date(pastDate);
          roundDate.setDate(pastDate.getDate() + (i - 1) * 3); // 每轮间隔3天
          roundDate.setHours(14, 0, 0, 0); // 下午2点
          
          await interviewStore.addRound({
            processId: process.id,
            round: i,
            type: i === 1 ? 'phone' : i === 2 ? 'technical' : 'hr',
            scheduledAt: roundDate,
            result: 'passed',
            interviewer: `${companyData.name}面试官${i}`,
            location: i === 1 ? '电话面试' : '视频会议',
            feedback: `第${i}轮面试通过`
          });
        }
      }
    }
    
    await loadData(); // 重新加载数据
    console.log('测试数据生成成功 - 包含3个offer和2个进行中的面试流程');
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
  
  if (salaryData.length === 0) {
    // 没有数据时清空图表
    chart.clear();
    return;
  }
  
  // 计算各维度的最大值
  let maxAnnualValue = 0;
  let maxMonthlyValue = 0;
  
  // 准备雷达图数据
  const radarSeries = salaryData.map(item => {
    const baseMonthlySalary = Math.round(item.salary.base / 1000); // 月薪转换为k，取整
    const baseAnnual = Math.round((item.salary.base * 12) / 10000); // 年薪转换为万，取整
    const minPackage = Math.round((item.salary.base * (12 + item.salary.guaranteedMonths)) / 10000); // 转换为万
    const typicalPackage = Math.round((item.salary.base * (12 + item.salary.typicalMonths)) / 10000); // 转换为万
    const maxPackage = Math.round((item.salary.base * (12 + item.salary.yearEndMonths)) / 10000); // 转换为万
    
    // 更新最大值
    maxMonthlyValue = Math.max(maxMonthlyValue, baseMonthlySalary);
    maxAnnualValue = Math.max(maxAnnualValue, baseAnnual, minPackage, typicalPackage, maxPackage);
    
    return {
      name: item.companyName,
      value: [baseMonthlySalary, baseAnnual, minPackage, typicalPackage, maxPackage]
    };
  });
  
  // 设置不同维度的最大值，按照指定间隔（3个刻度）
  const monthlyMax = Math.ceil(maxMonthlyValue / 10) * 15; // 月薪：确保3个刻度显示清晰，单位k
  const annualMax = Math.ceil(maxAnnualValue / 5) * 5 + 5; // 年薪：确保3个刻度显示清晰，单位万
  
  const option = {
    title: {
      text: t('pages.dashboard.salaryUnit'),
      left: 10,
      top: 10,
      textStyle: {
        fontSize: 12,
        color: '#666',
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params: any) {
        const data = params.data;
        const indicators = [
          t('pages.dashboard.baseMonthlySalary'),
          t('pages.dashboard.baseAnnualSalary'), 
          t('pages.dashboard.minAnnualPackage'), 
          t('pages.dashboard.typicalAnnualPackage'), 
          t('pages.dashboard.maxAnnualPackage')
        ];
        let result = `<strong>${data.name}</strong><br/>`;
        data.value.forEach((value: number, index: number) => {
          // 第一个是月薪（k），其他是年薪（万）
          const unit = index === 0 ? 'k' : '万';
          result += `${indicators[index]}: ¥${value}${unit}<br/>`;
        });
        return result;
      }
    },
         legend: {
       data: salaryData.map(item => item.companyName),
       right: 10,
       top: 'center',
       orient: 'vertical',
       itemGap: 15,
       textStyle: {
         fontSize: 12
       }
     },
         radar: {
       indicator: [
         { name: t('pages.dashboard.baseMonthlySalary'), max: monthlyMax },
         { name: t('pages.dashboard.baseAnnualSalary'), max: annualMax },
         { name: t('pages.dashboard.minAnnualPackage'), max: annualMax },
         { name: t('pages.dashboard.typicalAnnualPackage'), max: annualMax },
         { name: t('pages.dashboard.maxAnnualPackage'), max: annualMax }
       ],
       center: ['45%', '50%'],
       radius: '70%',
       splitNumber: 3, // 减少刻度数量到3个（显示4条线），避免重叠
       axisName: {
         color: '#666',
         fontSize: 13,
         padding: [3, 5] // 增加标签内边距
       },
       splitArea: {
         show: true,
         areaStyle: {
           color: ['rgba(114, 172, 209, 0.08)', 'rgba(114, 172, 209, 0.04)', 'transparent']
         }
       },
       splitLine: {
         show: true,
         lineStyle: {
           color: '#ddd',
           width: 1
         }
       },
       axisLine: {
         show: true,
         lineStyle: {
           color: '#ccc'
         }
       },
       axisLabel: {
         show: true,
         formatter: function(value: number, index: number) {
           if (value === 0) return '';
           // 只显示数字，不显示单位和符号
           const intValue = Math.round(value);
           return `${intValue}`;
         },
         color: '#666',
         fontSize: 11,
         padding: [3, 4],
         backgroundColor: 'rgba(255, 255, 255, 0.9)',
         borderRadius: 3,
         shadowBlur: 2,
         shadowColor: 'rgba(0,0,0,0.1)'
       }
     },
    series: [
      {
        type: 'radar',
        data: radarSeries,
        itemStyle: {
          borderWidth: 2
        },
        lineStyle: {
          width: 2
        },
        areaStyle: {
          opacity: 0.2
        },
        emphasis: {
          lineStyle: {
            width: 4
          },
          areaStyle: {
            opacity: 0.4
          }
        }
      }
    ],
    color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']
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
