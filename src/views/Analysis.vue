<template>
  <div class="analysis">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>{{ $t('pages.analysis.title') }}</h2>
      <a-breadcrumb>
        <a-breadcrumb-item>{{ $t('nav.home') }}</a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('pages.analysis.title') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <a-row :gutter="[16, 16]">
      <!-- 薪资对比分析 -->
      <a-card :title="$t('pages.analysis.salaryComparison')" class="chart-card">
        <div class="filter-bar">
          <a-space>
            <a-select
              v-model:value="salaryFilters.city"
              style="width: 120px"
              :placeholder="$t('pages.analysis.filterCity')"
            >
              <a-select-option value="">{{ $t('pages.analysis.allCities') }}</a-select-option>
              <a-select-option
                v-for="city in availableCities"
                :key="city"
                :value="city"
              >
                {{ city }}
              </a-select-option>
            </a-select>
            
            <a-select
              v-model:value="salaryFilters.position"
              style="width: 120px"
              :placeholder="$t('pages.analysis.filterPosition')"
            >
              <a-select-option value="">{{ $t('pages.analysis.allPositions') }}</a-select-option>
              <a-select-option
                v-for="position in availablePositions"
                :key="position"
                :value="position"
              >
                {{ position }}
              </a-select-option>
            </a-select>
          </a-space>
        </div>
        
        <div v-if="salaryChartData.length === 0" style="text-align: center; padding: 40px;">
          <a-empty :description="$t('pages.analysis.noOfferData')" />
        </div>
        <div v-else ref="salaryChartRef" style="height: 400px;"></div>
      </a-card>

      <!-- 渠道效率分析 -->
      <a-col :span="24">
        <a-card :title="$t('pages.analysis.channelEfficiency')" class="chart-card">
          <a-empty :description="$t('pages.analysis.noApplicationData')" />
        </a-card>
      </a-col>

      <!-- 状态分布 -->
      <a-col :span="24">
        <a-card :title="$t('pages.analysis.statusDistribution')" class="chart-card">
          <a-empty :description="$t('pages.analysis.noInterviewData')" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Offer 对比与年度收入规划器 -->
    <a-card :title="$t('pages.analysis.offerComparisonPlanning')" style="margin-top: 16px;">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('pages.analysis.currentMonthlySalary')">
            <a-input-number
              v-model:value="incomeAnalysis.currentSalary"
              :placeholder="$t('pages.analysis.currentSalaryPlaceholder')"
              style="width: 100%"
              :min="0"
            />
          </a-form-item>
        </a-col>
        
        <a-col :span="12">
          <a-form-item :label="$t('pages.analysis.expectedHandoverDate')">
            <a-date-picker
              v-model:value="incomeAnalysis.handoverDate"
              :placeholder="$t('pages.analysis.selectHandoverDate')"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-button type="primary" @click="calculateIncome" style="margin-bottom: 16px;">
        {{ $t('pages.analysis.calculateAnnualIncome') }}
      </a-button>

      <a-row :gutter="16">
        <!-- Offer 选择 -->
        <a-col :span="12">
          <h4>{{ $t('pages.analysis.selectOfferToCompare') }}</h4>
          <a-checkbox-group v-model:value="selectedOffers">
            <div v-for="offer in availableOffers" :key="offer.id" style="margin-bottom: 8px;">
              <a-checkbox :value="offer.id">
                {{ offer.company }} - {{ offer.position }}
              </a-checkbox>
            </div>
          </a-checkbox-group>
          
          <!-- 虚拟 Offer -->
          <div style="margin-top: 16px;">
            <a-button @click="addVirtualOffer" type="dashed" block>
              <PlusOutlined />
              {{ $t('pages.analysis.addVirtualComparison') }}
            </a-button>
            
            <div v-for="(virtual, index) in virtualOffers" :key="index" style="margin-top: 12px; padding: 12px; border: 1px dashed #d9d9d9; border-radius: 6px;">
              <a-row :gutter="8">
                <a-col :span="8">
                  <a-input
                    v-model:value="virtual.company"
                    :placeholder="$t('pages.analysis.companyNamePlaceholder')"
                    size="small"
                  />
                </a-col>
                <a-col :span="6">
                  <a-input
                    v-model:value="virtual.position"
                    :placeholder="$t('pages.analysis.positionPlaceholder')"
                    size="small"
                  />
                </a-col>
                <a-col :span="8">
                  <a-input-number
                    v-model:value="virtual.totalPackage"
                    :placeholder="$t('pages.analysis.annualPackagePlaceholder')"
                    size="small"
                    style="width: 100%"
                    :min="0"
                  />
                </a-col>
                <a-col :span="2">
                  <a-button size="small" type="text" danger @click="removeVirtualOffer(index)">
                    <DeleteOutlined />
                  </a-button>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-col>
        
        <!-- 年度收入分析结果 -->
        <a-col :span="12">
          <h4>{{ $t('pages.analysis.annualIncomeAnalysisResult') }}</h4>
          <a-table
            :columns="incomeColumns"
            :data-source="incomeAnalysisResults"
            :pagination="false"
            size="small"
          />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs, { Dayjs } from 'dayjs';
