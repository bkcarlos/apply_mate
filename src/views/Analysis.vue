<template>
  <div class="analysis">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>统计分析</h2>
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>统计分析</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>

    <!-- 薪资对比分析 -->
    <a-card title="Offer 薪资对比" class="chart-card">
      <template #extra>
        <a-space>
          <a-select
            v-model:value="salaryFilters.city"
            placeholder="筛选城市"
            style="width: 120px"
            allow-clear
          >
            <a-select-option value="">全部城市</a-select-option>
            <a-select-option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </a-select-option>
          </a-select>
          
          <a-select
            v-model:value="salaryFilters.position"
            placeholder="筛选岗位"
            style="width: 150px"
            allow-clear
          >
            <a-select-option value="">全部岗位</a-select-option>
            <a-select-option v-for="position in positions" :key="position" :value="position">
              {{ position }}
            </a-select-option>
          </a-select>
        </a-space>
      </template>
      
      <div v-if="filteredSalaryData.length === 0" class="empty-chart">
        <a-empty description="暂无 Offer 数据" />
      </div>
      <div v-else ref="salaryChartRef" style="height: 400px;"></div>
    </a-card>

    <a-row :gutter="[16, 16]" style="margin-top: 16px;">
      <!-- 渠道效率分析 -->
      <a-col :xs="24" :lg="12">
        <a-card title="投递渠道效率分析" class="chart-card">
          <div v-if="channelStats.length === 0" class="empty-chart">
            <a-empty description="暂无投递数据" />
          </div>
          <div v-else ref="channelChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>

      <!-- 状态分布 -->
      <a-col :xs="24" :lg="12">
        <a-card title="面试状态分布" class="chart-card">
          <div v-if="statusStats.length === 0" class="empty-chart">
            <a-empty description="暂无面试数据" />
          </div>
          <div v-else ref="statusChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Offer 对比与年度收入规划器 -->
    <a-card title="Offer 对比与年度收入规划" style="margin-top: 16px;">
      <a-form layout="inline" style="margin-bottom: 16px;">
        <a-form-item label="当前税前月薪">
          <a-input-number
            v-model:value="incomeAnalysis.currentMonthlySalary"
            placeholder="请输入当前月薪"
            style="width: 150px"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
          />
        </a-form-item>
        
        <a-form-item label="预期交接日期">
          <a-date-picker
            v-model:value="incomeAnalysis.handoverDate"
            placeholder="选择交接日期"
          />
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" @click="calculateIncome">
            计算年度收入
          </a-button>
        </a-form-item>
      </a-form>

      <!-- Offer 选择 -->
      <div style="margin-bottom: 16px;">
        <h4>选择要对比的 Offer:</h4>
        <a-checkbox-group v-model:value="incomeAnalysis.selectedOffers">
          <a-row>
            <a-col v-for="offer in availableOffers" :key="offer.id" :span="8">
              <a-checkbox :value="offer.id">
                {{ offer.companyName }} - {{ offer.position }}
                <span class="salary-badge">
                  {{ getSalaryDisplayText(offer.salary) }}
                </span>
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>

      <!-- 虚拟 Offer -->
      <div style="margin-bottom: 16px;">
        <h4>
          添加虚拟对比项
          <a-button type="text" size="small" @click="addVirtualOffer">
            <PlusOutlined />
          </a-button>
        </h4>
        <a-space direction="vertical" style="width: 100%;">
          <div v-for="(virtualOffer, index) in incomeAnalysis.virtualOffers" :key="index" class="virtual-offer">
            <a-input-group compact>
              <a-input
                v-model:value="virtualOffer.companyName"
                placeholder="公司名称"
                style="width: 25%"
              />
              <a-input
                v-model:value="virtualOffer.position"
                placeholder="岗位"
                style="width: 25%"
              />
              <a-input-number
                v-model:value="virtualOffer.yearlyTotal"
                placeholder="年度总包"
                style="width: 40%"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              />
              <a-button style="width: 10%" @click="removeVirtualOffer(index)">
                <DeleteOutlined />
              </a-button>
            </a-input-group>
          </div>
        </a-space>
      </div>

      <!-- 年度收入分析结果 -->
      <div v-if="incomeAnalysisResults.length > 0">
        <h4>年度收入分析结果:</h4>
        <a-table
          :columns="incomeColumns"
          :data-source="incomeAnalysisResults"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'yearlyTotal'">
              <span class="amount">¥{{ formatSalary(record.yearlyTotal) }}</span>
            </template>
            <template v-else-if="column.key === 'estimatedYearlyIncome'">
              <span class="amount">¥{{ formatSalary(record.estimatedYearlyIncome) }}</span>
            </template>
            <template v-else-if="column.key === 'monthlyIncrease'">
              <span :class="record.monthlyIncrease >= 0 ? 'increase' : 'decrease'">
                {{ record.monthlyIncrease >= 0 ? '+' : '' }}¥{{ formatSalary(Math.abs(record.monthlyIncrease)) }}
              </span>
            </template>
            <template v-else-if="column.key === 'increasePercentage'">
              <span :class="record.increasePercentage >= 0 ? 'increase' : 'decrease'">
                {{ record.increasePercentage >= 0 ? '+' : '' }}{{ record.increasePercentage.toFixed(1) }}%
              </span>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import * as echarts from 'echarts';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

