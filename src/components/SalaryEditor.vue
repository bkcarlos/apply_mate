<template>
  <div class="salary-editor">
    <a-form layout="vertical" :model="salaryData" @finish="handleSubmit">
      
      <!-- 基础月薪 -->
      <a-form-item 
        label="基础月薪" 
        name="base"
        :rules="[{ required: true, message: '请输入基础月薪' }]"
      >
        <a-input-number
          v-model:value="salaryData.base"
          :min="0"
          :step="1000"
          :formatter="value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="value => value.replace(/¥\s?|(,*)/g, '')"
          placeholder="请输入基础月薪"
          style="width: 100%"
          @change="calculateTotals"
        />
      </a-form-item>

      <!-- 年终奖月数 -->
      <a-form-item 
        label="年终奖月数" 
        name="yearEndMonths"
        :rules="[{ required: true, message: '请输入年终奖月数' }]"
      >
        <a-input-number
          v-model:value="salaryData.yearEndMonths"
          :min="0"
          :max="24"
          :step="0.5"
          :precision="1"
          placeholder="理想情况下年终奖月数"
          style="width: 100%"
          @change="calculateTotals"
        />
        <div class="field-description">
          公司最高年终奖或理想情况下的月数
        </div>
      </a-form-item>

      <!-- 过去大多数月数 -->
      <a-form-item 
        label="过去大多数月数" 
        name="typicalMonths"
        :rules="[
          { required: true, message: '请输入过去大多数月数' },
          { validator: validateTypicalMonths }
        ]"
      >
        <a-input-number
          v-model:value="salaryData.typicalMonths"
          :min="0"
          :max="salaryData.yearEndMonths || 24"
          :step="0.5"
          :precision="1"
          placeholder="过去大多数员工拿到的年终月数"
          style="width: 100%"
          @change="calculateTotals"
        />
        <div class="field-description">
          根据了解到的情况，大多数员工实际拿到的年终月数
        </div>
      </a-form-item>

      <!-- 保底月数 -->
      <a-form-item 
        label="保底月数" 
        name="guaranteedMonths"
        :rules="[
          { required: true, message: '请输入保底月数' },
          { validator: validateGuaranteedMonths }
        ]"
      >
        <a-input-number
          v-model:value="salaryData.guaranteedMonths"
          :min="0"
          :max="salaryData.typicalMonths || 24"
          :step="0.5"
          :precision="1"
          placeholder="公司承诺的保底年终月数"
          style="width: 100%"
          @change="calculateTotals"
        />
        <div class="field-description">
          公司明确承诺或合同规定的最低年终月数
        </div>
      </a-form-item>

      <!-- 计算结果展示 -->
      <a-card v-if="showCalculation" title="薪资计算结果" size="small" class="calculation-card">
        <a-descriptions :column="1" size="small">
          <a-descriptions-item label="年包最小值 (保底)">
            <span class="salary-amount min">¥{{ formatSalary(calculatedSalary.minTotal) }}</span>
            <span class="salary-formula">{{ salaryData.base }} × (12 + {{ salaryData.guaranteedMonths }})</span>
          </a-descriptions-item>
          
          <a-descriptions-item label="年包典型值 (大多数)">
            <span class="salary-amount typical">¥{{ formatSalary(calculatedSalary.typicalTotal) }}</span>
            <span class="salary-formula">{{ salaryData.base }} × (12 + {{ salaryData.typicalMonths }})</span>
          </a-descriptions-item>
          
          <a-descriptions-item label="年包最大值 (理想)">
            <span class="salary-amount max">¥{{ formatSalary(calculatedSalary.maxTotal) }}</span>
            <span class="salary-formula">{{ salaryData.base }} × (12 + {{ salaryData.yearEndMonths }})</span>
          </a-descriptions-item>
        </a-descriptions>
        
        <div class="salary-range">
          <strong>薪资范围：</strong>
          <span class="range-text">{{ getSalaryRangeText() }}</span>
        </div>
      </a-card>

      <!-- 操作按钮 -->
      <a-form-item v-if="showActions" class="action-buttons">
        <a-space>
          <a-button type="primary" html-type="submit" :loading="loading">
            {{ submitText }}
          </a-button>
          <a-button @click="handleReset" v-if="showReset">
            重置
          </a-button>
          <a-button @click="handleCancel" v-if="showCancel">
            取消
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { SalaryCalculator } from '../utils/salary'
import type { SalaryInfo } from '../types'

