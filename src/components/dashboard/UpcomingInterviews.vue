<template>
  <div class="upcoming-interviews">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>
    
    <div v-else-if="upcomingRounds.length === 0" class="empty-state">
      <el-empty
        :description="$t('upcomingInterviews.emptyState.description')"
        :image-size="120"
      >
        <template #image>
          <el-icon :size="60" color="#E4E7ED">
            <Calendar />
          </el-icon>
        </template>
        <el-button type="primary" @click="createInterview">
          {{ $t('upcomingInterviews.emptyState.createButton') }}
        </el-button>
      </el-empty>
    </div>
    
    <div v-else class="timeline">
      <div
        v-for="group in groupedRounds"
        :key="group.date"
        class="timeline-group"
      >
        <div class="date-header">
          <div class="date-label">{{ group.dateLabel }}</div>
          <div class="date-info">{{ formatDate(group.date) }}</div>
        </div>
        
        <div class="interviews-list">
          <div
            v-for="round in group.rounds"
            :key="round.id"
            class="interview-item"
            @click="goToDetail(round.processId)"
          >
            <div class="interview-time">
              {{ formatTime(round.scheduledTime) }}
            </div>
            
            <div class="interview-content">
              <div class="interview-info">
                <h4 class="company-position">
                  {{ getCompanyName(round.processId) }} - {{ getPosition(round.processId) }}
                </h4>
                <div class="round-name">{{ round.roundName }}</div>
              </div>
              
              <div class="interview-meta">
                <el-tag
                  :type="getStatusType(round.status)"
                  size="small"
                >
                  {{ getStatusText(round.status) }}
                </el-tag>
                
                <div v-if="round.interviewer" class="interviewer">
                  <el-icon :size="14"><User /></el-icon>
                  {{ round.interviewer }}
                </div>
              </div>
            </div>
            
            <div class="interview-actions">
              <el-tooltip :content="$t('upcomingInterviews.tooltips.viewDetail')" placement="top">
                <el-button
                  :icon="View"
                  circle
                  size="small"
                  @click.stop="goToDetail(round.processId)"
                />
              </el-tooltip>
              
              <el-tooltip :content="$t('upcomingInterviews.tooltips.editRound')" placement="top">
                <el-button
                  :icon="Edit"
                  circle
                  size="small"
                  @click.stop="editRound(round)"
                />
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 查看更多链接 -->
    <div v-if="!loading && upcomingRounds.length > 0" class="view-more">
      <el-button type="text" @click="goToCalendar">
        {{ $t('upcomingInterviews.viewMore') }}
        <el-icon class="ml-xs"><ArrowRight /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import {
  Calendar,
  User,
  View,
  Edit,
  ArrowRight
} from '@element-plus/icons-vue'
import { useRoundStore } from '@/stores/round'
import { useInterviewStore } from '@/stores/interview'
import { useCompanyStore } from '@/stores/company'
import { formatDate, getRelativeTime } from '@/utils'
import type { InterviewRound } from '@/types'

interface Props {
  maxItems?: number
  days?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxItems: 5,
  days: 7
})

const router = useRouter()
const { t } = useI18n()
const roundStore = useRoundStore()
const interviewStore = useInterviewStore()
const companyStore = useCompanyStore()

const loading = ref(false)

// 计算属性
const upcomingRounds = computed(() => {
  const rounds = roundStore.getUpcomingRounds(props.days)
  return rounds.slice(0, props.maxItems)
})

const groupedRounds = computed(() => {
  const groups = new Map<string, InterviewRound[]>()
  
  upcomingRounds.value.forEach(round => {
    const dateKey = formatDate(round.scheduledTime)
    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey)!.push(round)
  })
  
  return Array.from(groups.entries()).map(([date, rounds]) => ({
    date,
    dateLabel: getDateLabel(date),
    rounds: rounds.sort((a, b) => 
      new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
    )
  }))
})

// 方法
const getDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr)
  return getRelativeTime(date)
}

