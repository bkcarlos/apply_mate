<template>
  <div class="settings-view">
    <div class="settings-header">
      <h2 class="page-title">{{ $t('settings.title') }}</h2>
    </div>

    <el-row :gutter="24">
      <el-col :span="16">
        <!-- 个人信息设置 -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <ph-user :size="20" />
              <span>{{ $t('settings.profile.title') }}</span>
            </div>
          </template>
          
          <el-form
            :model="userProfile"
            label-width="120px"
            @submit.prevent="saveUserProfile"
          >
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item :label="$t('settings.profile.name')">
                  <el-input v-model="userProfile.name" :placeholder="$t('settings.profile.namePlaceholder')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.profile.email')">
                  <el-input v-model="userProfile.email" :placeholder="$t('settings.profile.emailPlaceholder')" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item :label="$t('settings.profile.phone')">
                  <el-input v-model="userProfile.phone" :placeholder="$t('settings.profile.phonePlaceholder')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('settings.profile.location')">
                  <el-input v-model="userProfile.location" :placeholder="$t('settings.profile.locationPlaceholder')" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item :label="$t('settings.profile.jobDirection')">
              <el-input v-model="userProfile.jobDirection" :placeholder="$t('settings.profile.jobDirectionPlaceholder')" />
            </el-form-item>
            
            <el-form-item :label="$t('settings.profile.expectedSalary')">
              <el-input v-model="userProfile.expectedSalary" :placeholder="$t('settings.profile.expectedSalaryPlaceholder')" />
            </el-form-item>
            
            <el-form-item :label="$t('settings.profile.experience')">
              <el-select v-model="userProfile.experience" :placeholder="$t('settings.profile.experience')" style="width: 200px">
                <el-option :label="$t('settings.profile.experienceOptions.fresh')" value="fresh" />
                <el-option :label="$t('settings.profile.experienceOptions.under1')" value="under1" />
                <el-option :label="$t('settings.profile.experienceOptions.1to3')" value="1to3" />
                <el-option :label="$t('settings.profile.experienceOptions.3to5')" value="3to5" />
                <el-option :label="$t('settings.profile.experienceOptions.5to10')" value="5to10" />
                <el-option :label="$t('settings.profile.experienceOptions.over10')" value="over10" />
              </el-select>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveUserProfile">{{ $t('settings.profile.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 系统偏好设置 -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <ph-gear :size="20" />
              <span>{{ $t('settings.system.title') }}</span>
            </div>
          </template>
          
          <el-form label-width="160px">
            <el-form-item :label="$t('settings.system.theme')">
              <el-radio-group v-model="systemSettings.theme">
                <el-radio label="light">{{ $t('settings.system.themeOptions.light') }}</el-radio>
                <el-radio label="dark">{{ $t('settings.system.themeOptions.dark') }}</el-radio>
                <el-radio label="auto">{{ $t('settings.system.themeOptions.auto') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item :label="$t('settings.system.defaultView')">
              <el-select v-model="systemSettings.defaultView" style="width: 200px">
                <el-option :label="$t('settings.system.defaultViewOptions.dashboard')" value="dashboard" />
                <el-option :label="$t('settings.system.defaultViewOptions.calendar')" value="calendar" />
                <el-option :label="$t('settings.system.defaultViewOptions.interviews')" value="interviews" />
                <el-option :label="$t('settings.system.defaultViewOptions.companies')" value="companies" />
              </el-select>
            </el-form-item>
            
            <el-form-item :label="$t('settings.system.autoSave')">
              <el-switch v-model="systemSettings.autoSave" />
              <el-text type="info" size="small" style="margin-left: 12px;">
                {{ $t('settings.system.autoSaveDesc') }}
              </el-text>
            </el-form-item>
            
            <el-form-item :label="$t('settings.system.notifications')">
              <el-switch v-model="systemSettings.notifications" />
              <el-text type="info" size="small" style="margin-left: 12px;">
                {{ $t('settings.system.notificationsDesc') }}
              </el-text>
            </el-form-item>
            
            <el-form-item :label="$t('settings.system.autoBackup')">
              <el-switch v-model="systemSettings.autoBackup" />
              <el-text type="info" size="small" style="margin-left: 12px;">
                {{ $t('settings.system.autoBackupDesc') }}
              </el-text>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSystemSettings">{{ $t('settings.system.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 数据管理 -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <ph-database :size="20" />
              <span>{{ $t('settings.dataManagement.title') }}</span>
            </div>
          </template>
          
          <div class="data-management">
            <div class="management-section">
              <h4>{{ $t('settings.dataManagement.importExport') }}</h4>
              <div class="action-buttons">
                <el-button @click="exportAllData">
                  <ph-download :size="16" />
                  {{ $t('settings.dataManagement.exportAll') }}
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
                    {{ $t('settings.dataManagement.importData') }}
                  </el-button>
                </el-upload>
              </div>
            </div>
            
            <el-divider />
            
            <div class="management-section">
              <h4>{{ $t('settings.dataManagement.dataCleaning') }}</h4>
              <div class="action-buttons">
                <el-button @click="clearCompletedInterviews">{{ $t('settings.dataManagement.clearCompleted') }}</el-button>
                <el-button @click="clearCancelledInterviews">{{ $t('settings.dataManagement.clearCancelled') }}</el-button>
                <el-button type="danger" @click="clearAllData">{{ $t('settings.dataManagement.clearAll') }}</el-button>
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
              <span>{{ $t('settings.stats.title') }}</span>
            </div>
          </template>
          
          <div class="usage-stats">
            <div class="stat-item">
              <div class="stat-label">{{ $t('settings.stats.registerTime') }}</div>
              <div class="stat-value">{{ formatDate(userProfile.createdAt) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ $t('settings.stats.totalApplications') }}</div>
              <div class="stat-value">{{ totalApplications }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ $t('settings.stats.totalInterviews') }}</div>
              <div class="stat-value">{{ totalInterviews }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ $t('settings.stats.totalOffers') }}</div>
              <div class="stat-value">{{ totalOffers }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ $t('settings.stats.dataStorage') }}</div>
              <div class="stat-value">{{ dataSize }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ $t('settings.stats.lastUsed') }}</div>
              <div class="stat-value">{{ formatDate(lastUsed) }}</div>
            </div>
          </div>
        </el-card>

        <!-- 快捷操作 -->
        <el-card class="quick-actions-card">
          <template #header>
            <div class="card-header">
              <ph-lightning :size="20" />
              <span>{{ $t('settings.quickActions.title') }}</span>
            </div>
          </template>
          
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/interviews/new')">
              <ph-plus :size="16" />
              {{ $t('settings.quickActions.newInterview') }}
            </el-button>
            <el-button @click="$router.push('/companies/new')">
              <ph-buildings :size="16" />
              {{ $t('settings.quickActions.newCompany') }}
            </el-button>
            <el-button @click="$router.push('/calendar')">
              <ph-calendar :size="16" />
              {{ $t('settings.quickActions.viewCalendar') }}
            </el-button>
            <el-button @click="$router.push('/analysis')">
              <ph-chart-line :size="16" />
              {{ $t('settings.quickActions.dataAnalysis') }}
            </el-button>
          </div>
        </el-card>

        <!-- 系统信息 -->
        <el-card class="system-info-card">
          <template #header>
            <div class="card-header">
              <ph-info :size="20" />
              <span>{{ $t('settings.systemInfo.title') }}</span>
            </div>
          </template>
          
          <div class="system-info">
            <div class="info-item">
              <span class="label">{{ $t('settings.systemInfo.appVersion') }}:</span>
              <span class="value">v1.4.0</span>
            </div>
            <div class="info-item">
              <span class="label">{{ $t('settings.systemInfo.buildTime') }}:</span>
              <span class="value">{{ buildTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ $t('settings.systemInfo.browser') }}:</span>
              <span class="value">{{ browserInfo }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ $t('settings.systemInfo.storage') }}:</span>
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
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()
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
  interviewStore.processes.filter((p: any) => p.status === 'offer').length
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
  if (!dateStr) return t('settings.stats.unknown')
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
    ElMessage.success(t('messages.saveSuccess'))
  } catch (error) {
    ElMessage.error(t('messages.saveError'))
  }
}

