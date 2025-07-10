<template>
  <a-modal
    v-model:open="visible"
    title="编辑面试流程"
    width="800px"
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
          <a-form-item label="岗位" name="position">
            <a-input v-model:value="formData.position" placeholder="请输入岗位名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工作城市" name="city">
            <a-input v-model:value="formData.city" placeholder="请输入工作城市" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="状态" name="status">
            <a-select v-model:value="formData.status" placeholder="选择状态">
              <a-select-option value="投递中">投递中</a-select-option>
              <a-select-option value="评估中">评估中</a-select-option>
              <a-select-option value="面试中">面试中</a-select-option>
              <a-select-option value="已发Offer">已发Offer</a-select-option>
              <a-select-option value="已拒绝">已拒绝</a-select-option>
              <a-select-option value="已结束">已结束</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="结论" name="conclusion">
            <a-select v-model:value="formData.conclusion" placeholder="选择结论">
              <a-select-option value="未开始">未开始</a-select-option>
              <a-select-option value="进行中">进行中</a-select-option>
              <a-select-option value="通过">通过</a-select-option>
              <a-select-option value="未通过">未通过</a-select-option>
              <a-select-option value="待定">待定</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="投递渠道" name="sourceChannel">
        <a-input v-model:value="formData.sourceChannel" placeholder="如：Boss直聘、内推、LinkedIn等" />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="期望薪资范围" name="expectedSalary">
            <a-input-group compact>
              <a-input-number
                v-model:value="formData.expectedSalary.min"
                placeholder="最低"
                style="width: 45%"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              />
              <span style="width: 10%; text-align: center; line-height: 32px;">-</span>
              <a-input-number
                v-model:value="formData.expectedSalary.max"
                placeholder="最高"
                style="width: 45%"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              />
            </a-input-group>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- Offer 薪资详情 -->
      <template v-if="formData.status === '已发Offer'">
        <a-divider>Offer 薪资详情</a-divider>
        <SalaryEditor
          v-model="formData.offeredSalary"
          :show-actions="false"
          @change="handleSalaryChange"
        />
      </template>

      <a-form-item label="备注" name="remarks">
        <a-textarea
          v-model:value="formData.remarks"
          placeholder="记录面试相关的备注信息"
          :rows="3"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { useInterviewStore } from '@/stores/interview';
import { SalaryCalculator } from '@/utils/salary';
import type { InterviewProcess } from '@/types';
import SalaryEditor from './SalaryEditor.vue';

interface Props {
  visible: boolean;
  process: InterviewProcess | null;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'updated'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const interviewStore = useInterviewStore();
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive({
  position: '',
  city: '',
  status: '投递中' as any,
  conclusion: '未开始' as any,
  sourceChannel: '',
  expectedSalary: {
    min: 0,
    max: 0,
  },
  offeredSalary: {
    base: 0,
    bonus: 0,
    options: '',
    total: 0,
  },
  remarks: '',
});

// 表单验证规则
const rules = {
  position: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
  ],
  city: [
    { required: true, message: '请输入工作城市', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
  conclusion: [
    { required: true, message: '请选择结论', trigger: 'change' },
  ],
  sourceChannel: [
    { required: true, message: '请输入投递渠道', trigger: 'blur' },
  ],
};

// 监听 visible 变化
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

// 监听 process 变化，初始化表单数据
watch(() => props.process, (process) => {
  if (process) {
    Object.assign(formData, {
      position: process.position,
      city: process.city,
      status: process.status,
      conclusion: process.conclusion,
      sourceChannel: process.sourceChannel,
      expectedSalary: { ...process.expectedSalary },
      offeredSalary: process.offeredSalary ? { ...process.offeredSalary } : SalaryCalculator.createDefault(),
      remarks: process.remarks || '',
    });
  }
}, { immediate: true });

// 处理薪资变化
const handleSalaryChange = (salary: any) => {
  formData.offeredSalary = salary;
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value || !props.process) return;

  try {
    await formRef.value.validate();
    
    const updates: Partial<InterviewProcess> = {
      position: formData.position,
      city: formData.city,
      status: formData.status,
      conclusion: formData.conclusion,
      sourceChannel: formData.sourceChannel,
      expectedSalary: { ...formData.expectedSalary },
      remarks: formData.remarks,
    };

    // 如果状态是已发Offer，包含薪资信息
    if (formData.status === '已发Offer') {
      updates.offeredSalary = { ...formData.offeredSalary };
    }

    await interviewStore.updateProcess(props.process.id, updates);
    message.success('更新成功');
    emit('updated');
  } catch (error) {
    console.error('Failed to update process:', error);
    message.error('更新失败');
  }
};

// 取消
const handleCancel = () => {
  visible.value = false;
};
</script>