import * as echarts from 'echarts';
import {
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';

import { useInterviewStore } from '@/stores/interview';
import { useCompanyStore } from '@/stores/company';

const { t, locale } = useI18n();
const interviewStore = useInterviewStore();
const companyStore = useCompanyStore();

// 图表引用
const salaryChartRef = ref<HTMLElement>();
const channelChartRef = ref<HTMLElement>();
const statusChartRef = ref<HTMLElement>();

// 薪资筛选条件
const salaryFilters = reactive({
  city: '',
  position: '',
});

// 收入分析相关
const incomeAnalysis = reactive({
  currentSalary: 0,
  handoverDate: null as Dayjs | null,
});

const selectedOffers = ref<string[]>([]);
const virtualOffers = ref<Array<{
  company: string;
  position: string;
  totalPackage: number;
}>>([]);

// 计算属性
const offerProcesses = computed(() => {
  return interviewStore.processes.filter(p => p.status === 'offered' && p.offeredSalary);
});

const salaryChartData = computed(() => {
  let data = offerProcesses.value;
  
  if (salaryFilters.city) {
    data = data.filter(p => p.city === salaryFilters.city);
  }
  
  if (salaryFilters.position) {
    data = data.filter(p => p.position === salaryFilters.position);
  }
  
  return data.map(process => {
    const company = companyStore.getCompanyById(process.companyId);
    return {
      name: company?.name || 'Unknown',
      position: process.position,
      value: calculateAnnualSalary(process.offeredSalary),
      city: process.city,
    };
  });
});

const availableCities = computed(() => {
  const cities = new Set(offerProcesses.value.map(p => p.city).filter(Boolean));
  return Array.from(cities);
});

const availablePositions = computed(() => {
  const positions = new Set(offerProcesses.value.map(p => p.position).filter(Boolean));
  return Array.from(positions);
});

const availableOffers = computed(() => {
  return offerProcesses.value.map(process => {
    const company = companyStore.getCompanyById(process.companyId);
    return {
      id: process.id,
      company: company?.name || 'Unknown',
      position: process.position,
      salary: process.offeredSalary,
    };
  });
});

// 年度收入表格列
const incomeColumns = computed(() => [
  {
    title: t('pages.analysis.companyOption'),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: t('pages.analysis.annualPackage'),
    dataIndex: 'totalPackage',
    key: 'totalPackage',
  },
  {
    title: t('pages.analysis.estimatedAnnualIncome'),
    dataIndex: 'estimatedIncome',
    key: 'estimatedIncome',
  },
  {
    title: t('pages.analysis.monthlySalaryChange'),
    dataIndex: 'monthlyChange',
    key: 'monthlyChange',
  },
  {
    title: t('pages.analysis.increaseRatio'),
    dataIndex: 'increaseRatio',
    key: 'increaseRatio',
  },
]);

// 工具函数
const formatSalary = (amount: number) => {
  return (amount / 1000).toFixed(0) + 'k';
};

const calculateAnnualSalary = (salary: any) => {
  if (!salary) return 0;
  
  // 新格式薪资
  if (typeof salary === 'object' && salary.base) {
    return salary.base * 12 + salary.base * (salary.yearEndMonths || 0);
  }
  
  // 旧格式薪资兼容
  return salary;
};

// 初始化薪资对比图表
const initSalaryChart = () => {
  if (!salaryChartRef.value || salaryChartData.value.length === 0) return;
  
  const chart = echarts.init(salaryChartRef.value);
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = params.data;
        return `${data.name}<br/>${t('pages.analysis.annualPackage')}: ¥${formatSalary(data.value)}`;
      },
    },
    xAxis: {
      type: 'category',
      data: salaryChartData.value.map(item => item.name),
      axisLabel: {
        rotate: 45,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: t('pages.analysis.annualSalary'),
      axisLabel: {
        formatter: '¥{value}k',
      },
    },
    series: [
      {
        name: t('pages.analysis.annualPackage'),
        type: 'bar',
        data: salaryChartData.value.map(item => ({
          name: item.name,
          value: Math.round(item.value / 1000),
          // 使用典型值作为图表显示
        })),
        itemStyle: {
          // 兼容旧格式
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        }
      }
    ],
    grid: {
      left: '60px',
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

// 初始化渠道效率图表
const initChannelChart = () => {
  if (!channelChartRef.value) return;
  
  const chart = echarts.init(channelChartRef.value);
  
  // 基于实际数据计算渠道效率
  const channelMap = new Map();
  interviewStore.processes.forEach(process => {
    const channel = process.sourceChannel;
    const stats = channelMap.get(channel) || { total: 0, success: 0 };
    stats.total++;
    
    if (process.status === 'offered' || process.conclusion === 'passed') {
      stats.success++;
    }
    
    channelMap.set(channel, stats);
  });
  
  const channelData = Array.from(channelMap.entries()).map(([channel, stats]) => ({
    channel,
    applications: stats.total,
    success: stats.success,
    successRate: stats.total > 0 ? (stats.success / stats.total) * 100 : 0
  }));
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = channelData[params[0].dataIndex];
        return `${data.channel}<br/>总投递: ${data.applications}<br/>成功: ${data.success}<br/>成功率: ${data.successRate.toFixed(1)}%`;
      }
    },
    legend: {
      data: [t('pages.analysis.channelName'), t('pages.analysis.successRate')]
    },
    xAxis: {
      type: 'category',
      data: channelData.map(item => item.channel)
    },
    yAxis: [
      {
        type: 'value',
        name: '投递数量'
      },
      {
        type: 'value',
        name: '成功率(%)',
        max: 100
      }
    ],
    series: [
      {
        name: t('pages.analysis.channelName'),
        type: 'bar',
        data: channelData.map(item => item.applications)
      },
      {
        name: t('pages.analysis.successRate'),
        type: 'line',
        yAxisIndex: 1,
        data: channelData.map(item => item.successRate.toFixed(1))
      }
    ]
  };
  
  chart.setOption(option);
};

