<template>
  <div class="company-detail">
    <div class="detail-header">
      <div class="company-basic">
        <h3>{{ company.name }}</h3>
        <el-tag size="large">{{ company.type }}</el-tag>
      </div>
      <div class="company-rating" v-if="company.rating">
        <el-rate
          :model-value="company.rating"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value} 分"
        />
      </div>
    </div>

    <el-row :gutter="24">
      <el-col :span="16">
        <el-card class="main-info">
          <template #header>
            <span>公司信息</span>
          </template>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="公司名称">
              {{ company.name }}
            </el-descriptions-item>
            <el-descriptions-item label="公司类型">
              {{ company.type }}
            </el-descriptions-item>
            <el-descriptions-item label="所属行业" v-if="company.industry">
              {{ company.industry }}
            </el-descriptions-item>
            <el-descriptions-item label="公司规模" v-if="company.size">
              {{ company.size }}
            </el-descriptions-item>
            <el-descriptions-item label="公司地址" v-if="company.location">
              {{ company.location }}
            </el-descriptions-item>
            <el-descriptions-item label="官方网站" v-if="company.website">
              <a :href="company.website" target="_blank" class="website-link">
                {{ company.website }}
              </a>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间" v-if="company.createdAt">
              {{ formatDateTime(company.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="最后更新" v-if="company.updatedAt">
              {{ formatDateTime(company.updatedAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="description-card" v-if="company.description">
          <template #header>
            <span>公司介绍</span>
          </template>
          <div class="description-content">
            {{ company.description }}
          </div>
        </el-card>

        <el-card class="notes-card" v-if="company.notes">
          <template #header>
            <span>备注信息</span>
          </template>
          <div class="notes-content">
            {{ company.notes }}
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="stats-card">
          <template #header>
            <span>投递统计</span>
          </template>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ totalInterviews }}</div>
              <div class="stat-label">面试总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ totalProcesses }}</div>
              <div class="stat-label">投递流程</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ offersReceived }}</div>
              <div class="stat-label">收到Offer</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ successRate }}%</div>
              <div class="stat-label">成功率</div>
            </div>
          </div>
        </el-card>

        <el-card class="interview-list-card">
          <template #header>
            <span>相关面试</span>
          </template>
          
          <div v-if="relatedInterviews.length > 0" class="interview-list">
            <div
              v-for="interview in relatedInterviews"
              :key="interview.id"
              class="interview-item"
            >
              <div class="interview-header">
                <span class="position">{{ interview.position }}</span>
                <el-tag size="small" :type="getStatusTagType(interview.status)">
                  {{ formatStatus(interview.status) }}
                </el-tag>
              </div>
              <div class="interview-meta">
                <span class="industry">{{ interview.conclusion }}</span>
                <span class="channel">{{ interview.sourceChannel }}</span>
                <span class="time">
                  {{ formatDate(interview.createdAt) }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-else class="no-interviews">
            <ph-calendar-x :size="48" />
            <p>暂无相关面试记录</p>
          </div>
        </el-card>

        <el-card class="process-list-card">
          <template #header>
            <span>投递流程</span>
          </template>
          
          <div v-if="relatedProcesses.length > 0" class="process-list">
            <div
              v-for="process in relatedProcesses"
              :key="process.id"
              class="process-item"
            >
              <div class="process-header">
                <span class="position">{{ process.position }}</span>
                <el-tag size="small" :type="getProcessStatusTagType(process.status)">
                  {{ formatProcessStatus(process.status) }}
                </el-tag>
              </div>
              <div class="process-meta">
                <span class="applied-date">
                  投递时间: {{ formatDate(process.createdAt) }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-else class="no-processes">
            <ph-paper-plane-tilt :size="48" />
            <p>暂无投递流程记录</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="detail-actions">
      <el-button @click="$emit('close')">关闭</el-button>
      <el-button type="primary" @click="$emit('edit')">编辑</el-button>
      <el-button type="success" @click="addInterview">添加面试</el-button>
      <el-button type="warning" @click="addProcess">添加投递</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PhCalendarX, PhPaperPlaneTilt } from '@phosphor-icons/vue'
import dayjs from 'dayjs'
import { useInterviewStore } from '@/stores/interview'
import type { Company } from '@/types'

interface Props {
  company: Company
}

const props = defineProps<Props>()

const interviewStore = useInterviewStore()

// 计算属性
const relatedInterviews = computed(() => {
  return interviewStore.interviews
    .filter((interview: any) => interview.companyId === props.company.id)
    .sort((a: any, b: any) => {
      const dateA = a.scheduledTime ? new Date(a.scheduledTime).getTime() : 0
      const dateB = b.scheduledTime ? new Date(b.scheduledTime).getTime() : 0
      return dateB - dateA
    })
})

const relatedProcesses = computed(() => {
  return interviewStore.interviews
    .filter((process: any) => process.companyId === props.company.id)
    .sort((a: any, b: any) => {
      const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0
      const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0
      return dateB - dateA
    })
})

const totalInterviews = computed(() => relatedInterviews.value.length)
const totalProcesses = computed(() => relatedProcesses.value.length)
const offersReceived = computed(() => 
  relatedProcesses.value.filter((p: any) => p.status === '已发Offer').length
)
const successRate = computed(() => {
  if (relatedInterviews.value.length === 0) return 0
  const passed = relatedInterviews.value.filter((i: any) => 
    i.conclusion === '通过'
  ).length
  return Math.round((passed / relatedInterviews.value.length) * 100)
})

// 方法
const formatDateTime = (dateTime: Date | string) => {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm')
}

const formatDate = (dateTime: Date | string) => {
  return dayjs(dateTime).format('YYYY-MM-DD')
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'scheduled': '已安排',
    'completed': '已完成',
    'cancelled': '已取消',
    'pending': '待确认'
  }
  return statusMap[status] || status
}

const formatProcessStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'applied': '已投递',
    'screening': '简历筛选',
    'interviewing': '面试中',
    'offer_received': '收到Offer',
    'offer_accepted': '接受Offer',
    'offer_declined': '拒绝Offer',
    'rejected': '被拒绝'
  }
  return statusMap[status] || status
}

const getStatusTagType = (status: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const typeMap: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    'scheduled': 'primary',
    'completed': 'success',
    'cancelled': 'danger',
    'pending': 'warning'
  }
  return typeMap[status] || 'info'
}

const getProcessStatusTagType = (status: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const typeMap: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    'applied': 'info',
    'screening': 'primary',
    'interviewing': 'warning',
    'offer_received': 'success',
    'offer_accepted': 'success',
    'offer_declined': 'info',
    'rejected': 'danger'
  }
  return typeMap[status] || 'info'
}

const addInterview = () => {
  // TODO: 跳转到新增面试页面，并预设公司信息
  console.log('添加面试:', props.company)
}

const addProcess = () => {
  // TODO: 跳转到新增投递页面，并预设公司信息
  console.log('添加投递:', props.company)
}
</script>

<style scoped lang="scss">
.company-detail {
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color-lighter);
    
    .company-basic {
      h3 {
        margin: 0 0 8px 0;
        color: var(--text-primary);
      }
    }
    
    .company-rating {
      .el-rate {
        --el-rate-height: 20px;
        --el-rate-font-size: 16px;
      }
    }
  }
  
  .main-info {
    margin-bottom: 16px;
  }
  
  .description-card,
  .notes-card {
    margin-bottom: 16px;
    
    .description-content,
    .notes-content {
      line-height: 1.6;
      color: var(--text-regular);
      white-space: pre-wrap;
    }
  }
  
  .website-link {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  .stats-card {
    margin-bottom: 16px;
    
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      
      .stat-item {
        text-align: center;
        padding: 12px;
        border: 1px solid var(--border-color-lighter);
        border-radius: 6px;
        
        .stat-number {
          font-size: 20px;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
        }
      }
    }
  }
  
  .interview-list-card,
  .process-list-card {
    margin-bottom: 16px;
    
    .interview-list,
    .process-list {
      max-height: 200px;
      overflow-y: auto;
      
      .interview-item,
      .process-item {
        padding: 12px;
        border-bottom: 1px solid var(--border-color-lighter);
        
        &:last-child {
          border-bottom: none;
        }
        
        .interview-header,
        .process-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          
          .position {
            font-weight: 600;
            color: var(--text-primary);
          }
        }
        
        .interview-meta,
        .process-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: var(--text-secondary);
          
          span {
            &:not(:last-child)::after {
              content: '•';
              margin-left: 12px;
              color: var(--text-placeholder);
            }
          }
        }
      }
    }
    
    .no-interviews,
    .no-processes {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-placeholder);
      
      svg {
        margin-bottom: 12px;
        opacity: 0.5;
      }
      
      p {
        margin: 0;
        font-size: 14px;
      }
    }
  }
  
  .detail-actions {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color-lighter);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .company-detail {
    .detail-header {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    
    .el-row {
      .el-col {
        margin-bottom: 16px;
      }
    }
    
    .stats-grid {
      grid-template-columns: 1fr !important;
    }
    
    .detail-actions {
      flex-direction: column;
      
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