import { useAnalyticsStore } from '@/stores/analytics';
import { useInterviewStore } from '@/stores/interview';
import { useCompanyStore } from '@/stores/company';
import { SalaryCalculator } from '@/utils/salary';
import type { VirtualOffer, YearlyIncomeAnalysis } from '@/types';

const analyticsStore = useAnalyticsStore();
const interviewStore = useInterviewStore();
const companyStore = useCompanyStore();

// 图表引用
const salaryChartRef = ref<HTMLElement>();
const channelChartRef = ref<HTMLElement>();
const statusChartRef = ref<HTMLElement>();

// 薪资筛选条件
const salaryFilters = ref({
  city: '',
  position: '',
});

// 收入分析相关
const incomeAnalysis = ref({
  currentMonthlySalary: 0,
  handoverDate: dayjs().add(1, 'month') as Dayjs,
  selectedOffers: [] as string[],
  virtualOffers: [] as VirtualOffer[],
});

const incomeAnalysisResults = ref<YearlyIncomeAnalysis[]>([]);

// 计算属性
const cities = computed(() => {
  const citySet = new Set(
    analyticsStore.salaryComparisonData.map(item => item.city)
  );
  return Array.from(citySet);
});

const positions = computed(() => {
  const positionSet = new Set(
    analyticsStore.salaryComparisonData.map(item => item.position)
  );
  return Array.from(positionSet);
});

const filteredSalaryData = computed(() => {
  return analyticsStore.salaryComparisonData.filter(item => {
    if (salaryFilters.value.city && item.city !== salaryFilters.value.city) {
      return false;
    }
    if (salaryFilters.value.position && item.position !== salaryFilters.value.position) {
      return false;
    }
    return true;
  });
});

const channelStats = computed(() => analyticsStore.channelStats);

const statusStats = computed(() => {
  const statusMap = new Map();
  interviewStore.processes.forEach((process: any) => {
    const count = statusMap.get(process.status) || 0;
    statusMap.set(process.status, count + 1);
  });
  
  return Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
  }));
});

const availableOffers = computed(() => {
  return analyticsStore.salaryComparisonData;
});

// 年度收入表格列
const incomeColumns = [
  {
    title: '公司/选项',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: '年度总包',
    key: 'yearlyTotal',
  },
  {
    title: '预估年度收入',
    key: 'estimatedYearlyIncome',
  },
  {
    title: '月薪变化',
    key: 'monthlyIncrease',
  },
  {
    title: '涨幅比例',
    key: 'increasePercentage',
  },
];

// 工具函数
const formatSalary = (amount: number) => {
  return SalaryCalculator.formatSalary(amount);
};

const getSalaryDisplayText = (salary: any) => {
  if (salary.base) {
    // 新格式薪资
    return SalaryCalculator.getSalaryRangeText(salary);
  } else {
    // 旧格式薪资兼容
    return `¥${formatSalary(salary.total || salary)}`;
  }
};

