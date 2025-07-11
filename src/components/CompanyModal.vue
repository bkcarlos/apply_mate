<template>
  <a-modal
    v-model:open="visible"
    :title="isEdit ? $t('pages.companies.edit') : $t('pages.companies.new')"
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
      <a-form-item :label="$t('form.companyName')" name="name">
        <a-input v-model:value="formData.name" :placeholder="$t('form.companyName')" />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('form.industry')" name="industry">
            <a-select v-model:value="formData.industry" :placeholder="$t('form.industry')" allow-clear>
              <a-select-option v-for="industry in industries" :key="industry" :value="industry">
                {{ $t(`industry.${industry}`) }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('form.scale')" name="scale">
            <a-select v-model:value="formData.scale" :placeholder="$t('form.scale')" allow-clear>
              <a-select-option v-for="scale in scales" :key="scale" :value="scale">
                {{ $t(`companyScale.${scale}`) }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item :label="$t('form.website')" name="website">
        <a-input v-model:value="formData.website" placeholder="https://example.com" />
      </a-form-item>

      <a-form-item :label="$t('form.companyLogo')" name="logoUrl">
        <a-input v-model:value="formData.logoUrl" :placeholder="$t('form.companyLogo')" />
        <div v-if="formData.logoUrl" class="logo-preview">
          <a-avatar :src="formData.logoUrl" :size="48" />
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import type { FormInstance } from '@arco-design/web-vue';
import { useCompanyStore } from '@/stores/company';
import type { Company } from '@/types';

interface Props {
  visible: boolean;
  company?: Company | null;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'saved'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const companyStore = useCompanyStore();
const formRef = ref<FormInstance>();

// 行业选项
const industries = [
  'internet', 'finance', 'ecommerce', 'gaming', 'education', 
  'healthcare', 'automotive', 'realestate', 'manufacturing', 
  'consulting', 'other'
];

// 公司规模选项
const scales = [
  'small', 'medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge', 'huge'
];

// 表单数据
const formData = reactive({
  name: '',
  industry: '',
  scale: '',
  website: '',
  logoUrl: '',
});

// 是否编辑模式
const isEdit = computed(() => !!props.company);

// 表单验证规则
const rules = {
  name: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
  ],
  website: [
    { 
      pattern: /^https?:\/\/.+/,
      message: t('validation.url'),
      trigger: 'blur'
    },
  ],
};

// 控制弹窗显示
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

// 监听弹窗打开，初始化表单
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    initForm();
  }
});

// 监听公司数据变化
watch(() => props.company, () => {
  if (props.visible) {
    initForm();
  }
});

// 初始化表单
const initForm = () => {
  if (props.company) {
    // 编辑模式，填充现有数据
    Object.assign(formData, {
      name: props.company.name,
      industry: props.company.industry || '',
      scale: props.company.scale || '',
      website: props.company.website || '',
      logoUrl: props.company.logoUrl || '',
    });
  } else {
    // 新建模式，重置表单
    Object.assign(formData, {
      name: '',
      industry: '',
      scale: '',
      website: '',
      logoUrl: '',
    });
  }
  formRef.value?.clearValidate();
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

    if (isEdit.value && props.company) {
      // 更新公司
      await companyStore.updateCompany(props.company.id, companyData);
      Message.success(t('message.success.update'));
    } else {
      // 创建公司
      await companyStore.addCompany(companyData);
      Message.success(t('message.success.add'));
    }

    emit('saved');
  } catch (error) {
    console.error('Failed to save company:', error);
    Message.error(isEdit.value ? t('message.error.update') : t('message.error.add'));
  }
};

// 取消
const handleCancel = () => {
  visible.value = false;
};
</script>

<style scoped>
.logo-preview {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}
</style>
