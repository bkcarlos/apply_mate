<template>
  <a-modal
    v-model:open="visible"
    :title="$t('pages.companies.newCompany')"
    width="600px"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
    >
      <a-form-item :label="$t('pages.companies.companyName')" name="name">
        <a-input v-model:value="formData.name" :placeholder="$t('pages.companies.companyNamePlaceholder')" />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('pages.companies.industry')" name="industry">
            <a-select v-model:value="formData.industry" :placeholder="$t('pages.companies.selectIndustry')">
              <a-select-option value="internet">{{ $t('pages.companies.industries.internet') }}</a-select-option>
              <a-select-option value="finance">{{ $t('pages.companies.industries.finance') }}</a-select-option>
              <a-select-option value="ecommerce">{{ $t('pages.companies.industries.ecommerce') }}</a-select-option>
              <a-select-option value="gaming">{{ $t('pages.companies.industries.gaming') }}</a-select-option>
              <a-select-option value="education">{{ $t('pages.companies.industries.education') }}</a-select-option>
              <a-select-option value="healthcare">{{ $t('pages.companies.industries.healthcare') }}</a-select-option>
              <a-select-option value="automotive">{{ $t('pages.companies.industries.automotive') }}</a-select-option>
              <a-select-option value="realestate">{{ $t('pages.companies.industries.realestate') }}</a-select-option>
              <a-select-option value="manufacturing">{{ $t('pages.companies.industries.manufacturing') }}</a-select-option>
              <a-select-option value="consulting">{{ $t('pages.companies.industries.consulting') }}</a-select-option>
              <a-select-option value="other">{{ $t('pages.companies.industries.other') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('pages.companies.companyScale')" name="scale">
            <a-select v-model:value="formData.scale" :placeholder="$t('pages.companies.selectScale')">
              <a-select-option value="small1">{{ $t('pages.companies.scales.small1') }}</a-select-option>
              <a-select-option value="small2">{{ $t('pages.companies.scales.small2') }}</a-select-option>
              <a-select-option value="medium1">{{ $t('pages.companies.scales.medium1') }}</a-select-option>
              <a-select-option value="medium2">{{ $t('pages.companies.scales.medium2') }}</a-select-option>
              <a-select-option value="large1">{{ $t('pages.companies.scales.large1') }}</a-select-option>
              <a-select-option value="large2">{{ $t('pages.companies.scales.large2') }}</a-select-option>
              <a-select-option value="xlarge">{{ $t('pages.companies.scales.xlarge') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item :label="$t('pages.companies.companyWebsite')" name="website">
        <a-input v-model:value="formData.website" :placeholder="$t('pages.companies.websitePlaceholder')" />
      </a-form-item>

      <a-form-item :label="$t('pages.companies.companyLogo')" name="logoUrl">
        <a-input v-model:value="formData.logoUrl" :placeholder="$t('pages.companies.logoPlaceholder')" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import type { FormInstance } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import { useCompanyStore } from '@/stores/company';
import type { Company } from '@/types';

interface Props {
  visible: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'created', company: Company): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const companyStore = useCompanyStore();
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive({
  name: '',
  industry: '',
  scale: '',
  website: '',
  logoUrl: '',
});

// 表单验证规则
const rules = computed(() => ({
  name: [
    { required: true, message: t('form.validation.companyNameRequired'), trigger: 'blur' },
  ],
}));

// 控制弹窗显示
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

// 监听弹窗打开，重置表单
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    resetForm();
  }
});

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    industry: '',
    scale: '',
    website: '',
    logoUrl: '',
  });
  formRef.value?.resetFields();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    
    const companyData = {
      name: formData.name,
      industry: formData.industry || undefined,
      scale: formData.scale || undefined,
      website: formData.website || undefined,
      logoUrl: formData.logoUrl || undefined,
    };

    const newCompany = await companyStore.addCompany(companyData);
    emit('created', newCompany);
    visible.value = false;
  } catch (error) {
    console.error('Failed to create company:', error);
    Message.error(t('pages.companies.createCompanyFailed'));
  }
};

// 取消
const handleCancel = () => {
  visible.value = false;
};
</script>
