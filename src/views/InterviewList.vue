<template>
  <div class="interview-list">
    <div class="list-header">
      <h2 class="page-title">{{ $t('interviewList.title') }}</h2>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          :placeholder="$t('interviewList.search.placeholder')"
          :prefix-icon="Search"
          style="width: 300px"
          clearable
        />
        <el-select v-model="filterStatus" :placeholder="$t('interviewList.search.statusFilter')" clearable style="width: 150px">
          <el-option :label="$t('interviewList.statusOptions.scheduled')" value="scheduled" />
          <el-option :label="$t('interviewList.statusOptions.completed')" value="completed" />
          <el-option :label="$t('interviewList.statusOptions.cancelled')" value="cancelled" />
          <el-option :label="$t('interviewList.statusOptions.pending')" value="pending" />
        </el-select>
        <el-button type="primary" @click="showAddDialog = true">
          <ph-plus :size="16" />
          {{ $t('interviewList.buttons.addInterview') }}
        </el-button>
      </div>
    </div>

    <div class="interview-stats">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ totalInterviews }}</div>
              <div class="stat-label">{{ $t('interviewList.stats.totalInterviews') }}</div>
            </div>
            <ph-calendar class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ scheduledInterviews }}</div>
              <div class="stat-label">{{ $t('interviewList.stats.scheduledInterviews') }}</div>
            </div>
            <ph-clock class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ completedInterviews }}</div>
              <div class="stat-label">{{ $t('interviewList.stats.completedInterviews') }}</div>
            </div>
            <ph-check-circle class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ successRate }}%</div>
              <div class="stat-label">{{ $t('interviewList.stats.successRate') }}</div>
            </div>
            <ph-trend-up class="stat-icon" />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-card class="interview-table-card">
      <el-table
        :data="filteredInterviews"
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column :label="$t('interviewList.table.company')" width="180">
          <template #default="{ row }">
            <div class="company-info">
              <div class="company-name">{{ row.company?.name || $t('interviewList.unknownCompany') }}</div>
              <div class="company-type">{{ row.company?.type || '' }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('interviewList.table.position')" width="200">
          <template #default="{ row }">
            <div class="position-info">
              <div class="position-title">{{ row.position }}</div>
              <div class="position-salary" v-if="row.expectedSalary">
                {{ $t('interviewList.expected') }}: {{ formatSalary(row.expectedSalary) }}
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('interviewList.table.interviewTime')" width="180">
          <template #default="{ row }">
            <div v-if="row.scheduledTime" class="interview-time">
              <div>{{ formatDate(row.scheduledTime) }}</div>
              <div class="time-detail">{{ formatTime(row.scheduledTime) }}</div>
            </div>
            <span v-else class="text-placeholder">{{ $t('interviewList.notScheduled') }}</span>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('interviewList.table.round')" width="80" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ $t('interviewList.roundNumber', { number: row.round }) }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('interviewList.table.interviewType')" width="100">
          <template #default="{ row }">
            <span class="interview-type">{{ translateInterviewType(row.type) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('interviewList.table.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('interviewList.table.interviewer')" width="120">
          <template #default="{ row }">
            <span>{{ row.interviewer || $t('interviewList.unknown') }}</span>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('interviewList.table.actions')" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="viewInterview(row)"
            >
              {{ $t('interviewList.buttons.view') }}
            </el-button>
            <el-button
              size="small"
              @click="editInterview(row)"
            >
              {{ $t('interviewList.buttons.edit') }}
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteInterview(row)"
            >
              {{ $t('interviewList.buttons.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredInterviews.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 面试详情弹框 -->
    <el-dialog
      v-model="showDetailDialog"
      :title="$t('interviewList.dialogs.interviewDetail')"
      width="800px"
    >
      <interview-detail
        v-if="selectedInterview"
        :interview="selectedInterview"
        @close="showDetailDialog = false"
        @edit="handleEditFromDetail"
      />
    </el-dialog>

    <!-- 新增/编辑面试弹框 -->
    <el-dialog
      v-model="showFormDialog"
      :title="editMode ? $t('interviewList.dialogs.editInterview') : $t('interviewList.dialogs.addInterview')"
      width="600px"
    >
      <interview-form
        v-if="showFormDialog"
        :interview="editMode && selectedInterview ? selectedInterview : undefined"
        @submit="handleSubmit"
        @cancel="showFormDialog = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import {
  PhPlus,
  PhCalendar,
  PhClock,
  PhCheckCircle,
  PhTrendUp
} from '@phosphor-icons/vue'
import dayjs from 'dayjs'
import { useInterviewStore } from '@/stores/interview'
import { useCompanyStore } from '@/stores/company'
import type { InterviewRound } from '@/types'
import InterviewDetail from '@/components/InterviewDetail.vue'
import InterviewForm from '@/components/InterviewForm.vue'

const { t } = useI18n()
const interviewStore = useInterviewStore()
const companyStore = useCompanyStore()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const showDetailDialog = ref(false)
const showFormDialog = ref(false)
const showAddDialog = ref(false)
const selectedInterview = ref<InterviewRound | null>(null)
const editMode = ref(false)

// 计算属性
const totalInterviews = computed(() => interviewStore.processes.length)
const scheduledInterviews = computed(() => 
  interviewStore.processes.filter((p: any) => p.status === 'interviewing').length
)
const completedInterviews = computed(() => 
  interviewStore.processes.filter((p: any) => p.status === 'finished').length
)
const successRate = computed(() => {
  const completed = completedInterviews.value
  if (completed === 0) return 0
  const passed = interviewStore.processes.filter((p: any) => 
    p.status === 'offered'
  ).length
  return Math.round((passed / completed) * 100)
})

const filteredInterviews = computed(() => {
  let interviews = interviewStore.rounds

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    interviews = interviews.filter(interview => {
      const company = companyStore.companies.find(c => c.id === interview.companyId)
      return (
        company?.name.toLowerCase().includes(keyword) ||
        interview.position.toLowerCase().includes(keyword)
      )
    })
  }

  // 状态过滤
  if (filterStatus.value) {
    interviews = interviews.filter(interview => 
      interview.status === filterStatus.value
    )
  }

  // 按时间排序
  return interviews.sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
    return dateB - dateA
  })
})

// 方法
const formatDate = (dateTime: string) => {
  return dayjs(dateTime).format('YYYY-MM-DD')
}

const formatTime = (dateTime: string) => {
  return dayjs(dateTime).format('HH:mm')
}

const formatSalary = (salary: string) => {
  // 简单的薪资格式化
  return salary
}

const formatStatus = (status: string) => {
  switch (status) {
    case 'scheduled':
      return t('interviewList.statusOptions.scheduled')
    case 'completed':
      return t('interviewList.statusOptions.completed')
    case 'cancelled':
      return t('interviewList.statusOptions.cancelled')
    case 'pending':
      return t('interviewList.statusOptions.pending')
    default:
      return status
  }
}

const translateInterviewType = (type?: string) => {
  if (!type) return t('interviewList.unknown')
  
  switch (type) {
    case 'onsite':
      return t('interviewList.interviewTypes.onsite')
    case 'video':
      return t('interviewList.interviewTypes.video')
    case 'phone':
      return t('interviewList.interviewTypes.phone')
    case 'online':
      return t('interviewList.interviewTypes.online')
    default:
      return type
  }
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

const viewInterview = (interview: InterviewRound) => {
  selectedInterview.value = interview
  showDetailDialog.value = true
}

const editInterview = (interview: InterviewRound) => {
  selectedInterview.value = interview
  editMode.value = true
  showFormDialog.value = true
}

const handleEditFromDetail = () => {
  showDetailDialog.value = false
  editMode.value = true
  showFormDialog.value = true
}

const deleteInterview = async (interview: InterviewRound) => {
  try {
    await ElMessageBox.confirm(
      t('interviewList.confirmDelete.message'),
      t('interviewList.confirmDelete.title'),
      {
        confirmButtonText: t('interviewList.confirmDelete.confirmText'),
        cancelButtonText: t('interviewList.confirmDelete.cancelText'),
        type: 'warning',
      }
    )
    
    await interviewStore.deleteRound(interview.id)
    ElMessage.success(t('interviewList.messages.deleteSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('interviewList.messages.deleteError'))
    }
  }
}

const handleSubmit = async (data: any) => {
  try {
    if (editMode.value && selectedInterview.value) {
      await interviewStore.updateRound(selectedInterview.value.id, data)
      ElMessage.success(t('interviewList.messages.updateSuccess'))
    } else {
      await interviewStore.addRound(data)
      ElMessage.success(t('interviewList.messages.addSuccess'))
    }
    
    showFormDialog.value = false
    showAddDialog.value = false
    editMode.value = false
    selectedInterview.value = null
  } catch (error) {
    ElMessage.error(t('interviewList.messages.operationError'))
  }
}

// 生命周期
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      interviewStore.loadRounds(),
      companyStore.loadCompanies()
    ])
  } finally {
    loading.value = false
  }
})

