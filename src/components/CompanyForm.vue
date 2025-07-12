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
          <el-form-item :label="$t('companyForm.labels.name')" prop="name">
            <el-input
              v-model="formData.name"
              :placeholder="$t('companyForm.placeholders.name')"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item :label="$t('companyForm.labels.type')" prop="type">
            <el-select v-model="formData.type" :placeholder="$t('companyForm.placeholders.type')" style="width: 100%">
              <el-option :label="$t('companyForm.companyTypes.startup')" value="startup" />
              <el-option :label="$t('companyForm.companyTypes.sme')" value="sme" />
              <el-option :label="$t('companyForm.companyTypes.large')" value="large" />
              <el-option :label="$t('companyForm.companyTypes.foreign')" value="foreign" />
              <el-option :label="$t('companyForm.companyTypes.stateOwned')" value="stateOwned" />
              <el-option :label="$t('companyForm.companyTypes.listed')" value="listed" />
              <el-option :label="$t('companyForm.companyTypes.unicorn')" value="unicorn" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="$t('companyForm.labels.industry')">
            <el-select
              v-model="formData.industry"
              :placeholder="$t('companyForm.placeholders.industry')"
              filterable
              allow-create
              style="width: 100%"
            >
              <el-option :label="$t('companyForm.industries.internet')" value="internet" />
              <el-option :label="$t('companyForm.industries.software')" value="software" />
              <el-option :label="$t('companyForm.industries.ai')" value="ai" />
              <el-option :label="$t('companyForm.industries.fintech')" value="fintech" />
              <el-option :label="$t('companyForm.industries.ecommerce')" value="ecommerce" />
              <el-option :label="$t('companyForm.industries.gaming')" value="gaming" />
              <el-option :label="$t('companyForm.industries.enterprise')" value="enterprise" />
              <el-option :label="$t('companyForm.industries.education')" value="education" />
              <el-option :label="$t('companyForm.industries.healthcare')" value="healthcare" />
              <el-option :label="$t('companyForm.industries.retail')" value="retail" />
              <el-option :label="$t('companyForm.industries.automotive')" value="automotive" />
              <el-option :label="$t('companyForm.industries.realestate')" value="realestate" />
              <el-option :label="$t('companyForm.industries.manufacturing')" value="manufacturing" />
              <el-option :label="$t('companyForm.industries.other')" value="other" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item :label="$t('companyForm.labels.size')">
            <el-select v-model="formData.size" :placeholder="$t('companyForm.placeholders.size')" style="width: 100%">
              <el-option :label="$t('companyForm.companySizes.tiny')" value="tiny" />
              <el-option :label="$t('companyForm.companySizes.small')" value="small" />
              <el-option :label="$t('companyForm.companySizes.medium')" value="medium" />
              <el-option :label="$t('companyForm.companySizes.large')" value="large" />
              <el-option :label="$t('companyForm.companySizes.xlarge')" value="xlarge" />
              <el-option :label="$t('companyForm.companySizes.xxlarge')" value="xxlarge" />
              <el-option :label="$t('companyForm.companySizes.huge')" value="huge" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="$t('companyForm.labels.location')">
            <el-input
              v-model="formData.location"
              :placeholder="$t('companyForm.placeholders.location')"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item :label="$t('companyForm.labels.website')">
            <el-input
              v-model="formData.website"
              :placeholder="$t('companyForm.placeholders.website')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item :label="$t('companyForm.labels.rating')">
        <el-rate
          v-model="formData.rating"
          show-score
          text-color="#ff9900"
          :score-template="$t('companyForm.ratingTemplate')"
        />
        <el-text type="info" size="small" style="margin-left: 12px;">
          {{ $t('companyForm.ratingHint') }}
        </el-text>
      </el-form-item>

      <el-form-item :label="$t('companyForm.labels.description')">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          :placeholder="$t('companyForm.placeholders.description')"
        />
      </el-form-item>

      <el-form-item :label="$t('companyForm.labels.notes')">
        <el-input
          v-model="formData.notes"
          type="textarea"
          :rows="3"
          :placeholder="$t('companyForm.placeholders.notes')"
        />
      </el-form-item>

      <div class="form-actions">
        <el-button @click="handleCancel">{{ $t('companyForm.buttons.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ editMode ? $t('companyForm.buttons.update') : $t('companyForm.buttons.create') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
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
const { t } = useI18n()

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
    { required: true, message: t('companyForm.validation.nameRequired'), trigger: 'blur' },
    { min: 2, max: 50, message: t('companyForm.validation.nameLength'), trigger: 'blur' }
  ],
  type: [
    { required: true, message: t('companyForm.validation.typeRequired'), trigger: 'change' }
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
      ElMessage.error(t('companyForm.validation.invalidWebsite'))
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
    ElMessage.error(t('companyForm.validation.formValidationFailed'))
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
