<template>
  <div class="settings-view">
    <div class="settings-header">
      <h2 class="page-title">系统设置</h2>
    </div>

    <el-row :gutter="24">
      <el-col :span="16">
        <!-- 个人信息设置 -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <ph-user :size="20" />
              <span>个人信息</span>
            </div>
          </template>
          
          <el-form
            :model="userProfile"
            label-width="120px"
            @submit.prevent="saveUserProfile"
          >
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="姓名">
                  <el-input v-model="userProfile.name" placeholder="请输入姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱">
                  <el-input v-model="userProfile.email" placeholder="请输入邮箱" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="手机号">
                  <el-input v-model="userProfile.phone" placeholder="请输入手机号" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所在城市">
                  <el-input v-model="userProfile.location" placeholder="请输入所在城市" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="求职方向">
              <el-input v-model="userProfile.jobDirection" placeholder="如：前端开发工程师" />
            </el-form-item>
            
            <el-form-item label="期望薪资">
              <el-input v-model="userProfile.expectedSalary" placeholder="如：15K-25K" />
            </el-form-item>
            
            <el-form-item label="工作经验">
              <el-select v-model="userProfile.experience" placeholder="选择工作经验" style="width: 200px">
                <el-option label="应届毕业生" value="应届毕业生" />
                <el-option label="1年以下" value="1年以下" />
                <el-option label="1-3年" value="1-3年" />
                <el-option label="3-5年" value="3-5年" />
                <el-option label="5-10年" value="5-10年" />
                <el-option label="10年以上" value="10年以上" />
              </el-select>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveUserProfile">保存个人信息</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 系统偏好设置 -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <ph-gear :size="20" />
              <span>系统偏好</span>
            </div>
          </template>
          
          <el-form label-width="160px">
            <el-form-item label="主题模式">
              <el-radio-group v-model="systemSettings.theme">
                <el-radio label="light">浅色模式</el-radio>
                <el-radio label="dark">深色模式</el-radio>
                <el-radio label="auto">跟随系统</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="默认视图">
              <el-select v-model="systemSettings.defaultView" style="width: 200px">
                <el-option label="仪表板" value="dashboard" />
                <el-option label="面试日历" value="calendar" />
                <el-option label="面试列表" value="interviews" />
                <el-option label="公司管理" value="companies" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="自动保存">
              <el-switch v-model="systemSettings.autoSave" />
              <el-text type="info" size="small" style="margin-left: 12px;">
                启用后将自动保存表单数据
              </el-text>
            </el-form-item>
            
            <el-form-item label="桌面通知">
              <el-switch v-model="systemSettings.notifications" />
              <el-text type="info" size="small" style="margin-left: 12px;">
                面试提醒等重要通知
              </el-text>
            </el-form-item>
            
            <el-form-item label="数据备份">
              <el-switch v-model="systemSettings.autoBackup" />
              <el-text type="info" size="small" style="margin-left: 12px;">
                定期自动备份数据到本地
              </el-text>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSystemSettings">保存系统设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 数据管理 -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <ph-database :size="20" />
              <span>数据管理</span>
            </div>
          </template>
          
          <div class="data-management">
            <div class="management-section">
              <h4>数据导入导出</h4>
              <div class="action-buttons">
                <el-button @click="exportAllData">
                  <ph-download :size="16" />
                  导出所有数据
                </el-button>
                <el-upload
                  ref="uploadRef"
                  action=""
                  :auto-upload="false"
                  :show-file-list="false"
                  accept=".json"
                  @change="handleImportData"
                >
                  <el-button>
                    <ph-upload :size="16" />
                    导入数据
                  </el-button>
                </el-upload>
              </div>
            </div>
            
            <el-divider />
            
            <div class="management-section">
              <h4>数据清理</h4>
              <div class="action-buttons">
                <el-button @click="clearCompletedInterviews">清理已完成面试</el-button>
                <el-button @click="clearCancelledInterviews">清理已取消面试</el-button>
                <el-button type="danger" @click="clearAllData">清空所有数据</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- 使用统计 -->
        <el-card class="stats-card">
          <template #header>
            <div class="card-header">
              <ph-chart-pie :size="20" />
              <span>使用统计</span>
            </div>
          </template>
          
          <div class="usage-stats">
            <div class="stat-item">
              <div class="stat-label">注册时间</div>
              <div class="stat-value">{{ formatDate(userProfile.createdAt) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">总投递数</div>
              <div class="stat-value">{{ totalApplications }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">总面试数</div>
              <div class="stat-value">{{ totalInterviews }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">收到Offer</div>
              <div class="stat-value">{{ totalOffers }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">数据存储</div>
              <div class="stat-value">{{ dataSize }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">最后使用</div>
              <div class="stat-value">{{ formatDate(lastUsed) }}</div>
            </div>
          </div>
        </el-card>

        <!-- 快捷操作 -->
        <el-card class="quick-actions-card">
          <template #header>
            <div class="card-header">
              <ph-lightning :size="20" />
              <span>快捷操作</span>
            </div>
          </template>
          
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/interviews/new')">
              <ph-plus :size="16" />
              新增面试
            </el-button>
            <el-button @click="$router.push('/companies/new')">
              <ph-buildings :size="16" />
              新增公司
            </el-button>
            <el-button @click="$router.push('/calendar')">
              <ph-calendar :size="16" />
              查看日历
            </el-button>
            <el-button @click="$router.push('/analysis')">
              <ph-chart-line :size="16" />
              数据分析
            </el-button>
          </div>
        </el-card>

        <!-- 系统信息 -->
        <el-card class="system-info-card">
          <template #header>
            <div class="card-header">
              <ph-info :size="20" />
              <span>系统信息</span>
            </div>
          </template>
          
          <div class="system-info">
            <div class="info-item">
              <span class="label">应用版本:</span>
              <span class="value">v1.4.0</span>
            </div>
            <div class="info-item">
              <span class="label">构建时间:</span>
              <span class="value">{{ buildTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">浏览器:</span>
              <span class="value">{{ browserInfo }}</span>
            </div>
            <div class="info-item">
              <span class="label">存储方式:</span>
              <span class="value">LocalStorage</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  PhUser,
  PhGear,
  PhDatabase,
  PhChartPie,
  PhLightning,
  PhInfo,
  PhDownload,
  PhUpload,
  PhPlus,
  PhBuildings,
  PhCalendar,
  PhChartLine
} from '@phosphor-icons/vue'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'
import { useInterviewStore } from '@/stores/interview'
import { useCompanyStore } from '@/stores/company'
import { storageManager } from '@/utils/storage'

const userStore = useUserStore()
const interviewStore = useInterviewStore()
const companyStore = useCompanyStore()

// 响应式数据
const uploadRef = ref()
const userProfile = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  jobDirection: '',
  expectedSalary: '',
  experience: '',
  createdAt: ''
})

const systemSettings = ref({
  theme: 'light',
  defaultView: 'dashboard',
  autoSave: true,
  notifications: true,
  autoBackup: false
})

// 计算属性
const totalApplications = computed(() => interviewStore.processes.length)
const totalInterviews = computed(() => interviewStore.rounds.length)
const totalOffers = computed(() => 
  interviewStore.processes.filter((p: any) => p.status === '已发Offer').length
)

const dataSize = computed(() => {
  // 计算数据大小（简化版本）
  const data = JSON.stringify({
    companies: companyStore.companies,
    processes: interviewStore.processes,
    rounds: interviewStore.rounds,
    user: userStore.profile
  })
  const sizeInBytes = new Blob([data]).size
  return formatFileSize(sizeInBytes)
})

const lastUsed = computed(() => new Date().toISOString())
const buildTime = computed(() => '2024-01-15 10:30:00')
const browserInfo = computed(() => {
  const ua = navigator.userAgent
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  return 'Unknown'
})

// 方法
const formatDate = (dateStr: string) => {
  if (!dateStr) return '未知'
  return dayjs(dateStr).format('YYYY-MM-DD')
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const saveUserProfile = async () => {
  try {
    const profileData = {
      ...userProfile.value,
      createdAt: userProfile.value.createdAt ? new Date(userProfile.value.createdAt) : new Date()
    }
    await userStore.updateProfile(profileData)
    ElMessage.success('个人信息保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const saveSystemSettings = () => {
  // TODO: 保存系统设置到本地存储
  localStorage.setItem('systemSettings', JSON.stringify(systemSettings.value))
  ElMessage.success('系统设置保存成功')
}

const exportAllData = async () => {
  try {
    const data = {
      companies: companyStore.companies,
      processes: interviewStore.processes,
      rounds: interviewStore.rounds,
      user: userStore.profile,
      exportTime: new Date().toISOString(),
      version: '1.4.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `apply-mate-data-${dayjs().format('YYYY-MM-DD')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    ElMessage.success('数据导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const handleImportData = (file: any) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      
      // 验证数据格式
      if (!data.companies || !data.processes || !data.rounds) {
        throw new Error('数据格式不正确')
      }
      
      await ElMessageBox.confirm(
        '导入数据将覆盖现有数据，确定要继续吗？',
        '导入确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
      
      // 导入数据
      await storageManager.importData(data)
      
      // 重新加载所有数据
      await Promise.all([
        companyStore.loadCompanies(),
        interviewStore.loadProcesses(),
        interviewStore.loadRounds(),
        userStore.loadProfile()
      ])
      
      ElMessage.success('数据导入成功')
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('导入失败: ' + error)
      }
    }
  }
  reader.readAsText(file.raw)
}

const clearCompletedInterviews = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清理所有已完成的面试记录吗？',
      '清理确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const completedRounds = interviewStore.rounds.filter((r: any) => r.conclusion === '通过')
    for (const round of completedRounds) {
      await interviewStore.deleteRound(round.id)
    }
    
    ElMessage.success(`已清理 ${completedRounds.length} 条已完成面试记录`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清理失败')
    }
  }
}

const clearCancelledInterviews = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清理所有已取消的面试记录吗？',
      '清理确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const cancelledRounds = interviewStore.rounds.filter((r: any) => r.status === '已拒绝')
    for (const round of cancelledRounds) {
      await interviewStore.deleteRound(round.id)
    }
    
    ElMessage.success(`已清理 ${cancelledRounds.length} 条已取消面试记录`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清理失败')
    }
  }
}

const clearAllData = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有数据吗？此操作不可恢复！',
      '危险操作确认',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'error',
      }
    )
    
    await ElMessageBox.confirm(
      '请再次确认，这将删除所有公司、面试、投递记录！',
      '最终确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
      }
    )
    
    await storageManager.clear()
    
    // 重新初始化数据
    await Promise.all([
      companyStore.loadCompanies(),
      interviewStore.loadProcesses(),
      interviewStore.loadRounds(),
      userStore.loadProfile()
    ])
    
    ElMessage.success('所有数据已清空')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空失败')
    }
  }
}

