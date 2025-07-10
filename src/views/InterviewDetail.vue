<template>
  <div class="interview-detail">
    <div class="detail-header">
      <a-button 
        type="link" 
        :icon="h(ArrowLeftOutlined)" 
        @click="$router.back()"
        class="back-btn"
      >
        返回
      </a-button>
      <div class="header-content">
        <h2>{{ process?.position || '加载中...' }}</h2>
        <a-tag 
          v-if="process" 
          :color="getStatusColor(process.status)"
          class="status-tag"
        >
          {{ getStatusText(process.status) }}
        </a-tag>
      </div>
      <div class="header-actions">
        <a-button 
          :icon="h(EditOutlined)" 
          @click="showEditModal = true"
          :disabled="!process"
        >
          编辑
        </a-button>
        <a-dropdown>
          <a-button :icon="h(MoreOutlined)">更多</a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item key="export" @click="exportData">
                <FileOutlined />
                导出数据
              </a-menu-item>
              <a-menu-item key="delete" @click="showDeleteConfirm" danger>
                <DeleteOutlined />
                删除流程
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <a-spin size="large" />
    </div>

    <div v-else-if="process" class="detail-content">
      <!-- 基本信息 -->
      <a-card title="基本信息" class="info-card">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="职位">
            {{ process.position }}
          </a-descriptions-item>
          <a-descriptions-item label="公司">
            <a-button 
              type="link" 
              @click="viewCompany" 
              v-if="company"
              class="company-link"
            >
              {{ company.name }}
            </a-button>
            <span v-else>{{ process.companyId }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="投递时间">
            {{ dayjs(process.appliedAt).format('YYYY-MM-DD') }}
          </a-descriptions-item>
          <a-descriptions-item label="更新时间">
            {{ dayjs(process.updatedAt).format('YYYY-MM-DD') }}
          </a-descriptions-item>
          <a-descriptions-item label="状态" :span="2">
            <a-tag :color="getStatusColor(process.status)">
              {{ getStatusText(process.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="备注" :span="2" v-if="process.notes">
            <div class="notes-content">{{ process.notes }}</div>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 面试轮次 -->
      <a-card title="面试轮次" class="rounds-card">
        <template #extra>
          <a-button 
            type="primary" 
            :icon="h(PlusOutlined)"
            @click="showAddRoundModal = true"
            :disabled="process.status === 'rejected' || process.status === 'offer'"
          >
            添加轮次
          </a-button>
        </template>

        <div v-if="rounds.length === 0" class="empty-rounds">
          <a-empty description="暂无面试轮次">
            <a-button 
              type="primary" 
              @click="showAddRoundModal = true"
              :disabled="process.status === 'rejected' || process.status === 'offer'"
            >
              添加首轮面试
            </a-button>
          </a-empty>
        </div>

        <a-timeline v-else class="rounds-timeline">
          <a-timeline-item 
            v-for="round in rounds" 
            :key="round.id"
            :color="getRoundColor(round.result)"
          >
            <template #dot>
              <component 
                :is="getRoundIcon(round.result)" 
                class="round-icon"
              />
            </template>
            <div class="round-item">
              <div class="round-header">
                <h4>{{ round.type }} - 第{{ round.round }}轮</h4>
                <div class="round-actions">
                  <a-button 
                    size="small" 
                    type="link"
                    :icon="h(EditOutlined)"
                    @click="editRound(round)"
                  >
                    编辑
                  </a-button>
                  <a-popconfirm
                    title="确定删除这轮面试吗？"
                    @confirm="deleteRound(round.id)"
                  >
                    <a-button 
                      size="small" 
                      type="link" 
                      danger
                      :icon="h(DeleteOutlined)"
                    >
                      删除
                    </a-button>
                  </a-popconfirm>
                </div>
              </div>
              <div class="round-details">
                <p><strong>时间：</strong>{{ formatDateTime(round.scheduledAt) }}</p>
                <p v-if="round.interviewer"><strong>面试官：</strong>{{ round.interviewer }}</p>
                <p v-if="round.location"><strong>地点：</strong>{{ round.location }}</p>
                <p><strong>结果：</strong>
                  <a-tag :color="getRoundResultColor(round.result)">
                    {{ getRoundResultText(round.result) }}
                  </a-tag>
                </p>
                <div v-if="round.feedback" class="round-feedback">
                  <strong>反馈：</strong>
                  <div class="feedback-content">{{ round.feedback }}</div>
                </div>
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
      </a-card>
    </div>

    <div v-else class="error-container">
      <a-result
        status="404"
        title="面试流程不存在"
        sub-title="该面试流程可能已被删除或不存在"
      >
        <template #extra>
          <a-button type="primary" @click="$router.push('/interviews')">
            返回面试管理
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 编辑流程弹窗 -->
    <EditProcessModal
      v-model:visible="showEditModal"
      :process="process"
      @success="loadProcess"
    />

    <!-- 添加轮次弹窗 -->
    <a-modal
      v-model:open="showAddRoundModal"
      title="添加面试轮次"
      @ok="addRound"
      :confirm-loading="addingRound"
    >
      <a-form
        ref="roundFormRef"
        :model="roundForm"
        :rules="roundRules"
        layout="vertical"
      >
        <a-form-item label="面试类型" name="type">
          <a-select v-model:value="roundForm.type" placeholder="选择面试类型">
            <a-select-option value="phone">电话面试</a-select-option>
            <a-select-option value="video">视频面试</a-select-option>
            <a-select-option value="onsite">现场面试</a-select-option>
            <a-select-option value="technical">技术面试</a-select-option>
            <a-select-option value="hr">HR面试</a-select-option>
            <a-select-option value="final">终面</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="面试时间" name="scheduledAt">
          <a-date-picker
            v-model:value="roundForm.scheduledAt"
            format="YYYY-MM-DD"
            placeholder="选择面试时间"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="面试官" name="interviewer">
          <a-input v-model:value="roundForm.interviewer" placeholder="面试官姓名" />
        </a-form-item>
        <a-form-item label="面试地点" name="location">
          <a-input v-model:value="roundForm.location" placeholder="面试地点（线上面试可填会议室链接）" />
        </a-form-item>
        <a-form-item label="备注" name="notes">
          <a-textarea 
            v-model:value="roundForm.notes" 
            placeholder="面试相关备注"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑轮次弹窗 -->
    <a-modal
      v-model:open="showEditRoundModal"
      title="编辑面试轮次"
      @ok="updateRound"
      :confirm-loading="updatingRound"
    >
      <a-form
        ref="editRoundFormRef"
        :model="editRoundForm"
        :rules="roundRules"
        layout="vertical"
      >
        <a-form-item label="面试类型" name="type">
          <a-select v-model:value="editRoundForm.type" placeholder="选择面试类型">
            <a-select-option value="phone">电话面试</a-select-option>
            <a-select-option value="video">视频面试</a-select-option>
            <a-select-option value="onsite">现场面试</a-select-option>
            <a-select-option value="technical">技术面试</a-select-option>
            <a-select-option value="hr">HR面试</a-select-option>
            <a-select-option value="final">终面</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="面试时间" name="scheduledAt">
          <a-date-picker
            v-model:value="editRoundForm.scheduledAt"
            format="YYYY-MM-DD"
            placeholder="选择面试时间"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="面试官" name="interviewer">
          <a-input v-model:value="editRoundForm.interviewer" placeholder="面试官姓名" />
        </a-form-item>
        <a-form-item label="面试地点" name="location">
          <a-input v-model:value="editRoundForm.location" placeholder="面试地点" />
        </a-form-item>
        <a-form-item label="面试结果" name="result">
          <a-select v-model:value="editRoundForm.result" placeholder="选择面试结果">
            <a-select-option value="pending">待面试</a-select-option>
            <a-select-option value="passed">通过</a-select-option>
            <a-select-option value="failed">未通过</a-select-option>
            <a-select-option value="cancelled">已取消</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="面试反馈" name="feedback">
          <a-textarea 
            v-model:value="editRoundForm.feedback" 
            placeholder="面试反馈和评价"
            :rows="4"
          />
        </a-form-item>
        <a-form-item label="备注" name="notes">
          <a-textarea 
            v-model:value="editRoundForm.notes" 
            placeholder="其他备注"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'
import { 
  ArrowLeftOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { useInterviewStore } from '../stores/interview'
import { useCompanyStore } from '../stores/company'
import type { InterviewProcess, InterviewRound, Company } from '../types'
import EditProcessModal from '../components/EditProcessModal.vue'

const route = useRoute()
const router = useRouter()
const interviewStore = useInterviewStore()
const companyStore = useCompanyStore()

const loading = ref(true)
const process = ref<InterviewProcess | null>(null)
const company = ref<Company | null>(null)
const rounds = ref<InterviewRound[]>([])

// 弹窗状态
const showEditModal = ref(false)
const showAddRoundModal = ref(false)
const showEditRoundModal = ref(false)

// 表单状态
const addingRound = ref(false)
const updatingRound = ref(false)
const roundFormRef = ref()
const editRoundFormRef = ref()

// 添加轮次表单
const roundForm = ref({
  type: '',
  scheduledAt: null as Dayjs | null,
  interviewer: '',
  location: '',
  notes: ''
})

// 编辑轮次表单
const editRoundForm = ref({
  id: '',
  processId: '',
  round: 0,
  type: '',
  scheduledAt: null as Dayjs | null,
  interviewer: '',
  location: '',
  result: 'pending' as const,
  feedback: '',
  notes: ''
})

const roundRules = {
  type: [{ required: true, message: '请选择面试类型' }],
  scheduledAt: [{ required: true, message: '请选择面试时间' }]
}

const processId = computed(() => route.params.id as string)

// 加载面试流程详情
const loadProcess = async () => {
  try {
    loading.value = true
    await interviewStore.loadProcesses()
    await companyStore.loadCompanies()
    
    const foundProcess = interviewStore.processes.find(p => p.id === processId.value)
    if (foundProcess) {
      process.value = foundProcess
      company.value = companyStore.companies.find(c => c.id === foundProcess.companyId) || null
      rounds.value = interviewStore.rounds.filter(r => r.processId === foundProcess.id)
        .sort((a, b) => a.round - b.round)
    }
  } catch (error) {
    console.error('Failed to load process:', error)
    message.error('加载面试流程失败')
  } finally {
    loading.value = false
  }
}

// 状态相关方法
const getStatusColor = (status: string) => {
  const colors = {
    applied: 'blue',
    screening: 'orange',
    interviewing: 'processing',
    offer: 'green',
    rejected: 'red',
    withdrawn: 'default'
  }
  return colors[status as keyof typeof colors] || 'default'
}

const getStatusText = (status: string) => {
  const texts = {
    applied: '已投递',
    screening: '筛选中',
    interviewing: '面试中',
    offer: '已录用',
    rejected: '已拒绝',
    withdrawn: '已撤回'
  }
  return texts[status as keyof typeof texts] || status
}

// 轮次相关方法
const getRoundColor = (result: string) => {
  const colors = {
    pending: 'blue',
    passed: 'green',
    failed: 'red',
    cancelled: 'default'
  }
  return colors[result as keyof typeof colors] || 'blue'
}

const getRoundIcon = (result: string) => {
  const icons = {
    pending: ClockCircleOutlined,
    passed: CheckCircleOutlined,
    failed: CloseCircleOutlined,
    cancelled: ExclamationCircleOutlined
  }
  return icons[result as keyof typeof icons] || ClockCircleOutlined
}

const getRoundResultColor = (result: string) => {
  const colors = {
    pending: 'processing',
    passed: 'success',
    failed: 'error',
    cancelled: 'default'
  }
  return colors[result as keyof typeof colors] || 'processing'
}

const getRoundResultText = (result: string) => {
  const texts = {
    pending: '待面试',
    passed: '通过',
    failed: '未通过',
    cancelled: '已取消'
  }
  return texts[result as keyof typeof texts] || result
}

const formatDateTime = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 操作方法
const viewCompany = () => {
  if (company.value) {
    router.push(`/companies?company=${company.value.id}`)
  }
}

const addRound = async () => {
  try {
    await roundFormRef.value.validate()
    addingRound.value = true
    
    const newRound: Omit<InterviewRound, 'id' | 'createdAt' | 'updatedAt'> = {
      processId: processId.value,
      round: rounds.value.length + 1,
      type: roundForm.value.type,
      scheduledAt: roundForm.value.scheduledAt!.toDate(),
      interviewer: roundForm.value.interviewer,
      location: roundForm.value.location,
      result: 'pending',
      feedback: '',
      notes: roundForm.value.notes
    }
    
    await interviewStore.addRound(newRound)
    rounds.value = interviewStore.rounds.filter(r => r.processId === processId.value)
      .sort((a, b) => a.round - b.round)
    
    showAddRoundModal.value = false
    roundForm.value = {
      type: '',
      scheduledAt: null,
      interviewer: '',
      location: '',
      notes: ''
    }
    message.success('添加面试轮次成功')
  } catch (error) {
    console.error('Failed to add round:', error)
    message.error('添加面试轮次失败')
  } finally {
    addingRound.value = false
  }
}

const editRound = (round: InterviewRound) => {
  editRoundForm.value = {
    id: round.id,
    processId: round.processId,
    round: round.round,
    type: round.type,
    scheduledAt: dayjs(round.scheduledAt),
    interviewer: round.interviewer || '',
    location: round.location || '',
    result: round.result,
    feedback: round.feedback || '',
    notes: round.notes || ''
  }
  showEditRoundModal.value = true
}

const updateRound = async () => {
  try {
    await editRoundFormRef.value.validate()
    updatingRound.value = true
    
    // 检查必需字段
    if (!editRoundForm.value.id) {
      throw new Error('面试轮次ID不能为空');
    }
    if (!editRoundForm.value.scheduledAt) {
      throw new Error('面试时间不能为空');
    }
    
    const updatedRound: Partial<InterviewRound> = {
      id: editRoundForm.value.id,
      processId: editRoundForm.value.processId,
      round: editRoundForm.value.round,
      type: editRoundForm.value.type,
      scheduledAt: editRoundForm.value.scheduledAt.toDate(),
      interviewer: editRoundForm.value.interviewer,
      location: editRoundForm.value.location,
      result: editRoundForm.value.result,
      feedback: editRoundForm.value.feedback,
      notes: editRoundForm.value.notes
    }
    
    console.log('Updating round with data:', updatedRound);
    
    await interviewStore.updateRound(updatedRound)
    rounds.value = interviewStore.rounds.filter(r => r.processId === processId.value)
      .sort((a, b) => a.round - b.round)
    
    showEditRoundModal.value = false
    message.success('更新面试轮次成功')
  } catch (error) {
    console.error('Failed to update round:', error)
    message.error(`更新面试轮次失败: ${error.message || error}`)
  } finally {
    updatingRound.value = false
  }
}

const deleteRound = async (roundId: string) => {
  try {
    await interviewStore.deleteRound(roundId)
    rounds.value = interviewStore.rounds.filter(r => r.processId === processId.value)
      .sort((a, b) => a.round - b.round)
    message.success('删除面试轮次成功')
  } catch (error) {
    console.error('Failed to delete round:', error)
    message.error('删除面试轮次失败')
  }
}

const exportData = () => {
  if (!process.value) return
  
  const data = {
    process: process.value,
    company: company.value,
    rounds: rounds.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `面试流程_${process.value.position}_${process.value.companyId}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const showDeleteConfirm = () => {
  Modal.confirm({
    title: '确定删除这个面试流程吗？',
    content: '删除后将无法恢复，包括所有相关的面试轮次数据。',
    okText: '确定删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        await interviewStore.deleteProcess(processId.value)
        message.success('删除面试流程成功')
        router.push('/interviews')
      } catch (error) {
        console.error('Failed to delete process:', error)
        message.error('删除面试流程失败')
      }
    }
  })
}

onMounted(() => {
  loadProcess()
})
</script>

<style scoped>
.interview-detail {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-btn {
  margin-right: 16px;
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-content h2 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

.status-tag {
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card,
.rounds-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.company-link {
  padding: 0;
}

.notes-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.empty-rounds {
  text-align: center;
  padding: 40px 0;
}

.rounds-timeline {
  margin-top: 16px;
}

.round-item {
  margin-left: 16px;
}

.round-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.round-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 16px;
}

.round-actions {
  display: flex;
  gap: 8px;
}

.round-details {
  color: #6b7280;
  font-size: 14px;
}

.round-details p {
  margin: 4px 0;
}

.round-feedback {
  margin-top: 8px;
}

.feedback-content {
  margin-top: 4px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.round-icon {
  font-size: 16px;
}

.error-container {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
}

@media (max-width: 768px) {
  .interview-detail {
    padding: 16px;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .header-actions {
    justify-content: flex-end;
  }
}
</style>