// 初始化状态分布图表
const initStatusChart = () => {
  if (!statusChartRef.value) return;
  
  const chart = echarts.init(statusChartRef.value);
  
  // 统计实际状态分布
  const statusMap = new Map();
  interviewStore.processes.forEach(process => {
    const count = statusMap.get(process.status) || 0;
    statusMap.set(process.status, count + 1);
  });
  
  const statusData = Array.from(statusMap.entries()).map(([status, count]) => ({
    value: count,
    name: t(`status.${status}`)
  }));
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: t('pages.analysis.interviewStatus'),
        type: 'pie',
        radius: '50%',
        data: statusData,
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
};

const incomeAnalysisResults = ref<any[]>([]);

// 添加虚拟Offer
const addVirtualOffer = () => {
  virtualOffers.value.push({
    company: '',
    position: '',
    totalPackage: 0,
  });
};

// 删除虚拟Offer
const removeVirtualOffer = (index: number) => {
  virtualOffers.value.splice(index, 1);
};

// 计算年度收入
const calculateIncome = () => {
  // 实现年度收入计算逻辑
  console.log('Calculate income', {
    currentSalary: incomeAnalysis.currentSalary,
    handoverDate: incomeAnalysis.handoverDate,
    selectedOffers: selectedOffers.value,
    virtualOffers: virtualOffers.value,
  });
};

// 监听筛选条件变化，重新绘制图表
watch([salaryFilters], () => {
  nextTick(() => {
    initSalaryChart();
  });
}, { deep: true });

// 监听语言变化，重新初始化所有图表
watch(locale, () => {
  nextTick(() => {
    initSalaryChart();
    initChannelChart();
    initStatusChart();
  });
});

// 加载数据并初始化图表
onMounted(async () => {
  try {
    await Promise.all([
      interviewStore.loadProcesses(),
      companyStore.loadCompanies(),
    ]);
    
    await nextTick();
    initSalaryChart();
    initChannelChart();
    initStatusChart();
  } catch (error) {
    console.error('Failed to load analysis data:', error);
  }
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
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.chart-card {
  margin-bottom: 16px;
  width: 100%;
}

.filter-bar {
  /* margin-bottom: 16px; */
}

:deep(.ant-descriptions-item-label) {
  font-weight: 500;
  color: #666;
}

:deep(.ant-card-head-title) {
  font-weight: 600;
}
</style>