// 生命周期
onMounted(async () => {
  // 加载用户资料
  await userStore.loadProfile()
  if (userStore.profile) {
    userProfile.value = {
      name: userStore.profile.id || '',
      email: '',
      phone: '',
      location: '',
      jobDirection: '',
      expectedSalary: userStore.profile.currentMonthlySalary?.toString() || '',
      experience: '',
      createdAt: userStore.profile.createdAt?.toISOString() || new Date().toISOString()
    }
  }
  
  // 加载系统设置
  const savedSettings = localStorage.getItem('systemSettings')
  if (savedSettings) {
    systemSettings.value = { ...systemSettings.value, ...JSON.parse(savedSettings) }
  }
  
  // 加载其他数据
  await Promise.all([
    interviewStore.loadProcesses(),
    interviewStore.loadRounds(),
    companyStore.loadCompanies()
  ])
})
</script>

<style scoped lang="scss">
.settings-view {
  padding: 24px;
  
  .settings-header {
    margin-bottom: 24px;
    
    .page-title {
      margin: 0;
      color: var(--text-primary);
    }
  }
  
  .settings-card,
  .stats-card,
  .quick-actions-card,
  .system-info-card {
    margin-bottom: 16px;
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }
  }
  
  .data-management {
    .management-section {
      h4 {
        margin: 0 0 12px 0;
        color: var(--text-primary);
      }
      
      .action-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
    }
  }
  
  .usage-stats,
  .system-info {
    .stat-item,
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color-lighter);
      
      &:last-child {
        border-bottom: none;
      }
      
      .stat-label,
      .label {
        color: var(--text-secondary);
        font-size: 14px;
      }
      
      .stat-value,
      .value {
        color: var(--text-primary);
        font-weight: 600;
      }
    }
  }
  
  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .el-button {
      justify-content: flex-start;
    }
  }
}

@media (max-width: 768px) {
  .settings-view {
    padding: 16px;
    
    .el-col {
      margin-bottom: 16px;
    }
    
    .data-management {
      .action-buttons {
        flex-direction: column;
        
        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
