<template>
  <a-modal
    v-model:open="visible"
    :title="$t('interview.editProcess')"
    :ok-text="$t('common.save')"
    :cancel-text="$t('common.cancel')"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('form.position')" name="position">
            <a-input v-model:value="formData.position" :placeholder="$t('interview.positionPlaceholder')" />
          </a-form-item>
        </a-col>
        
        <a-col :span="12">
          <a-form-item :label="$t('form.city')" name="city">
            <a-input v-model:value="formData.city" :placeholder="$t('interview.cityPlaceholder')" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('form.status')" name="status">
            <a-select v-model:value="formData.status" :placeholder="$t('interview.statusPlaceholder')">
              <a-select-option value="applied">{{ $t('status.applied') }}</a-select-option>
              <a-select-option value="evaluating">{{ $t('status.evaluating') }}</a-select-option>
              <a-select-option value="interviewing">{{ $t('status.interviewing') }}</a-select-option>
              <a-select-option value="negotiating">{{ $t('status.negotiating') }}</a-select-option>
              <a-select-option value="offered">{{ $t('status.offered') }}</a-select-option>
              <a-select-option value="rejected">{{ $t('status.rejected') }}</a-select-option>
              <a-select-option value="closed">{{ $t('status.closed') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="$t('form.conclusion')" name="conclusion">
            <a-select v-model:value="formData.conclusion" :placeholder="$t('interview.conclusionPlaceholder')">
              <a-select-option value="not_started">{{ $t('conclusion.not_started') }}</a-select-option>
              <a-select-option value="in_progress">{{ $t('conclusion.in_progress') }}</a-select-option>
              <a-select-option value="passed">{{ $t('conclusion.passed') }}</a-select-option>
              <a-select-option value="failed">{{ $t('conclusion.failed') }}</a-select-option>
              <a-select-option value="pending">{{ $t('conclusion.pending') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item :label="$t('form.sourceChannel')" name="sourceChannel">
        <a-input v-model:value="formData.sourceChannel" :placeholder="$t('interview.channelPlaceholder')" />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('form.expectedSalary')" name="expectedSalary">
            <a-input-group compact>
              <a-input-number
                v-model:value="formData.expectedSalary.min"
                :placeholder="$t('interview.minSalary')"
                style="width: 50%"
                :min="0"
                :formatter="(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value: string) => value.replace(/\$\s?|(,*)/g, '')"
              />
              <a-input-number
                v-model:value="formData.expectedSalary.max"
                :placeholder="$t('interview.maxSalary')"
                style="width: 50%"
                :min="0"
                :formatter="(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value: string) => value.replace(/\$\s?|(,*)/g, '')"
              />
            </a-input-group>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- Offer 薪资详情 -->
      <template v-if="formData.status === 'offered'">
        <a-divider>{{ $t('interview.offerSalaryDetails') }}</a-divider>
        <SalaryEditor
          v-model="formData.offeredSalary"
          :show-buttons="false"
          :show-calculation="true"
        />
      </template>

      <a-form-item :label="$t('form.notes')" name="remarks">
        <a-textarea
          v-model:value="formData.remarks"
          :placeholder="$t('interview.remarksPlaceholder')"
          :rows="3"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FormInstance } from 'ant-design-vue';
import SalaryEditor from './SalaryEditor.vue';
import type { InterviewProcess } from '@/types';

interface Props {
  open: boolean;
  process: InterviewProcess | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'save': [process: InterviewProcess];
}>();

const { t } = useI18n();
const formRef = ref<FormInstance>();

const visible = ref(false);

// 表单数据
const formData = reactive({
  id: '',
  companyId: '',
  position: '',
  city: '',
  status: 'applied' as any,
  conclusion: 'not_started' as any,
  sourceChannel: '',
  appliedAt: new Date(),
  updatedAt: new Date(),
  expectedSalary: {
    min: 0,
    max: 0,
  },
  offeredSalary: null as any,
  remarks: '',
});

// 表单验证规则
const rules = {
  position: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
  ],
  city: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
  ],
  status: [
    { required: true, message: t('validation.required'), trigger: 'change' },
  ],
  conclusion: [
    { required: true, message: t('validation.required'), trigger: 'change' },
  ],
  sourceChannel: [
    { required: true, message: t('validation.required'), trigger: 'change' },
  ],
};

// 监听props变化
watch(() => props.open, (newVal) => {
  visible.value = newVal;
  if (newVal && props.process) {
    Object.assign(formData, {
      ...props.process,
      expectedSalary: props.process.expectedSalary || { min: 0, max: 0 },
    });
  }
});

watch(visible, (newVal) => {
  emit('update:open', newVal);
});

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    emit('save', { ...formData } as InterviewProcess);
    visible.value = false;
  } catch (error) {
    console.log('Validation failed:', error);
  }
};

// 取消
const handleCancel = () => {
  visible.value = false;
};
</script>
