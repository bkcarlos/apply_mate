<template>
  <div class="interview-list">
    <div class="list-header">
      <h2 class="page-title">面试管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索公司名称或职位"
          :prefix-icon="Search"
          style="width: 300px"
          clearable
        />
        <el-select v-model="filterStatus" placeholder="状态筛选" clearable style="width: 150px">
          <el-option label="已安排" value="scheduled" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
          <el-option label="待确认" value="pending" />
        </el-select>
        <el-button type="primary" @click="showAddDialog = true">
          <ph-plus :size="16" />
          新增面试
        </el-button>
      </div>
    </div>

    <div class="interview-stats">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ totalInterviews }}</div>
              <div class="stat-label">总面试数</div>
            </div>
            <ph-calendar class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ scheduledInterviews }}</div>
              <div class="stat-label">待面试</div>
            </div>
            <ph-clock class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ completedInterviews }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <ph-check-circle class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ successRate }}%</div>
              <div class="stat-label">通过率</div>
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
        <el-table-column label="公司" width="180">
          <template #default="{ row }">
            <div class="company-info">
              <div class="company-name">{{ row.company?.name || '未知公司' }}</div>
              <div class="company-type">{{ row.company?.type || '' }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="职位" width="200">
          <template #default="{ row }">
            <div class="position-info">
              <div class="position-title">{{ row.position }}</div>
              <div class="position-salary" v-if="row.expectedSalary">
                期望: {{ formatSalary(row.expectedSalary) }}
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="面试时间" width="180">
          <template #default="{ row }">
            <div v-if="row.scheduledTime" class="interview-time">
              <div>{{ formatDate(row.scheduledTime) }}</div>
              <div class="time-detail">{{ formatTime(row.scheduledTime) }}</div>
            </div>
            <span v-else class="text-placeholder">未安排</span>
          </template>
        </el-table-column>
        
        <el-table-column label="轮次" width="80" align="center">
          <template #default="{ row }">
            <el-tag size="small">第{{ row.round }}轮</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="面试方式" width="100">
          <template #default="{ row }">
            <span class="interview-type">{{ row.type }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="面试官" width="120">
          <template #default="{ row }">
            <span>{{ row.interviewer || '未知' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="viewInterview(row)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              @click="editInterview(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteInterview(row)"
            >
              删除
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
      title="面试详情"
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
      :title="editMode ? '编辑面试' : '新增面试'"
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
  interviewStore.processes.filter((p: any) => p.status === '面试中').length
)
const completedInterviews = computed(() => 
  interviewStore.processes.filter((p: any) => p.status === '已结束').length
)
const successRate = computed(() => {
  const completed = completedInterviews.value
  if (completed === 0) return 0
  const passed = interviewStore.processes.filter((p: any) => 
    p.status === '已发Offer'
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
  const statusMap: Record<string, string> = {
    'scheduled': '已安排',
    'completed': '已完成',
    'cancelled': '已取消',
    'pending': '待确认'
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
      '确定要删除这个面试记录吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await interviewStore.deleteRound(interview.id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async (data: any) => {
  try {
    if (editMode.value && selectedInterview.value) {
      await interviewStore.updateRound(selectedInterview.value.id, data)
      ElMessage.success('更新成功')
    } else {
      await interviewStore.addRound(data)
      ElMessage.success('添加成功')
    }
    
    showFormDialog.value = false
    showAddDialog.value = false
    editMode.value = false
    selectedInterview.value = null
  } catch (error) {
    ElMessage.error('操作失败')
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