// 监听新增对话框
const handleAddInterview = () => {
  editMode.value = false
  selectedInterview.value = null
  showFormDialog.value = true
  showAddDialog.value = false
}

// 同步 showAddDialog 和 showFormDialog
watch(() => showAddDialog.value, (newVal) => {
  if (newVal) {
    handleAddInterview()
  }
})
</script>

<style scoped lang="scss">
.interview-list {
  padding: 24px;
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .page-title {
      margin: 0;
      color: var(--text-primary);
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
  
  .interview-stats {
    margin-bottom: 24px;
    
    .stat-card {
      .el-card__body {
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .stat-content {
        .stat-number {
          font-size: 24px;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
        }
      }
      
      .stat-icon {
        font-size: 32px;
        color: var(--primary-color);
        opacity: 0.6;
      }
    }
  }
  
  .interview-table-card {
    .company-info {
      .company-name {
        font-weight: 600;
        color: var(--text-primary);
      }
      
      .company-type {
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
    
    .position-info {
      .position-title {
        font-weight: 500;
        color: var(--text-primary);
      }
      
      .position-salary {
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
    
    .interview-time {
      .time-detail {
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
    
    .interview-type {
      font-size: 14px;
      color: var(--text-regular);
    }
    
    .table-pagination {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

@media (max-width: 768px) {
  .interview-list {
    padding: 16px;
    
    .list-header {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
      
      .header-actions {
        flex-direction: column;
        
        .el-input,
        .el-select {
          width: 100% !important;
        }
      }
    }
    
    .interview-stats {
      .el-col {
        margin-bottom: 16px;
      }
    }
    
    .interview-table-card {
      overflow-x: auto;
    }
  }
}
</style>
