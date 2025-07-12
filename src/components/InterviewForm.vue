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
          <el-form-item label="公司" prop="companyId">
            <el-select
              v-model="formData.companyId"
              placeholder="选择公司"
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
          <el-form-item label="职位" prop="position">
            <el-input
              v-model="formData.position"
              placeholder="请输入职位名称"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="面试时间" prop="scheduledTime">
            <el-date-picker
              v-model="formData.scheduledTime"
              type="datetime"
              placeholder="选择面试时间"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="6">
          <el-form-item label="面试轮次" prop="round">
            <el-input-number
              v-model="formData.round"
              :min="1"
              :max="10"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="6">
          <el-form-item label="面试方式" prop="type">
            <el-select v-model="formData.type" placeholder="选择方式" style="width: 100%">
              <el-option label="现场面试" value="现场面试" />
              <el-option label="视频面试" value="视频面试" />
              <el-option label="电话面试" value="电话面试" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="面试官">
            <el-input
              v-model="formData.interviewer"
              placeholder="请输入面试官姓名"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="期望薪资">
            <el-input
              v-model="formData.expectedSalary"
              placeholder="如：15K-20K"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="选择状态" style="width: 100%">
              <el-option label="待确认" value="pending" />
              <el-option label="已安排" value="scheduled" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12" v-if="formData.status === 'completed'">
          <el-form-item label="面试结果">
            <el-select v-model="formData.result" placeholder="选择结果" style="width: 100%">
              <el-option label="通过" value="passed" />
              <el-option label="未通过" value="failed" />
              <el-option label="待定" value="pending" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注">
        <el-input
          v-model="formData.notes"
          type="textarea"
          :rows="3"
          placeholder="请输入面试备注或准备事项"
        />
      </el-form-item>

      <el-form-item label="反馈" v-if="formData.status === 'completed'">
        <el-input
          v-model="formData.feedback"
          type="textarea"
          :rows="3"
          placeholder="请输入面试反馈"
        />
      </el-form-item>

      <div class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ editMode ? '更新' : '创建' }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
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

const companyStore = useCompanyStore()
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = ref({
  companyId: '',
  position: '',
  scheduledTime: '',
  round: 1,
  type: '视频面试',
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
    { required: true, message: '请选择公司', trigger: 'change' }
  ],
  position: [
    { required: true, message: '请输入职位名称', trigger: 'blur' }
  ],
  scheduledTime: [
    { required: true, message: '请选择面试时间', trigger: 'change' }
  ],
  round: [
    { required: true, message: '请输入面试轮次', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择面试方式', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
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
      type: props.interview.type || '视频面试',
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
      type: '视频面试',
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
    console.log('需要创建新公司:', companyId)
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
    ElMessage.error('请检查表单填写')
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
