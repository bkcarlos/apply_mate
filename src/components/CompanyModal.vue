<template>
  <a-modal
    v-model:open="visible"
    :title="isEdit ? '编辑公司' : '新建公司'"
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
      <a-form-item label="公司名称" name="name">
        <a-input v-model:value="formData.name" placeholder="请输入公司名称" />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="所属行业" name="industry">
            <a-select v-model:value="formData.industry" placeholder="选择行业" allow-clear>
              <a-select-option value="互联网">互联网</a-select-option>
              <a-select-option value="金融">金融</a-select-option>
              <a-select-option value="电商">电商</a-select-option>
              <a-select-option value="游戏">游戏</a-select-option>
              <a-select-option value="教育">教育</a-select-option>
              <a-select-option value="医疗">医疗</a-select-option>
              <a-select-option value="汽车">汽车</a-select-option>
              <a-select-option value="房地产">房地产</a-select-option>
              <a-select-option value="制造业">制造业</a-select-option>
              <a-select-option value="咨询">咨询</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="公司规模" name="scale">
            <a-select v-model:value="formData.scale" placeholder="选择规模" allow-clear>
              <a-select-option value="0-20人">0-20人</a-select-option>
              <a-select-option value="20-100人">20-100人</a-select-option>
              <a-select-option value="100-500人">100-500人</a-select-option>
              <a-select-option value="500-1000人">500-1000人</a-select-option>
              <a-select-option value="1000-5000人">1000-5000人</a-select-option>
              <a-select-option value="5000-10000人">5000-10000人</a-select-option>
              <a-select-option value="10000人以上">10000人以上</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="公司官网" name="website">
        <a-input v-model:value="formData.website" placeholder="https://example.com" />
      </a-form-item>

      <a-form-item label="公司Logo" name="logoUrl">
        <a-input v-model:value="formData.logoUrl" placeholder="Logo图片URL" />
        <div v-if="formData.logoUrl" class="logo-preview">
          <a-avatar :src="formData.logoUrl" :size="48" />
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
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

// 是否编辑模式
const isEdit = computed(() => !!props.company);

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入公司名称', trigger: 'blur' },
  ],
  website: [
    { 
      pattern: /^https?:\/\/.+/,
      message: '请输入有效的网址，如 https://example.com',
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
      message.success('公司信息更新成功');
    } else {
      // 创建公司
      await companyStore.addCompany(companyData);
      message.success('公司创建成功');
    }

    emit('saved');
  } catch (error) {
    console.error('Failed to save company:', error);
    message.error(isEdit.value ? '更新失败' : '创建失败');
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
