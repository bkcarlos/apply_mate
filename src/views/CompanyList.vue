<template>
  <div class="company-list">
    <div class="list-header">
      <h2 class="page-title">公司管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索公司名称或行业"
          :prefix-icon="Search"
          style="width: 300px"
          clearable
        />
        <el-select v-model="filterType" placeholder="公司类型筛选" clearable style="width: 150px">
          <el-option label="初创公司" value="初创公司" />
          <el-option label="中小企业" value="中小企业" />
          <el-option label="大型企业" value="大型企业" />
          <el-option label="外企" value="外企" />
          <el-option label="国企" value="国企" />
        </el-select>
        <el-button type="primary" @click="showAddDialog = true">
          <ph-plus :size="16" />
          新增公司
        </el-button>
      </div>
    </div>

    <div class="company-stats">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ totalCompanies }}</div>
              <div class="stat-label">公司总数</div>
            </div>
            <ph-buildings class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ activeCompanies }}</div>
              <div class="stat-label">活跃投递</div>
            </div>
            <ph-paper-plane-tilt class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ offerCompanies }}</div>
              <div class="stat-label">收到Offer</div>
            </div>
            <ph-trophy class="stat-icon" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ averageRating.toFixed(1) }}</div>
              <div class="stat-label">平均评分</div>
            </div>
            <ph-star class="stat-icon" />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-card class="company-grid-card">
      <div class="view-controls">
        <el-radio-group v-model="viewMode">
          <el-radio-button label="grid">卡片视图</el-radio-button>
          <el-radio-button label="table">表格视图</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 卡片视图 -->
      <div v-if="viewMode === 'grid'" class="company-grid">
        <div
          v-for="company in filteredCompanies"
          :key="company.id"
          class="company-card"
          @click="viewCompany(company)"
        >
          <div class="card-header">
            <h3 class="company-name">{{ company.name }}</h3>
            <el-tag size="small">{{ company.type }}</el-tag>
          </div>
          
          <div class="card-content">
            <div class="company-info">
              <div class="info-item" v-if="company.industry">
                <ph-briefcase :size="14" />
                <span>{{ company.industry }}</span>
              </div>
              <div class="info-item" v-if="company.location">
                <ph-map-pin :size="14" />
                <span>{{ company.location }}</span>
              </div>
              <div class="info-item" v-if="company.size">
                <ph-users :size="14" />
                <span>{{ company.size }}</span>
              </div>
            </div>
            
            <div class="company-stats-mini">
              <div class="stat-item">
                <span class="stat-value">{{ getCompanyInterviewCount(company.id) }}</span>
                <span class="stat-label">面试次数</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ getCompanyOfferCount(company.id) }}</span>
                <span class="stat-label">Offer数量</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="company-rating" v-if="company.rating">
              <el-rate
                :model-value="company.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
                size="small"
              />
            </div>
            <div class="card-actions">
              <el-button size="small" @click.stop="editCompany(company)">编辑</el-button>
              <el-button size="small" type="danger" @click.stop="deleteCompany(company)">删除</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 表格视图 -->
      <el-table
        v-else
        :data="filteredCompanies"
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column label="公司名称" width="200">
          <template #default="{ row }">
            <div class="company-cell">
              <div class="company-name">{{ row.name }}</div>
              <el-tag size="small">{{ row.type }}</el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="行业" prop="industry" width="150" />
        <el-table-column label="规模" prop="size" width="120" />
        <el-table-column label="地点" prop="location" width="150" />
        
        <el-table-column label="面试次数" width="100" align="center">
          <template #default="{ row }">
            <span>{{ getCompanyInterviewCount(row.id) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="Offer数量" width="100" align="center">
          <template #default="{ row }">
            <span>{{ getCompanyOfferCount(row.id) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="评分" width="120">
          <template #default="{ row }">
            <el-rate
              v-if="row.rating"
              :model-value="row.rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
              size="small"
            />
            <span v-else class="text-placeholder">未评分</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewCompany(row)">查看</el-button>
            <el-button size="small" @click="editCompany(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteCompany(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="table-pagination" v-if="viewMode === 'table'">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredCompanies.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 公司详情弹框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="公司详情"
      width="800px"
    >
      <company-detail
        v-if="selectedCompany"
        :company="selectedCompany"
        @close="showDetailDialog = false"
        @edit="handleEditFromDetail"
      />
    </el-dialog>

    <!-- 新增/编辑公司弹框 -->
    <el-dialog
      v-model="showFormDialog"
      :title="editMode ? '编辑公司' : '新增公司'"
      width="600px"
    >
      <company-form
        v-if="showFormDialog"
        :company="editMode && selectedCompany ? selectedCompany : undefined"
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
  PhBuildings,
  PhPaperPlaneTilt,
  PhTrophy,
  PhStar,
  PhBriefcase,
  PhMapPin,
  PhUsers
} from '@phosphor-icons/vue'
import { useCompanyStore } from '@/stores/company'
import { useInterviewStore } from '@/stores/interview'
import type { Company } from '@/types'
import CompanyDetail from '@/components/CompanyDetail.vue'
import CompanyForm from '@/components/CompanyForm.vue'

const companyStore = useCompanyStore()
const interviewStore = useInterviewStore()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const filterType = ref('')
const viewMode = ref<'grid' | 'table'>('grid')
const currentPage = ref(1)
const pageSize = ref(20)
const showDetailDialog = ref(false)
const showFormDialog = ref(false)
const showAddDialog = ref(false)
const selectedCompany = ref<Company | null>(null)
const editMode = ref(false)

// 计算属性
const totalCompanies = computed(() => companyStore.companies.length)
const activeCompanies = computed(() => {
  // 有正在进行的面试流程的公司数量
  const activeCompanyIds = new Set(
    interviewStore.processes
      .filter((p: any) => p.status === '面试中' || p.status === '评估中')
      .map(p => p.companyId)
  )
  return activeCompanyIds.size
})
const offerCompanies = computed(() => {
  // 收到offer的公司数量
  const offerCompanyIds = new Set(
    interviewStore.processes
      .filter((p: any) => p.status === '已发Offer')
      .map(p => p.companyId)
  )
  return offerCompanyIds.size
})
const averageRating = computed(() => {
  const ratedCompanies = companyStore.companies.filter(c => c.rating && c.rating > 0)
  if (ratedCompanies.length === 0) return 0
  const totalRating = ratedCompanies.reduce((sum, c) => sum + (c.rating || 0), 0)
  return totalRating / ratedCompanies.length
})

const filteredCompanies = computed(() => {
  let companies = companyStore.companies

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    companies = companies.filter(company => 
      company.name.toLowerCase().includes(keyword) ||
      (company.industry && company.industry.toLowerCase().includes(keyword))
    )
  }

  // 类型过滤
  if (filterType.value) {
    companies = companies.filter(company => 
      company.type === filterType.value
    )
  }

  // 按名称排序
  return companies.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
})

// 方法
const getCompanyInterviewCount = (companyId: string) => {
  return interviewStore.rounds.filter(r => r.companyId === companyId).length
}

const getCompanyOfferCount = (companyId: string) => {
  return interviewStore.processes.filter((p: any) => 
    p.companyId === companyId && p.status === '已发Offer'
  ).length
}

const viewCompany = (company: Company) => {
  selectedCompany.value = company
  showDetailDialog.value = true
}

const editCompany = (company: Company) => {
  selectedCompany.value = company
  editMode.value = true
  showFormDialog.value = true
}

const handleEditFromDetail = () => {
  showDetailDialog.value = false
  editMode.value = true
  showFormDialog.value = true
}

const deleteCompany = async (company: Company) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个公司吗？相关的面试记录也将被删除。',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await companyStore.deleteCompany(company.id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async (data: any) => {
  try {
    if (editMode.value && selectedCompany.value) {
      await companyStore.updateCompany(selectedCompany.value.id, data)
      ElMessage.success('更新成功')
    } else {
      await companyStore.addCompany(data)
      ElMessage.success('添加成功')
    }
    
    showFormDialog.value = false
    showAddDialog.value = false
    editMode.value = false
    selectedCompany.value = null
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 处理新增按钮
const handleAddCompany = () => {
  editMode.value = false
  selectedCompany.value = null
  showFormDialog.value = true
  showAddDialog.value = false
}

// 监听新增对话框
watch(() => showAddDialog.value, (newVal) => {
  if (newVal) {
    handleAddCompany()
  }
})

// 生命周期
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      companyStore.loadCompanies(),
      interviewStore.loadProcesses(),
      interviewStore.loadRounds()
    ])
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.company-list {
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
  
  .company-stats {
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
  
  .company-grid-card {
    .view-controls {
      margin-bottom: 20px;
      text-align: right;
    }
    
    .company-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      
      .company-card {
        border: 1px solid var(--border-color-lighter);
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          border-color: var(--primary-color);
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          .company-name {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
          }
        }
        
        .card-content {
          margin-bottom: 12px;
          
          .company-info {
            margin-bottom: 12px;
            
            .info-item {
              display: flex;
              align-items: center;
              gap: 6px;
              margin-bottom: 4px;
              font-size: 14px;
              color: var(--text-regular);
            }
          }
          
          .company-stats-mini {
            display: flex;
            justify-content: space-around;
            padding: 8px 0;
            border-top: 1px solid var(--border-color-lighter);
            
            .stat-item {
              text-align: center;
              
              .stat-value {
                display: block;
                font-size: 16px;
                font-weight: 600;
                color: var(--primary-color);
              }
              
              .stat-label {
                font-size: 12px;
                color: var(--text-secondary);
              }
            }
          }
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .company-rating {
            .el-rate {
              --el-rate-height: 16px;
              --el-rate-font-size: 14px;
            }
          }
          
          .card-actions {
            display: flex;
            gap: 8px;
          }
        }
      }
    }
    
    .company-cell {
      .company-name {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 4px;
      }
    }
    
    .table-pagination {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

@media (max-width: 768px) {
  .company-list {
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
    
    .company-stats {
      .el-col {
        margin-bottom: 16px;
      }
    }
    
    .company-grid {
      grid-template-columns: 1fr !important;
    }
  }
}
</style>
