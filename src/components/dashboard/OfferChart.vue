<template>
  <div class="offer-chart">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>
    
    <div v-else-if="hasOffers" class="chart-wrapper">
      <v-chart
        :option="chartOption"
        :style="{ height: `${height}px` }"
        autoresize
      />
    </div>
    
    <div v-else class="empty-state">
      <el-empty
        description="暂无 Offer 数据"
        :image-size="100"
      >
        <template #image>
          <el-icon :size="50" color="#E4E7ED">
            <TrendCharts />
          </el-icon>
        </template>
        <el-button type="primary" @click="goToInterviews">
          查看面试进展
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { TrendCharts } from '@element-plus/icons-vue'
import { useInterviewStore } from '@/stores/interview'
import { useCompanyStore } from '@/stores/company'
import { formatCurrency } from '@/utils'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

interface Props {
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300
})

// 计算属性
const height = computed(() => props.height)

const router = useRouter()
const interviewStore = useInterviewStore()
const companyStore = useCompanyStore()

const loading = ref(false)

// 计算属性
const offerData = computed(() => {
  const offers = interviewStore.getReceivedOffers
    .filter(interview => interview.offeredSalary)
    .slice(0, 5) // 最多显示5个Offer
  
  return offers.map(interview => {
    const company = companyStore.getCompanyById(interview.companyId)
    const salary = interview.offeredSalary!
    
    return {
      name: company?.name || '未知公司',
      position: interview.position,
      data: [
        salary.base, // 月薪
        salary.base * 12, // 基础年薪
        salary.total * 0.8, // 最低年度总包 (假设为总包的80%)
        salary.total, // 标准年度总包
        salary.total + (salary.bonus || 0) // 最高年度总包
      ]
    }
  })
})

const hasOffers = computed(() => offerData.value.length > 0)

const chartOption = computed(() => {
  if (!hasOffers.value) return {}
  
  const maxValues = [
    Math.max(...offerData.value.map(item => item.data[0])) * 1.2, // 月薪最大值
    Math.max(...offerData.value.map(item => item.data[1])) * 1.2, // 基础年薪最大值
    Math.max(...offerData.value.map(item => item.data[2])) * 1.2, // 最低总包最大值
    Math.max(...offerData.value.map(item => item.data[3])) * 1.2, // 标准总包最大值
    Math.max(...offerData.value.map(item => item.data[4])) * 1.2  // 最高总包最大值
  ]
  
  const colors = ['#F28A31', '#6975A7', '#67C23A', '#E6A23C', '#F56C6C']
  
  return {
    title: {
      text: 'Offer 薪资对比',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F1F1F'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = params.data
        return `
          <div style="font-weight: 600; margin-bottom: 8px;">${params.name}</div>
          <div>月薪: ${formatCurrency(data.value[0])}</div>
          <div>基础年薪: ${formatCurrency(data.value[1])}</div>
          <div>最低年度总包: ${formatCurrency(data.value[2])}</div>
          <div>标准年度总包: ${formatCurrency(data.value[3])}</div>
          <div>最高年度总包: ${formatCurrency(data.value[4])}</div>
        `
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      data: offerData.value.map(item => item.name)
    },
    radar: {
      indicator: [
        { name: '月薪', max: maxValues[0] },
        { name: '基础年薪', max: maxValues[1] },
        { name: '最低年度总包', max: maxValues[2] },
        { name: '标准年度总包', max: maxValues[3] },
        { name: '最高年度总包', max: maxValues[4] }
      ],
      center: ['50%', '45%'],
      radius: '65%',
      nameGap: 8,
      name: {
        textStyle: {
          fontSize: 12,
          color: '#666460'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#E4E7ED'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#E4E7ED'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(242, 138, 49, 0.02)', 'rgba(242, 138, 49, 0.05)']
        }
      }
    },
    series: [
      {
        type: 'radar',
        data: offerData.value.map((item, index) => ({
          value: item.data,
          name: item.name,
          itemStyle: {
            color: colors[index % colors.length]
          },
          areaStyle: {
            opacity: 0.15
          },
          lineStyle: {
            width: 2
          }
        }))
      }
    ]
  }
})

// 方法
const goToInterviews = () => {
  router.push('/interviews')
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      interviewStore.loadInterviews(),
      companyStore.loadCompanies()
    ])
  } catch (error) {
    console.error('加载 Offer 数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.offer-chart {
  width: 100%;
  
  .loading-container {
    padding: $spacing-lg;
  }
  
  .chart-wrapper {
    width: 100%;
    height: 100%;
  }
  
  .empty-state {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl;
  }
}

// 图表样式优化
:deep(.echarts) {
  font-family: $font-family-body;
}
</style>