const formatTime = (dateTime: Date | string): string => {
  const date = new Date(dateTime)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const getCompanyName = (processId: string): string => {
  const interview = interviewStore.getInterviewById(processId)
  if (!interview) return t('upcomingInterviews.unknownCompany')
  
  const company = companyStore.getCompanyById(interview.companyId)
  return company?.name || t('upcomingInterviews.unknownCompany')
}

const getPosition = (processId: string): string => {
  const interview = interviewStore.getInterviewById(processId)
  return interview?.position || t('upcomingInterviews.unknownPosition')
}

const getStatusType = (status: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  switch (status) {
    case 'scheduled':
      return 'primary'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'danger'
    default:
      return 'warning'
  }
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'scheduled':
      return t('upcomingInterviews.statusMap.scheduled')
    case 'completed':
      return t('upcomingInterviews.statusMap.completed')
    case 'cancelled':
      return t('upcomingInterviews.statusMap.cancelled')
    default:
      return status
  }
}

const goToDetail = (processId: string) => {
  router.push(`/interviews/${processId}`)
}

const goToCalendar = () => {
  router.push('/calendar')
}

const createInterview = () => {
  router.push('/interviews/new')
}

const editRound = (_round: InterviewRound) => {
  ElMessage.info(t('upcomingInterviews.messages.editRoundInProgress'))
  // TODO: 实现编辑轮次功能
}

onMounted(async () => {
  loading.value = true
  try {
    // 确保数据已加载
    await Promise.all([
      roundStore.loadRounds(),
      interviewStore.loadInterviews(),
      companyStore.loadCompanies()
    ])
  } catch (error) {
    console.error(t('upcomingInterviews.comments.ensureDataLoaded') + ':', error)
    ElMessage.error(t('upcomingInterviews.messages.loadDataFailed'))
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.upcoming-interviews {
  .loading-container {
    padding: $spacing-lg;
  }
  
  .empty-state {
    padding: $spacing-xl;
    text-align: center;
  }
  
  .timeline {
    .timeline-group {
      &:not(:last-child) {
        margin-bottom: $spacing-lg;
      }
      
      .date-header {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin-bottom: $spacing-md;
        padding-bottom: $spacing-sm;
        border-bottom: 1px solid $border-light;
        
        .date-label {
          font-size: $font-size-lg;
          font-weight: $font-weight-semibold;
          color: $primary-orange;
        }
        
        .date-info {
          font-size: $font-size-sm;
          color: $color-text-secondary;
        }
      }
      
      .interviews-list {
        .interview-item {
          display: flex;
          align-items: center;
          gap: $spacing-md;
          padding: $spacing-md;
          border-radius: $border-radius-md;
          border: 1px solid $border-light;
          background: $color-white;
          cursor: pointer;
          transition: all $transition-base;
          
          &:not(:last-child) {
            margin-bottom: $spacing-sm;
          }
          
          &:hover {
            border-color: lighten($primary-orange, 20%);
            box-shadow: $shadow-light;
            transform: translateY(-1px);
          }
          
          .interview-time {
            font-size: $font-size-lg;
            font-weight: $font-weight-semibold;
            color: $accent-blue;
            min-width: 60px;
            text-align: center;
          }
          
          .interview-content {
            flex: 1;
            
            .interview-info {
              margin-bottom: $spacing-xs;
              
              .company-position {
                font-size: $font-size-base;
                font-weight: $font-weight-medium;
                color: $color-text-primary;
                margin: 0 0 $spacing-xs 0;
                line-height: 1.4;
              }
              
              .round-name {
                font-size: $font-size-sm;
                color: $color-text-secondary;
              }
            }
            
            .interview-meta {
              display: flex;
              align-items: center;
              gap: $spacing-sm;
              
              .interviewer {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: $font-size-xs;
                color: $color-text-secondary;
              }
            }
          }
          
          .interview-actions {
            display: flex;
            gap: $spacing-xs;
            opacity: 0;
            transition: opacity $transition-fast;
          }
          
          &:hover .interview-actions {
            opacity: 1;
          }
        }
      }
    }
  }
  
  .view-more {
    text-align: center;
    margin-top: $spacing-lg;
    padding-top: $spacing-md;
    border-top: 1px solid $border-light;
  }
}

// 响应式适配
@media (max-width: $breakpoint-md) {
  .upcoming-interviews {
    .timeline .timeline-group .interviews-list .interview-item {
      flex-direction: column;
      align-items: flex-start;
      
      .interview-time {
        min-width: auto;
        text-align: left;
      }
      
      .interview-content {
        width: 100%;
      }
      
      .interview-actions {
        align-self: flex-end;
        opacity: 1;
      }
    }
  }
}
</style>
