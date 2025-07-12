<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <h2 class="page-title">面试日历</h2>
      <div class="calendar-controls">
        <el-button-group class="view-controls">
          <el-button
            :type="viewMode === 'month' ? 'primary' : 'default'"
            @click="viewMode = 'month'"
          >
            月视图
          </el-button>
          <el-button
            :type="viewMode === 'week' ? 'primary' : 'default'"
            @click="viewMode = 'week'"
          >
            周视图
          </el-button>
        </el-button-group>
        <el-button type="primary" @click="showAddDialog = true">
          <ph-plus :size="16" />
          新增面试
        </el-button>
      </div>
    </div>

    <div class="calendar-navigation">
      <el-button @click="previousPeriod" :icon="ArrowLeft" circle />
      <h3 class="current-period">{{ currentPeriodText }}</h3>
      <el-button @click="nextPeriod" :icon="ArrowRight" circle />
      <el-button @click="goToToday" type="primary" plain>今天</el-button>
    </div>

    <div class="calendar-grid" :class="`calendar-${viewMode}`">
      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday-header">
          {{ day }}
        </div>
      </div>

      <div class="calendar-body">
        <div
          v-for="date in displayDates"
          :key="date.toISOString()"
          class="calendar-cell"
          :class="{
            'is-other-month': !isSameMonth(date, currentDate),
            'is-today': isToday(date),
            'is-selected': isSelected(date)
          }"
          @click="selectDate(date)"
        >
          <div class="date-number">{{ date.getDate() }}</div>
          <div class="date-events">
            <div
              v-for="interview in getInterviewsForDate(date)"
              :key="interview.id"
              class="interview-event"
              :class="`interview-${interview.status}`"
              @click.stop="viewInterview(interview)"
            >
              <div class="event-time">{{ formatTime(interview.scheduledTime) }}</div>
              <div class="event-title">{{ interview.company?.name || '未知公司' }}</div>
              <div class="event-position">{{ interview.position }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 面试详情弹框 -->
    <el-dialog
      v-model="showInterviewDialog"
      title="面试详情"
      width="600px"
    >
      <div v-if="selectedInterview" class="interview-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="公司">
            {{ selectedInterview.company?.name || '未知公司' }}
          </el-descriptions-item>
          <el-descriptions-item label="职位">
            {{ selectedInterview.position }}
          </el-descriptions-item>
          <el-descriptions-item label="面试时间">
            {{ formatDateTime(selectedInterview.scheduledTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="面试轮次">
            第{{ selectedInterview.round }}轮
          </el-descriptions-item>
          <el-descriptions-item label="面试方式">
            {{ selectedInterview.type }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(selectedInterview.status)">
              {{ formatStatus(selectedInterview.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="面试官" :span="2">
            {{ selectedInterview.interviewer || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ selectedInterview.notes || selectedInterview.feedback || '暂无备注' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showInterviewDialog = false">关闭</el-button>
          <el-button type="primary" @click="editInterview">编辑</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增面试弹框 -->
    <el-dialog
      v-model="showAddDialog"
      title="新增面试"
      width="600px"
    >
      <interview-form
        v-if="showAddDialog"
        :initial-date="selectedDate || undefined"
        @submit="handleAddInterview"
        @cancel="showAddDialog = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PhPlus } from '@phosphor-icons/vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useCompanyStore } from '@/stores/company'
import type { InterviewRound } from '@/types'
import InterviewForm from '@/components/InterviewForm.vue'

const companyStore = useCompanyStore()

// 响应式数据
const viewMode = ref<'month' | 'week'>('month')
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const showInterviewDialog = ref(false)
const showAddDialog = ref(false)
const selectedInterview = ref<InterviewRound | null>(null)

// 周天数组
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 计算属性
const currentPeriodText = computed(() => {
  if (viewMode.value === 'month') {
    return dayjs(currentDate.value).format('YYYY年MM月')
  } else {
    const start = dayjs(currentDate.value).startOf('week')
    const end = dayjs(currentDate.value).endOf('week')
    return `${start.format('MM月DD日')} - ${end.format('MM月DD日')}`
  }
})

const displayDates = computed(() => {
  const dates: Date[] = []
  
  if (viewMode.value === 'month') {
    const start = dayjs(currentDate.value).startOf('month').startOf('week')
    const end = dayjs(currentDate.value).endOf('month').endOf('week')
    
    let current = start
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      dates.push(current.toDate())
      current = current.add(1, 'day')
    }
  } else {
    const start = dayjs(currentDate.value).startOf('week')
    
    for (let i = 0; i < 7; i++) {
      dates.push(start.add(i, 'day').toDate())
    }
  }
  
  return dates
})

// 方法
const previousPeriod = () => {
  if (viewMode.value === 'month') {
    currentDate.value = dayjs(currentDate.value).subtract(1, 'month').toDate()
  } else {
    currentDate.value = dayjs(currentDate.value).subtract(1, 'week').toDate()
  }
}

const nextPeriod = () => {
  if (viewMode.value === 'month') {
    currentDate.value = dayjs(currentDate.value).add(1, 'month').toDate()
  } else {
    currentDate.value = dayjs(currentDate.value).add(1, 'week').toDate()
  }
}

const goToToday = () => {
  currentDate.value = new Date()
}

const selectDate = (date: Date) => {
  selectedDate.value = date
}

const isSameMonth = (date: Date, referenceDate: Date) => {
  return dayjs(date).isSame(dayjs(referenceDate), 'month')
}

const isToday = (date: Date) => {
  return dayjs(date).isSame(dayjs(), 'day')
}

const isSelected = (date: Date) => {
  return selectedDate.value && dayjs(date).isSame(dayjs(selectedDate.value), 'day')
}

const getInterviewsForDate = (date: Date) => {
  // 创建一些示例面试数据用于测试，覆盖整个月的数据
  const mockInterviews: InterviewRound[] = []
  
  // 为本月的几个日期添加示例数据
  const today = dayjs()
  const currentMonth = today.month()
  
  // 今天 - 技术面试
  if (dayjs(date).month() === currentMonth && dayjs(date).date() === today.date()) {
    mockInterviews.push({
      id: '1',
      processId: 'process-1',
      companyId: '1',
      roundName: '技术面试',
      scheduledTime: dayjs(date).hour(10).minute(0).toDate(),
      status: 'scheduled',
      interviewer: '张工程师',
      feedback: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      company: { id: '1', name: '阿里巴巴', industry: 'IT', createdAt: new Date(), updatedAt: new Date() },
      position: '前端工程师',
      round: 1,
      type: '线上面试',
      notes: '准备算法题和项目介绍'
    })
  }
  
  // 明天 - HR面试
  if (dayjs(date).month() === currentMonth && dayjs(date).date() === today.add(1, 'day').date()) {
    mockInterviews.push({
      id: '2',
      processId: 'process-2',
      companyId: '2',
      roundName: 'HR面试',
      scheduledTime: dayjs(date).hour(14).minute(30).toDate(),
      status: 'scheduled',
      interviewer: '李HR',
      feedback: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      company: { id: '2', name: '腾讯', industry: 'IT', createdAt: new Date(), updatedAt: new Date() },
      position: 'React开发工程师',
      round: 2,
      type: '现场面试',
      notes: '薪资谈判和福利讨论'
    })
  }
  
  // 后天 - 终面
  if (dayjs(date).month() === currentMonth && dayjs(date).date() === today.add(2, 'day').date()) {
    mockInterviews.push({
      id: '3',
      processId: 'process-3',
      companyId: '3',
      roundName: '总监面试',
      scheduledTime: dayjs(date).hour(16).minute(0).toDate(),
      status: 'scheduled',
      interviewer: '王总监',
      feedback: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      company: { id: '3', name: '字节跳动', industry: 'IT', createdAt: new Date(), updatedAt: new Date() },
      position: '高级前端工程师',
      round: 3,
      type: '线上面试',
      notes: '团队文化和发展规划'
    })
  }
  
  // 上周某天 - 已完成的面试
  if (dayjs(date).month() === currentMonth && dayjs(date).date() === today.subtract(3, 'day').date()) {
    mockInterviews.push({
      id: '4',
      processId: 'process-4',
      companyId: '4',
      roundName: '初试',
      scheduledTime: dayjs(date).hour(9).minute(30).toDate(),
      status: 'completed',
      interviewer: '陈技术经理',
      feedback: '技术能力符合要求，沟通表达良好',
      createdAt: new Date(),
      updatedAt: new Date(),
      company: { id: '4', name: '美团', industry: 'IT', createdAt: new Date(), updatedAt: new Date() },
      position: 'Vue.js工程师',
      round: 1,
      type: '视频面试',
      notes: '已通过，等待复试通知'
    })
  }
  
  return mockInterviews
}

const formatTime = (dateTime: string | Date) => {
  return dayjs(dateTime).format('HH:mm')
}

const formatDateTime = (dateTime: string | Date) => {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm')
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    '已安排': '已安排',
    '已完成': '已完成',
    '已取消': '已取消',
    '待安排': '待安排',
    // 兼容英文状态
    'scheduled': '已安排',
    'completed': '已完成',
    'cancelled': '已取消',
    'pending': '待安排'
  }
  return statusMap[status] || status
}

const getStatusTagType = (status: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const typeMap: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    '已安排': 'primary',
    '已完成': 'success',
    '已取消': 'danger',
    '待安排': 'warning',
    // 兼容英文状态
    'scheduled': 'primary',
    'completed': 'success',
    'cancelled': 'danger',
    'pending': 'warning'
  }
  return typeMap[status] || 'info'
}

const viewInterview = (interview: InterviewRound) => {
  selectedInterview.value = interview
  showInterviewDialog.value = true
}

const editInterview = () => {
  if (selectedInterview.value) {
    // TODO: 跳转到编辑页面或打开编辑弹框
    console.log('编辑面试:', selectedInterview.value)
  }
  showInterviewDialog.value = false
}

const handleAddInterview = (data: any) => {
  console.log('新增面试:', data)
  showAddDialog.value = false
  // TODO: 实际添加面试逻辑
}

// 生命周期
onMounted(async () => {
  // 由于interview store没有loadRounds方法，我们只加载公司数据
  await companyStore.loadCompanies()
})
</script>

<style scoped lang="scss">
.calendar-view {
  padding: 24px;
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .page-title {
      margin: 0;
      color: var(--text-primary);
    }
    
    .calendar-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }
  
  .calendar-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
    
    .current-period {
      margin: 0;
      min-width: 200px;
      text-align: center;
      color: var(--text-primary);
    }
  }
  
  .calendar-grid {
    border: 1px solid var(--border-color-lighter);
    border-radius: 8px;
    overflow: hidden;
    
    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: var(--bg-color-page);
      
      .weekday-header {
        padding: 12px;
        text-align: center;
        font-weight: 600;
        color: var(--text-secondary);
        border-right: 1px solid var(--border-color-lighter);
        
        &:last-child {
          border-right: none;
        }
      }
    }
    
    .calendar-body {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
    
    .calendar-cell {
      min-height: 120px;
      padding: 8px;
      border-right: 1px solid var(--border-color-lighter);
      border-bottom: 1px solid var(--border-color-lighter);
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background: var(--bg-color-page);
      }
      
      &:last-child {
        border-right: none;
      }
      
      &.is-other-month {
        color: var(--text-placeholder);
        background: var(--bg-color-page);
      }
      
      &.is-today {
        background: var(--primary-color-light-9);
        
        .date-number {
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      
      &.is-selected {
        background: var(--primary-color-light-8);
      }
      
      .date-number {
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .date-events {
        .interview-event {
          margin-bottom: 2px;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          
          &.interview-已安排 {
            background: var(--primary-color-light-9);
            color: var(--primary-color);
          }
          
          &.interview-已完成 {
            background: var(--success-color-light-9);
            color: var(--success-color);
          }
          
          &.interview-已取消 {
            background: var(--error-color-light-9);
            color: var(--error-color);
          }
          
          &.interview-待安排 {
            background: var(--warning-color-light-9);
            color: var(--warning-color);
          }
          
          .event-time {
            font-weight: 600;
          }
          
          .event-title,
          .event-position {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  
  &.calendar-week {
    .calendar-cell {
      min-height: 400px;
    }
  }
}

.interview-detail {
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .calendar-view {
    padding: 16px;
    
    .calendar-header {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
      
      .calendar-controls {
        justify-content: center;
      }
    }
    
    .calendar-navigation {
      .current-period {
        min-width: auto;
        font-size: 14px;
      }
    }
    
    .calendar-cell {
      min-height: 80px;
      font-size: 12px;
    }
  }
}
</style>
