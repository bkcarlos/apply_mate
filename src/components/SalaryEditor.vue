<template>
  <div class="salary-editor">
    <a-form :model="salaryData" layout="vertical" @finish="handleSubmit">
      <!-- 基础月薪 -->
      <a-form-item
        :label="$t('form.baseSalary')"
        name="base"
        :rules="[{ required: true, message: $t('validation.required') }]"
      >
        <a-input-number
          v-model:value="salaryData.base"
          style="width: 100%"
          :min="0"
          :step="1000"
          :formatter="(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value: string) => value.replace(/\$\s?|(,*)/g, '')"
          :placeholder="$t('salaryEditor.baseSalaryPlaceholder')"
        />
      </a-form-item>

      <!-- 年终奖月数 -->
      <a-form-item
        :label="$t('form.yearEndMonths')"
        name="yearEndMonths"
        :rules="[{ required: true, message: $t('validation.required') }]"
      >
        <a-input-number
          v-model:value="salaryData.yearEndMonths"
          style="width: 100%"
          :min="0"
          :max="24"
          :step="0.5"
          :placeholder="$t('salaryEditor.yearEndMonthsPlaceholder')"
        />
        <div class="form-help">
          {{ $t('salaryEditor.yearEndMonthsHelp') }}
        </div>
      </a-form-item>

      <!-- 过去大多数月数 -->
      <a-form-item
        :label="$t('form.typicalMonths')"
        name="typicalMonths"
        :rules="[
          { required: true, message: $t('validation.required') },
          { validator: validateTypicalMonths }
        ]"
      >
        <a-input-number
          v-model:value="salaryData.typicalMonths"
          style="width: 100%"
          :min="0"
          :max="24"
          :step="0.5"
          :placeholder="$t('salaryEditor.typicalMonthsPlaceholder')"
        />
        <div class="form-help">
          {{ $t('salaryEditor.typicalMonthsHelp') }}
        </div>
      </a-form-item>

      <!-- 保底月数 -->
      <a-form-item
        :label="$t('form.guaranteedMonths')"
        name="guaranteedMonths"
        :rules="[
          { required: true, message: $t('validation.required') },
          { validator: validateGuaranteedMonths }
        ]"
      >
        <a-input-number
          v-model:value="salaryData.guaranteedMonths"
          style="width: 100%"
          :min="0"
          :max="24"
          :step="0.5"
          :placeholder="$t('salaryEditor.guaranteedMonthsPlaceholder')"
        />
        <div class="form-help">
          {{ $t('salaryEditor.guaranteedMonthsHelp') }}
        </div>
      </a-form-item>

      <!-- 计算结果展示 -->
      <a-card v-if="showCalculation" :title="$t('salaryEditor.calculationResult')" size="small" class="calculation-card">
        <a-descriptions :column="1" size="small">
          <a-descriptions-item :label="$t('salaryEditor.minPackage')">
            <span class="amount">{{ formatSalary(calculationResult.minimum) }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('salaryEditor.typicalPackage')">
            <span class="amount">{{ formatSalary(calculationResult.typical) }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('salaryEditor.maxPackage')">
            <span class="amount">{{ formatSalary(calculationResult.maximum) }}</span>
          </a-descriptions-item>
        </a-descriptions>
        
        <div class="salary-range">
          <strong>{{ $t('salaryEditor.salaryRange') }}：</strong>
          {{ getSalaryRangeText() }}
        </div>
      </a-card>

      <!-- 操作按钮 -->
      <a-form-item v-if="showButtons">
        <a-space>
          <a-button @click="handleReset">
            {{ $t('common.reset') }}
          </a-button>
          <a-button @click="handleCancel">
            {{ $t('common.cancel') }}
          </a-button>
          <a-button type="primary" html-type="submit">
            {{ submitText }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { SalaryCalculator } from '@/utils/salary';
import type { SalaryInfo } from '@/types';

// Props
interface Props {
  modelValue?: SalaryInfo | null;
  showButtons?: boolean;
  showCalculation?: boolean;
  submitText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  showButtons: true,
  showCalculation: true,
  submitText: '',
});

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: SalaryInfo];
  'submit': [value: SalaryInfo];
  'cancel': [];
  'reset': [];
}>();

const { t } = useI18n();

// 动态计算 submitText
const submitText = computed(() => {
  return props.submitText || t('common.confirm');
});

// 薪资数据
const salaryData = reactive<SalaryInfo>({
  base: 0,
  yearEndMonths: 0,
  guaranteedMonths: 0,
  typicalMonths: 0,
});

// 计算结果
const calculationResult = computed(() => {
  const calc = SalaryCalculator.getFullCalculation(salaryData);
  return {
    minimum: calc.minTotal,
    typical: calc.typicalTotal,
    maximum: calc.maxTotal,
  };
});

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    Object.assign(salaryData, newValue);
  }
}, { immediate: true });

// 计算年包
watch(salaryData, () => {
  emit('update:modelValue', { ...salaryData });
}, { deep: true });

// 发出变化事件
const emitChange = () => {
  emit('update:modelValue', { ...salaryData });
};

// 格式化薪资
const formatSalary = (amount: number) => {
  return SalaryCalculator.formatSalary(amount);
};

// 获取薪资范围文本
const getSalaryRangeText = () => {
  return SalaryCalculator.getSalaryRangeText(salaryData);
};

// 验证函数
const validateTypicalMonths = (rule: any, value: number) => {
  if (value < salaryData.guaranteedMonths) {
    return Promise.reject(t('salaryEditor.typicalLessThanGuaranteed'));
  }
  if (value > salaryData.yearEndMonths) {
    return Promise.reject(t('salaryEditor.typicalMoreThanYearEnd'));
  }
  return Promise.resolve();
};

const validateGuaranteedMonths = (rule: any, value: number) => {
  if (value > salaryData.typicalMonths) {
    return Promise.reject(t('salaryEditor.guaranteedMoreThanTypical'));
  }
  return Promise.resolve();
};

// 事件处理
const handleSubmit = () => {
  emit('submit', { ...salaryData });
};

const handleReset = () => {
  Object.assign(salaryData, {
    base: 0,
    yearEndMonths: 0,
    guaranteedMonths: 0,
    typicalMonths: 0,
  });
  emit('reset');
};

const handleCancel = () => {
  emit('cancel');
};

// 监听数据变化，自动计算
watch(salaryData, emitChange, { deep: true });
</script>

<style scoped>
.salary-editor {
  width: 100%;
}

.calculation-card {
  margin-top: 16px;
  background: #f8f9fa;
}

.amount {
  font-weight: 600;
  color: #52c41a;
}

.salary-range {
  margin-top: 12px;
  padding: 8px;
  background: #e6f7ff;
  border-radius: 4px;
  font-size: 14px;
}

.form-help {
  margin-top: 4px;
  color: #999;
  font-size: 12px;
  line-height: 1.4;
}
</style>