interface Props {
  modelValue?: SalaryInfo
  readonly?: boolean
  showActions?: boolean
  showReset?: boolean
  showCancel?: boolean
  submitText?: string
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: SalaryInfo): void
  (e: 'submit', value: SalaryInfo): void
  (e: 'cancel'): void
  (e: 'change', value: SalaryInfo): void
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  showActions: true,
  showReset: true,
  showCancel: false,
  submitText: '确定',
  loading: false
})

const emit = defineEmits<Emits>()

// 薪资数据
const salaryData = ref<SalaryInfo>({
  base: 0,
  yearEndMonths: 3,
  guaranteedMonths: 1,
  typicalMonths: 2
})

// 计算结果
const calculatedSalary = ref({
  minTotal: 0,
  typicalTotal: 0,
  maxTotal: 0
})

// 是否显示计算结果
const showCalculation = computed(() => {
  return salaryData.value.base > 0
})

// 初始化数据
onMounted(() => {
  if (props.modelValue) {
    salaryData.value = { ...props.modelValue }
    calculateTotals()
  }
})

// 监听外部数据变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    salaryData.value = { ...newValue }
    calculateTotals()
  }
}, { deep: true })

// 计算年包
const calculateTotals = () => {
  if (salaryData.value.base > 0) {
    calculatedSalary.value = {
      minTotal: SalaryCalculator.calculateMinTotal(salaryData.value),
      typicalTotal: SalaryCalculator.calculateTypicalTotal(salaryData.value),
      maxTotal: SalaryCalculator.calculateMaxTotal(salaryData.value)
    }
    
    // 发出变化事件
    emit('update:modelValue', salaryData.value)
    emit('change', salaryData.value)
  }
}

// 格式化薪资
const formatSalary = (amount: number) => {
  return SalaryCalculator.formatSalary(amount)
}

// 获取薪资范围文本
const getSalaryRangeText = () => {
  return SalaryCalculator.getSalaryRangeText(salaryData.value)
}

// 验证函数
const validateTypicalMonths = async (_rule: any, value: number) => {
  if (value < salaryData.value.guaranteedMonths) {
    return Promise.reject('大多数月数不能小于保底月数')
  }
  if (value > salaryData.value.yearEndMonths) {
    return Promise.reject('大多数月数不能大于年终奖月数')
  }
  return Promise.resolve()
}

const validateGuaranteedMonths = async (_rule: any, value: number) => {
  if (value > salaryData.value.typicalMonths) {
    return Promise.reject('保底月数不能大于大多数月数')
  }
  return Promise.resolve()
}

// 事件处理
const handleSubmit = () => {
  const validation = SalaryCalculator.validate(salaryData.value)
  if (validation.valid) {
    emit('submit', salaryData.value)
  }
}

const handleReset = () => {
  salaryData.value = SalaryCalculator.createDefault()
  calculateTotals()
}

const handleCancel = () => {
  emit('cancel')
}

// 监听数据变化，自动计算
watch(salaryData, () => {
  calculateTotals()
}, { deep: true })
</script>

<style scoped>
.salary-editor {
  max-width: 500px;
}

.field-description {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  line-height: 1.4;
}

.calculation-card {
  margin: 16px 0;
  background: #f8f9fa;
}

.salary-amount {
  font-weight: 600;
  font-size: 16px;
  margin-right: 12px;
}

.salary-amount.min {
  color: #fa8c16;
}

.salary-amount.typical {
  color: #1890ff;
}

.salary-amount.max {
  color: #52c41a;
}

.salary-formula {
  font-size: 12px;
  color: #999;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.salary-range {
  margin-top: 12px;
  padding: 8px 12px;
  background: #e6f7ff;
  border-left: 3px solid #1890ff;
  border-radius: 4px;
}

.range-text {
  font-family: monospace;
  font-weight: 600;
  color: #1890ff;
}

.action-buttons {
  margin-top: 24px;
  text-align: center;
}

:deep(.ant-descriptions-item-label) {
  color: #666;
  font-weight: 500;
}

:deep(.ant-input-number) {
  width: 100%;
}
</style>
