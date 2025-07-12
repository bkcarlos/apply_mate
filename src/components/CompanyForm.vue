<template>
  <div class="company-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      @submit.prevent="handleSubmit"
    >
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="公司名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入公司名称"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="公司类型" prop="type">
            <el-select v-model="formData.type" placeholder="选择公司类型" style="width: 100%">
              <el-option label="初创公司" value="初创公司" />
              <el-option label="中小企业" value="中小企业" />
              <el-option label="大型企业" value="大型企业" />
              <el-option label="外企" value="外企" />
              <el-option label="国企" value="国企" />
              <el-option label="上市公司" value="上市公司" />
              <el-option label="独角兽" value="独角兽" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="所属行业">
            <el-select
              v-model="formData.industry"
              placeholder="选择所属行业"
              filterable
              allow-create
              style="width: 100%"
            >
              <el-option label="互联网" value="互联网" />
              <el-option label="软件开发" value="软件开发" />
              <el-option label="人工智能" value="人工智能" />
              <el-option label="金融科技" value="金融科技" />
              <el-option label="电子商务" value="电子商务" />
              <el-option label="游戏娱乐" value="游戏娱乐" />
              <el-option label="企业服务" value="企业服务" />
              <el-option label="教育培训" value="教育培训" />
              <el-option label="医疗健康" value="医疗健康" />
              <el-option label="新零售" value="新零售" />
              <el-option label="汽车交通" value="汽车交通" />
              <el-option label="房产建筑" value="房产建筑" />
              <el-option label="制造业" value="制造业" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="公司规模">
            <el-select v-model="formData.size" placeholder="选择公司规模" style="width: 100%">
              <el-option label="1-20人" value="1-20人" />
              <el-option label="20-99人" value="20-99人" />
              <el-option label="100-499人" value="100-499人" />
              <el-option label="500-999人" value="500-999人" />
              <el-option label="1000-4999人" value="1000-4999人" />
              <el-option label="5000-9999人" value="5000-9999人" />
              <el-option label="10000人以上" value="10000人以上" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="公司地址">
            <el-input
              v-model="formData.location"
              placeholder="请输入公司地址"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="官方网站">
            <el-input
              v-model="formData.website"
              placeholder="请输入官方网站地址"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="公司评分">
        <el-rate
          v-model="formData.rating"
          show-score
          text-color="#ff9900"
          score-template="{value} 分"
        />
        <el-text type="info" size="small" style="margin-left: 12px;">
          对公司的整体评价（工作环境、薪资待遇、发展前景等）
        </el-text>
      </el-form-item>

      <el-form-item label="公司介绍">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入公司介绍（业务范围、发展历程、企业文化等）"
        />
      </el-form-item>

      <el-form-item label="备注信息">
        <el-input
          v-model="formData.notes"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息（个人感受、内推渠道、面试难度等）"
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Company } from '@/types'

interface Props {
  company?: Company
}

interface Emits {
  (e: 'submit', data: any): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = ref({
  name: '',
  type: '',
  industry: '',
  size: '',
  location: '',
  website: '',
  rating: 0,
  description: '',
  notes: ''
})

// 计算属性
const editMode = computed(() => !!props.company)

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入公司名称', trigger: 'blur' },
    { min: 2, max: 50, message: '公司名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择公司类型', trigger: 'change' }
  ]
}

// 方法
const initializeForm = () => {
  if (props.company) {
    // 编辑模式 - 填充现有数据
    formData.value = {
      name: props.company.name || '',
      type: props.company.type || '',
      industry: props.company.industry || '',
      size: props.company.size || '',
      location: props.company.location || '',
      website: props.company.website || '',
      rating: props.company.rating || 0,
      description: props.company.description || '',
      notes: props.company.notes || ''
    }
  } else {
    // 新增模式 - 使用默认值
    formData.value = {
      name: '',
      type: '',
      industry: '',
      size: '',
      location: '',
      website: '',
      rating: 0,
      description: '',
      notes: ''
    }
  }
}

const validateWebsite = (website: string) => {
  if (!website) return true
  
  // 简单的URL验证
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  return urlPattern.test(website)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 验证网站URL格式
    if (formData.value.website && !validateWebsite(formData.value.website)) {
      ElMessage.error('请输入有效的网站地址')
      return
    }
    
    submitting.value = true
    
    const submitData: any = {
      ...formData.value,
      updatedAt: new Date().toISOString()
    }
    
    // 确保网站URL包含协议
    if (submitData.website && !submitData.website.startsWith('http')) {
      submitData.website = 'https://' + submitData.website
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

// 生命周期
onMounted(() => {
  initializeForm()
})
</script>

<style scoped lang="scss">
.company-form {
  .form-actions {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color-lighter);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  
  .el-rate {
    margin-bottom: 8px;
  }
}

@media (max-width: 768px) {
  .company-form {
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
