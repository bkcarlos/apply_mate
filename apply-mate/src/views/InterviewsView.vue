<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInterviewsStore } from '@/stores/interviews'
import { useCompaniesStore } from '@/stores/companies'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus, Search, Refresh, View, Edit, Delete } from '@element-plus/icons-vue'
import type { InterviewProcess } from '@/types'

const router = useRouter()
const interviewsStore = useInterviewsStore()
const companiesStore = useCompaniesStore()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref('')
const companyFilter = ref('')

// Table data
const tableData = computed(() => {
  let filtered = interviewsStore.processes
  
  // Apply search filter
  if (searchQuery.value) {
    filtered = interviewsStore.searchProcesses(searchQuery.value)
  }
  
  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(p => p.status === statusFilter.value)
  }
  
  // Apply company filter
  if (companyFilter.value) {
    filtered = filtered.filter(p => p.companyId === companyFilter.value)
  }
  
  return filtered
})

// Get company name by ID
const getCompanyName = (companyId: string) => {
  const company = companiesStore.getCompanyById(companyId)
  return company?.name || '未知公司'
}

// Get company logo by ID
const getCompanyLogo = (companyId: string) => {
  const company = companiesStore.getCompanyById(companyId)
  return company?.logoUrl || ''
}

// Format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// Helper functions for tag types
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    '投递中': 'info',
    '评估中': 'warning',
    '面试中': 'primary',
    '已发Offer': 'success',
    '已拒绝': 'danger',
    '已结束': 'info'
  }
  return typeMap[status] || 'info'
}

const getConclusionType = (conclusion: string) => {
  const typeMap: Record<string, string> = {
    '未开始': 'info',
    '进行中': 'primary',
    '通过': 'success',
    '未通过': 'danger',
    '待定': 'warning'
  }
  return typeMap[conclusion] || 'info'
}

// Status options
const statusOptions = [
  { label: '投递中', value: '投递中' },
  { label: '评估中', value: '评估中' },
  { label: '面试中', value: '面试中' },
  { label: '已发Offer', value: '已发Offer' },
  { label: '已拒绝', value: '已拒绝' },
  { label: '已结束', value: '已结束' }
]

// Company options
const companyOptions = computed(() => {
  return companiesStore.companies.map(company => ({
    label: company.name,
    value: company.id
  }))
})

// Actions
const viewDetail = (process: InterviewProcess) => {
  router.push(`/interviews/${process.id}`)
}

const editProcess = (process: InterviewProcess) => {
  router.push(`/interviews/${process.id}/edit`)
}

const deleteProcess = (process: InterviewProcess) => {
  ElMessageBox.confirm(
    `确定要删除 "${getCompanyName(process.companyId)} - ${process.position}" 的面试流程吗？`,
    '确认删除',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    interviewsStore.removeProcess(process.id)
    ElMessage.success('删除成功')
  }).catch(() => {
    // User cancelled
  })
}

const createNew = () => {
  router.push('/interviews/new')
}

// Clear filters
const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  companyFilter.value = ''
}
</script>

<template>
  <div class="interviews-view">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>面试管理</h1>
          <p class="page-description">管理你的所有面试流程</p>
        </div>
        <div class="header-actions">
          <el-button 
            type="primary" 
            @click="createNew"
            :icon="Plus"
            size="large"
          >
            新建面试流程
          </el-button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <el-card class="filters-card">
      <div class="filters-content">
        <div class="filters-row">
          <el-input
            v-model="searchQuery"
            placeholder="搜索职位名称或城市"
            :prefix-icon="Search"
            style="width: 300px"
            clearable
          />
          
          <el-select
            v-model="statusFilter"
            placeholder="筛选状态"
            style="width: 150px"
            clearable
          >
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <el-select
            v-model="companyFilter"
            placeholder="筛选公司"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="option in companyOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <el-button @click="clearFilters" :icon="Refresh">
            清除筛选
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- Table -->
    <el-card class="table-card">
      <el-table 
        :data="tableData" 
        v-loading="interviewsStore.loading"
        stripe
        style="width: 100%"
        @row-click="viewDetail"
        class="interviews-table"
      >
        <el-table-column width="60">
          <template #default="{ row }">
            <div class="company-logo">
              <img 
                v-if="getCompanyLogo(row.companyId)" 
                :src="getCompanyLogo(row.companyId)"
                :alt="getCompanyName(row.companyId)"
                class="logo-img"
              />
              <div v-else class="logo-placeholder">
                {{ getCompanyName(row.companyId).charAt(0) }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="position" label="职位" min-width="200">
          <template #default="{ row }">
            <div class="position-info">
              <div class="position-name">{{ row.position }}</div>
              <div class="position-details">{{ row.city }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="companyId" label="公司" width="150">
          <template #default="{ row }">
            <span class="company-name">{{ getCompanyName(row.companyId) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="getStatusType(row.status)" 
              size="small"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="conclusion" label="结论" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="getConclusionType(row.conclusion)" 
              size="small"
              effect="plain"
            >
              {{ row.conclusion }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sourceChannel" label="渠道" width="120">
          <template #default="{ row }">
            <span class="source-channel">{{ row.sourceChannel }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="updateTime" label="更新时间" width="120">
          <template #default="{ row }">
            <span class="update-time">{{ formatDate(row.updateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <div class="actions">
              <el-button 
                type="text" 
                @click.stop="viewDetail(row)"
                :icon="View"
                size="small"
              />
              <el-button 
                type="text" 
                @click.stop="editProcess(row)"
                :icon="Edit"
                size="small"
              />
              <el-button 
                type="text" 
                @click.stop="deleteProcess(row)"
                :icon="Delete"
                size="small"
                class="danger"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Empty State -->
      <div v-if="tableData.length === 0 && !interviewsStore.loading" class="empty-state">
        <el-empty description="暂无面试流程" />
        <el-button 
          type="primary" 
          @click="createNew"
          :icon="Plus"
        >
          新建面试流程
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.interviews-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.page-description {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  margin: 0;
}

.filters-card {
  margin-bottom: var(--spacing-md);
}

.filters-content {
  padding: var(--spacing-md) 0;
}

.filters-row {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.table-card {
  overflow: hidden;
}

.interviews-table {
  cursor: pointer;
}

.interviews-table .el-table__row:hover {
  background-color: rgba(242, 138, 49, 0.05);
}

.company-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 1.2rem;
}

.position-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.position-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.position-details {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.company-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.source-channel {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.update-time {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: var(--spacing-xs);
}

.actions .el-button.danger {
  color: var(--color-error);
}

.actions .el-button.danger:hover {
  color: var(--color-error);
  background-color: rgba(244, 67, 54, 0.1);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xxl) 0;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-row .el-input,
  .filters-row .el-select {
    width: 100% !important;
  }
  
  .table-card {
    overflow-x: auto;
  }
}
</style>