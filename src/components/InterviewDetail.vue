<template>
  <div class="interview-detail">
    <div class="detail-header">
      <h3>{{ interview.company?.name || '未知公司' }} - {{ interview.position }}</h3>
      <el-tag :type="getStatusTagType(interview.status)" size="large">
        {{ formatStatus(interview.status) }}
      </el-tag>
    </div>

    <el-row :gutter="24">
      <el-col :span="16">
        <el-card class="main-info">
          <template #header>
            <span>基本信息</span>
          </template>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="公司名称">
              {{ interview.company?.name || '未知公司' }}
            </el-descriptions-item>
            <el-descriptions-item label="职位">
              {{ interview.position }}
            </el-descriptions-item>
            <el-descriptions-item label="面试时间">
              {{ interview.scheduledTime ? formatDateTime(interview.scheduledTime) : '未安排' }}
            </el-descriptions-item>
            <el-descriptions-item label="面试轮次">
              第{{ interview.round }}轮
            </el-descriptions-item>
            <el-descriptions-item label="面试方式">
              {{ interview.type }}
            </el-descriptions-item>
            <el-descriptions-item label="面试官">
              {{ interview.interviewer || '未知' }}
            </el-descriptions-item>
            <el-descriptions-item label="期望薪资" v-if="interview.expectedSalary">
              {{ interview.expectedSalary }}
            </el-descriptions-item>
            <el-descriptions-item label="面试结果" v-if="interview.result">
              <el-tag :type="getResultTagType(interview.result)">
                {{ formatResult(interview.result) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="notes-card" v-if="interview.notes">
          <template #header>
            <span>面试备注</span>
          </template>
          <div class="notes-content">
            {{ interview.notes }}
          </div>
        </el-card>

        <el-card class="feedback-card" v-if="interview.feedback">
          <template #header>
            <span>面试反馈</span>
          </template>
          <div class="feedback-content">
            {{ interview.feedback }}
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="company-info">
          <template #header>
            <span>公司信息</span>
          </template>
          
          <div v-if="interview.company" class="company-details">
            <div class="company-header">
              <h4>{{ interview.company.name }}</h4>
              <el-tag size="small">{{ interview.company.type }}</el-tag>
            </div>
            
            <div class="company-meta">
              <div class="meta-item" v-if="interview.company.industry">
                <span class="label">行业:</span>
                <span class="value">{{ interview.company.industry }}</span>
              </div>
              <div class="meta-item" v-if="interview.company.size">
                <span class="label">规模:</span>
                <span class="value">{{ interview.company.size }}</span>
              </div>
              <div class="meta-item" v-if="interview.company.location">
                <span class="label">地点:</span>
                <span class="value">{{ interview.company.location }}</span>
              </div>
              <div class="meta-item" v-if="interview.company.website">
                <span class="label">官网:</span>
                <a :href="interview.company.website" target="_blank" class="value link">
                  {{ interview.company.website }}
                </a>
              </div>
            </div>
            
            <div class="company-description" v-if="interview.company.description">
              <h5>公司介绍</h5>
              <p>{{ interview.company.description }}</p>
            </div>
          </div>
          
          <div v-else class="no-company">
            暂无公司信息
          </div>
        </el-card>

        <el-card class="timeline-card">
          <template #header>
            <span>面试进度</span>
          </template>
          
          <el-timeline>
            <el-timeline-item
              v-for="(event, index) in timelineEvents"
              :key="index"
              :timestamp="event.timestamp"
              :type="event.type"
              placement="top"
            >
              <h4>{{ event.title }}</h4>
              <p>{{ event.content }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <div class="detail-actions">
      <el-button @click="$emit('close')">关闭</el-button>
      <el-button type="primary" @click="$emit('edit')">编辑</el-button>
      <el-button
        v-if="interview.status === 'scheduled'"
        type="success"
        @click="markCompleted"
      >
        标记完成
      </el-button>
      <el-button
        v-if="interview.status === 'scheduled'"
        type="warning"
        @click="cancelInterview"
      >
        取消面试
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import type { InterviewRound } from '@/types'

interface Props {
  interview: InterviewRound
}

const props = defineProps<Props>()

// TODO: 后续用于实现store方法
// const interviewStore = useInterviewStore()

// 计算属性
const timelineEvents = computed<Array<{
  timestamp: string
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  title: string
  content: string
}>>(() => {
  const events = []
  
  if (props.interview.createdAt) {
    events.push({
      timestamp: formatDateTime(props.interview.createdAt),
      type: 'primary' as const,
      title: '面试创建',
      content: '面试安排已创建'
    })
  }
  
  if (props.interview.scheduledTime) {
    events.push({
      timestamp: formatDateTime(props.interview.scheduledTime),
      type: props.interview.status === 'scheduled' ? 'primary' as const : 'success' as const,
      title: '面试安排',
      content: `安排了第${props.interview.round}轮面试`
    })
  }
  
  if (props.interview.status === 'completed') {
    events.push({
      timestamp: formatDateTime(props.interview.updatedAt || props.interview.createdAt),
      type: 'success' as const,
      title: '面试完成',
      content: props.interview.result ? `面试结果: ${formatResult(props.interview.result)}` : '面试已完成'
    })
  }
  
  if (props.interview.status === 'cancelled') {
    events.push({
      timestamp: formatDateTime(props.interview.updatedAt || props.interview.createdAt),
      type: 'danger' as const,
      title: '面试取消',
      content: '面试已取消'
    })
  }
  
  return events.reverse()
})

// 方法
const formatDateTime = (dateTime: Date | string) => {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm')
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

const formatResult = (result: string) => {
  const resultMap: Record<string, string> = {
    'passed': '通过',
    'failed': '未通过',
    'pending': '待定'
  }
  return resultMap[result] || result
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

const getResultTagType = (result: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const typeMap: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    'passed': 'success',
    'failed': 'danger',
    'pending': 'warning'
  }
  return typeMap[result] || 'info'
}

const markCompleted = async () => {
  try {
    // TODO: 实现updateRound方法
    // await interviewStore.updateRound(props.interview.id, {
    //   status: 'completed',
    //   updatedAt: new Date().toISOString()
    // })
    ElMessage.success('已标记为完成')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const cancelInterview = async () => {
  try {
    // TODO: 实现updateRound方法
    // await interviewStore.updateRound(props.interview.id, {
    //   status: 'cancelled',
    //   updatedAt: new Date().toISOString()
    // })
    ElMessage.success('面试已取消')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped lang="scss">
.interview-detail {
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color-lighter);
    
    h3 {
      margin: 0;
      color: var(--text-primary);
    }
  }
  
  .main-info {
    margin-bottom: 16px;
  }
  
  .notes-card,
  .feedback-card {
    margin-bottom: 16px;
    
    .notes-content,
    .feedback-content {
      line-height: 1.6;
      color: var(--text-regular);
      white-space: pre-wrap;
    }
  }
  
  .company-info {
    margin-bottom: 16px;
    
    .company-details {
      .company-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        
        h4 {
          margin: 0;
          color: var(--text-primary);
        }
      }
      
      .company-meta {
        margin-bottom: 16px;
        
        .meta-item {
          display: flex;
          margin-bottom: 8px;
          
          .label {
            font-weight: 600;
            color: var(--text-secondary);
            width: 60px;
            flex-shrink: 0;
          }
          
          .value {
            color: var(--text-regular);
            
            &.link {
              color: var(--primary-color);
              text-decoration: none;
              
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
      
      .company-description {
        h5 {
          margin: 0 0 8px 0;
          color: var(--text-primary);
          font-size: 14px;
        }
        
        p {
          margin: 0;
          color: var(--text-regular);
          line-height: 1.6;
          font-size: 14px;
        }
      }
    }
    
    .no-company {
      text-align: center;
      color: var(--text-placeholder);
      padding: 20px;
    }
  }
  
  .timeline-card {
    .el-timeline {
      padding-left: 0;
    }
    
    .el-timeline-item__content {
      h4 {
        margin: 0 0 4px 0;
        font-size: 14px;
        color: var(--text-primary);
      }
      
      p {
        margin: 0;
        font-size: 12px;
        color: var(--text-secondary);
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
  .interview-detail {
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
    
    .detail-actions {
      flex-direction: column;
      
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
