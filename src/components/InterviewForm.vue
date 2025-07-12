<template>
  <div class="interview-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      @submit.prevent="handleSubmit"
    >
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="$t('interviewForm.labels.company')" prop="companyId">
            <el-select
              v-model="formData.companyId"
              :placeholder="$t('interviewForm.placeholders.company')"
              filterable
              allow-create
              default-first-option
              style="width: 100%"
              @change="handleCompanyChange"
            >
              <el-option
                v-for="company in companies"
                :key="company.id"
                :label="company.name"
                :value="company.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item :label="$t('interviewForm.labels.position')" prop="position">
            <el-input
              v-model="formData.position"
              :placeholder="$t('interviewForm.placeholders.position')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="$t('interviewForm.labels.scheduledTime')" prop="scheduledTime">
            <el-date-picker
              v-model="formData.scheduledTime"
              type="datetime"
              :placeholder="$t('interviewForm.placeholders.scheduledTime')"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="6">
          <el-form-item :label="$t('interviewForm.labels.round')" prop="round">
            <el-input-number
              v-model="formData.round"
              :min="1"
              :max="10"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="6">
          <el-form-item :label="$t('interviewForm.labels.type')" prop="type">
            <el-select v-model="formData.type" :placeholder="$t('interviewForm.placeholders.type')" style="width: 100%">
              <el-option :label="$t('interviewForm.interviewTypes.onsite')" value="onsite" />
              <el-option :label="$t('interviewForm.interviewTypes.video')" value="video" />
              <el-option :label="$t('interviewForm.interviewTypes.phone')" value="phone" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="$t('interviewForm.labels.interviewer')">
            <el-input
              v-model="formData.interviewer"
              :placeholder="$t('interviewForm.placeholders.interviewer')"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item :label="$t('interviewForm.labels.expectedSalary')">
            <el-input
              v-model="formData.expectedSalary"
              :placeholder="$t('interviewForm.placeholders.expectedSalary')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="$t('interviewForm.labels.status')" prop="status">
            <el-select v-model="formData.status" :placeholder="$t('interviewForm.placeholders.status')" style="width: 100%">
              <el-option :label="$t('interviewForm.statusOptions.pending')" value="pending" />
              <el-option :label="$t('interviewForm.statusOptions.scheduled')" value="scheduled" />
              <el-option :label="$t('interviewForm.statusOptions.completed')" value="completed" />
              <el-option :label="$t('interviewForm.statusOptions.cancelled')" value="cancelled" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12" v-if="formData.status === 'completed'">
          <el-form-item :label="$t('interviewForm.labels.result')">
            <el-select v-model="formData.result" :placeholder="$t('interviewForm.placeholders.result')" style="width: 100%">
              <el-option :label="$t('interviewForm.resultOptions.passed')" value="passed" />
              <el-option :label="$t('interviewForm.resultOptions.failed')" value="failed" />
              <el-option :label="$t('interviewForm.resultOptions.pending')" value="pending" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item :label="$t('interviewForm.labels.notes')">
        <el-input
          v-model="formData.notes"
          type="textarea"
          :rows="3"
          :placeholder="$t('interviewForm.placeholders.notes')"
        />
      </el-form-item>

      <el-form-item :label="$t('interviewForm.labels.feedback')" v-if="formData.status === 'completed'">
        <el-input
          v-model="formData.feedback"
          type="textarea"
          :rows="3"
          :placeholder="$t('interviewForm.placeholders.feedback')"
        />
      </el-form-item>

      <div class="form-actions">
        <el-button @click="handleCancel">{{ $t('interviewForm.buttons.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ editMode ? $t('interviewForm.buttons.update') : $t('interviewForm.buttons.create') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'
import { useCompanyStore } from '@/stores/company'
import type { InterviewRound } from '@/types'

interface Props {
  interview?: InterviewRound
  initialDate?: Date
}

interface Emits {
  (e: 'submit', data: any): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const companyStore = useCompanyStore()
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = ref({
  companyId: '',
  position: '',
  scheduledTime: '',
  round: 1,
  type: 'video',
  interviewer: '',
  expectedSalary: '',
  status: 'scheduled',
  result: '',
  notes: '',
  feedback: ''
})

// 计算属性
const editMode = computed(() => !!props.interview)
const companies = computed(() => companyStore.companies)

// 表单验证规则
const formRules: FormRules = {
  companyId: [
    { required: true, message: t('interviewForm.validation.companyRequired'), trigger: 'change' }
  ],
  position: [
    { required: true, message: t('interviewForm.validation.positionRequired'), trigger: 'blur' }
  ],
  scheduledTime: [
    { required: true, message: t('interviewForm.validation.scheduledTimeRequired'), trigger: 'change' }
  ],
  round: [
    { required: true, message: t('interviewForm.validation.roundRequired'), trigger: 'blur' }
  ],
  type: [
    { required: true, message: t('interviewForm.validation.typeRequired'), trigger: 'change' }
  ],
  status: [
    { required: true, message: t('interviewForm.validation.statusRequired'), trigger: 'change' }
  ]
}

// 方法
const initializeForm = () => {
  if (props.interview) {
    // 编辑模式 - 填充现有数据
    formData.value = {
      companyId: props.interview.company?.id || props.interview.companyId || '',
      position: props.interview.position || '',
      scheduledTime: props.interview.scheduledTime ? 
        dayjs(props.interview.scheduledTime).format('YYYY-MM-DD HH:mm:ss') : '',
      round: props.interview.round || 1,
      type: props.interview.type || 'video',
      interviewer: props.interview.interviewer || '',
      expectedSalary: props.interview.expectedSalary?.toString() || '',
      status: props.interview.status || 'scheduled',
      result: props.interview.result || '',
      notes: props.interview.notes || '',
      feedback: props.interview.feedback || ''
    }
  } else {
    // 新增模式 - 使用默认值
    const initialTime = props.initialDate || new Date()
    formData.value = {
      companyId: '',
      position: '',
      scheduledTime: dayjs(initialTime).format('YYYY-MM-DD HH:mm:ss'),
      round: 1,
      type: 'video',
      interviewer: '',
      expectedSalary: '',
      status: 'scheduled',
      result: '',
      notes: '',
      feedback: ''
    }
  }
}

const handleCompanyChange = (companyId: string) => {
  // 如果是新创建的公司名称（字符串而非ID）
  if (companyId && !companies.value.find(c => c.id === companyId)) {
    // TODO: 创建新公司
    console.log(t('interviewForm.comments.createNewCompany') + ':', companyId)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    const submitData: any = {
      ...formData.value,
      scheduledTime: formData.value.scheduledTime ? 
        new Date(formData.value.scheduledTime).toISOString() : '',
      updatedAt: new Date().toISOString()
    }
    
    if (!editMode.value) {
      submitData.createdAt = new Date().toISOString()
    }
    
    emit('submit', submitData)
  } catch (error) {
    ElMessage.error(t('interviewForm.validation.formValidationFailed'))
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

// 监听状态变化，清空结果和反馈
watch(() => formData.value.status, (newStatus) => {
  if (newStatus !== 'completed') {
    formData.value.result = ''
    formData.value.feedback = ''
  }
})

// 生命周期
onMounted(async () => {
  await companyStore.loadCompanies()
  initializeForm()
})
</script>

<style scoped lang="scss">
.interview-form {
  .form-actions {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color-lighter);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .interview-form {
    .el-col {
      margin-bottom: 16px;
    }
    
    .form-actions {
      flex-direction: column;
      
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