const saveSystemSettings = () => {
  // TODO: 保存系统设置到本地存储
  localStorage.setItem('systemSettings', JSON.stringify(systemSettings.value))
  ElMessage.success(t('messages.saveSuccess'))
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
    
    ElMessage.success(t('settings.dataManagement.exportSuccess'))
  } catch (error) {
    ElMessage.error(t('settings.dataManagement.exportFailed'))
  }
}

const handleImportData = (file: any) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      
      // 验证数据格式
      if (!data.companies || !data.processes || !data.rounds) {
        throw new Error(t('settings.dataManagement.dataFormatError'))
      }
      
      await ElMessageBox.confirm(
        t('settings.dataManagement.importConfirm'),
        t('settings.dataManagement.importTitle'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
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
      
      ElMessage.success(t('settings.dataManagement.importSuccess'))
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(t('settings.dataManagement.importFailed') + ': ' + error)
      }
    }
  }
  reader.readAsText(file.raw)
}

const clearCompletedInterviews = async () => {
  try {
    await ElMessageBox.confirm(
      t('settings.dataManagement.clearCompletedConfirm'),
      t('settings.dataManagement.clearTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
    
    const completedRounds = interviewStore.rounds.filter((r: any) => r.conclusion === 'passed')
    for (const round of completedRounds) {
      await interviewStore.deleteRound(round.id)
    }
    
    ElMessage.success(t('settings.dataManagement.clearedRecords', { count: completedRounds.length }))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('settings.dataManagement.clearFailed'))
    }
  }
}

const clearCancelledInterviews = async () => {
  try {
    await ElMessageBox.confirm(
      t('settings.dataManagement.clearCancelledConfirm'),
      t('settings.dataManagement.clearTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
    
    const cancelledRounds = interviewStore.rounds.filter((r: any) => r.status === 'cancelled')
    for (const round of cancelledRounds) {
      await interviewStore.deleteRound(round.id)
    }
    
    ElMessage.success(t('settings.dataManagement.clearedRecords', { count: cancelledRounds.length }))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('settings.dataManagement.clearFailed'))
    }
  }
}

const clearAllData = async () => {
  try {
    await ElMessageBox.confirm(
      t('settings.dataManagement.clearAllConfirm'),
      t('settings.dataManagement.clearDangerTitle'),
      {
        confirmButtonText: t('settings.dataManagement.clearAll'),
        cancelButtonText: t('common.cancel'),
        type: 'error',
      }
    )
    
    await ElMessageBox.confirm(
      t('settings.dataManagement.clearAllFinalConfirm'),
      t('settings.dataManagement.clearFinalTitle'),
      {
        confirmButtonText: t('common.delete'),
        cancelButtonText: t('common.cancel'),
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
    
    ElMessage.success(t('settings.dataManagement.clearSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('settings.dataManagement.clearFailed'))
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