// 初始化薪资对比图表
const initSalaryChart = () => {
  if (!salaryChartRef.value || filteredSalaryData.value.length === 0) return;
  
  const chart = echarts.init(salaryChartRef.value);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}<br/>年度总包: ¥${formatSalary(data.value)}`;
      }
    },
    xAxis: {
      type: 'category',
      data: filteredSalaryData.value.map(item => `${item.companyName}\n${item.position}`),
      axisLabel: {
        rotate: 45,
        interval: 0,
        fontSize: 10,
      }
    },
    yAxis: {
      type: 'value',
      name: '年薪',
      axisLabel: {
        formatter: (value: number) => `¥${formatSalary(value)}`
      }
    },
    series: [
      {
        name: '年度总包',
        type: 'bar',
        data: filteredSalaryData.value.map(item => {
          const salary = item.salary;
          if (salary.base) {
            // 使用典型值作为图表显示
            return SalaryCalculator.calculateTypicalTotal(salary);
          } else {
            // 兼容旧格式
            return salary.total || 0;
          }
        }),
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
      left: '80px',
      right: '20px',
      bottom: '100px',
      top: '40px'
    }
  };
  
  chart.setOption(option);
  
  // 响应式
  const resizeObserver = new ResizeObserver(() => {
    chart.resize();
  });
  resizeObserver.observe(salaryChartRef.value);
};

// 初始化渠道效率图表
const initChannelChart = () => {
  if (!channelChartRef.value || channelStats.value.length === 0) return;
  
  const chart = echarts.init(channelChartRef.value);
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '投递渠道',
        type: 'pie',
        radius: '50%',
        data: channelStats.value.map(item => ({
          value: item.totalCount,
          name: `${item.channel} (${item.successRate.toFixed(1)}%成功率)`
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  chart.setOption(option);
  
  const resizeObserver = new ResizeObserver(() => {
    chart.resize();
  });
  resizeObserver.observe(channelChartRef.value);
};

// 初始化状态分布图表
const initStatusChart = () => {
  if (!statusChartRef.value || statusStats.value.length === 0) return;
  
  const chart = echarts.init(statusChartRef.value);
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '面试状态',
        type: 'pie',
        radius: ['40%', '70%'],
        data: statusStats.value.map(item => ({
          value: item.count,
          name: item.status
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  chart.setOption(option);
  
  const resizeObserver = new ResizeObserver(() => {
    chart.resize();
  });
  resizeObserver.observe(statusChartRef.value);
};

// 添加虚拟Offer
const addVirtualOffer = () => {
  incomeAnalysis.value.virtualOffers.push({
    id: `virtual-${Date.now()}`,
    companyName: '',
    position: '',
    yearlyTotal: 0,
  });
};

// 删除虚拟Offer
const removeVirtualOffer = (index: number) => {
  incomeAnalysis.value.virtualOffers.splice(index, 1);
};

// 计算年度收入
const calculateIncome = () => {
  if (!incomeAnalysis.value.currentMonthlySalary || !incomeAnalysis.value.handoverDate) {
    return;
  }

  incomeAnalysisResults.value = analyticsStore.calculateYearlyIncomeAnalysis(
    incomeAnalysis.value.currentMonthlySalary,
    incomeAnalysis.value.handoverDate.toDate(),
    incomeAnalysis.value.selectedOffers,
    incomeAnalysis.value.virtualOffers
  );
};

// 监听筛选条件变化，重新绘制图表
watch([salaryFilters], () => {
  nextTick(() => {
    initSalaryChart();
  });
}, { deep: true });

// 加载数据并初始化图表
const loadData = async () => {
  try {
    await Promise.all([
      interviewStore.loadProcesses(),
      interviewStore.loadRounds(),
      companyStore.loadCompanies(),
    ]);
    
    await nextTick();
    initSalaryChart();
    initChannelChart();
    initStatusChart();
  } catch (error) {
    console.error('Failed to load analysis data:', error);
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.analysis {
  width: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  color: #262626;
  font-size: 20px;
  font-weight: 500;
}

.chart-card {
  margin-bottom: 16px;
}

.empty-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.virtual-offer {
  margin-bottom: 8px;
}

.salary-badge {
  margin-left: 8px;
  color: #52c41a;
  font-weight: 500;
}

.amount {
  font-weight: 500;
}

.increase {
  color: #52c41a;
  font-weight: 500;
}

.decrease {
  color: #ff4d4f;
  font-weight: 500;
}

:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
}
</style>
