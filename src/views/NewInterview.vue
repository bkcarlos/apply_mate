<template>
  <div class="new-interview">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>新建面试流程</h2>
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/dashboard">首页</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link to="/interviews">面试管理</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>新建面试流程</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>

    <!-- 表单卡片 -->
    <a-card title="基本信息">
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <!-- 公司选择 -->
        <a-form-item label="选择公司" name="companyId">
          <a-select
            v-model:value="formData.companyId"
            placeholder="选择或创建公司"
            show-search
            :filter-option="filterCompany"
            :dropdown-render="dropdownRender"
          >
            <a-select-option
              v-for="company in companies"
              :key="company.id"
              :value="company.id"
            >
              <div class="company-option">
                <a-avatar
                  v-if="company.logoUrl"
                  :src="company.logoUrl"
                  size="small"
                />
                <a-avatar v-else size="small">
                  {{ company.name.charAt(0) }}
                </a-avatar>
                <span class="company-name">{{ company.name }}</span>
                <span v-if="company.industry" class="company-industry">
                  {{ company.industry }}
                </span>
              </div>
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- 岗位信息 -->
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="岗位名称" name="position">
              <a-input v-model:value="formData.position" placeholder="如：前端开发工程师" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工作城市" name="city">
              <a-input v-model:value="formData.city" placeholder="如：北京、上海、深圳" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 状态信息 -->
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="当前状态" name="status">
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
          <a-col :span="8">
            <a-form-item label="当前结论" name="conclusion">
              <a-select v-model:value="formData.conclusion" placeholder="选择结论">
                <a-select-option value="未开始">未开始</a-select-option>
                <a-select-option value="进行中">进行中</a-select-option>
                <a-select-option value="通过">通过</a-select-option>
                <a-select-option value="未通过">未通过</a-select-option>
                <a-select-option value="待定">待定</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="投递渠道" name="sourceChannel">
              <a-select v-model:value="formData.sourceChannel" placeholder="选择或输入渠道">
                <a-select-option value="Boss直聘">Boss直聘</a-select-option>
                <a-select-option value="拉勾网">拉勾网</a-select-option>
                <a-select-option value="智联招聘">智联招聘</a-select-option>
                <a-select-option value="前程无忧">前程无忧</a-select-option>
                <a-select-option value="猎聘">猎聘</a-select-option>
                <a-select-option value="内推">内推</a-select-option>
                <a-select-option value="LinkedIn">LinkedIn</a-select-option>
                <a-select-option value="公司官网">公司官网</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 期望薪资 -->
        <a-form-item label="期望薪资范围 (年薪)" name="expectedSalary">
          <a-input-group compact>
            <a-input-number
              v-model:value="formData.expectedSalary.min"
              placeholder="最低薪资"
              style="width: 45%"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            />
            <span style="width: 10%; text-align: center; line-height: 32px;">-</span>
            <a-input-number
              v-model:value="formData.expectedSalary.max"
              placeholder="最高薪资"
              style="width: 45%"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            />
          </a-input-group>
        </a-form-item>

        <!-- 备注 -->
        <a-form-item label="备注信息" name="remarks">
          <a-textarea
            v-model:value="formData.remarks"
            placeholder="记录相关的备注信息，如职位要求、公司情况等"
            :rows="3"
          />
        </a-form-item>

        <!-- 操作按钮 -->
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="submitting">
              创建面试流程
            </a-button>
            <a-button @click="goBack">
              取消
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 新建公司弹窗 -->
    <NewCompanyModal
      v-model:visible="newCompanyModalVisible"
      @created="handleCompanyCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { FormInstance, SelectProps } from 'ant-design-vue';

import { useCompanyStore } from '@/stores/company';
import { useInterviewStore } from '@/stores/interview';
import type { Company, InterviewProcess } from '@/types';
import NewCompanyModal from '@/components/NewCompanyModal.vue';

const router = useRouter();
const companyStore = useCompanyStore();
const interviewStore = useInterviewStore();

const formRef = ref<FormInstance>();
const submitting = ref(false);
const newCompanyModalVisible = ref(false);

// 表单数据
const formData = reactive({
  companyId: '',
  position: '',
  city: '',
  status: '投递中' as any,
  conclusion: '未开始' as any,
  sourceChannel: '',
  expectedSalary: {
    min: 0,
    max: 0,
  },
  remarks: '',
});

// 表单验证规则
const rules = {
  companyId: [
    { required: true, message: '请选择公司', trigger: 'change' },
  ],
  position: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
  ],
  city: [
    { required: true, message: '请输入工作城市', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择当前状态', trigger: 'change' },
  ],
  conclusion: [
    { required: true, message: '请选择当前结论', trigger: 'change' },
  ],
  sourceChannel: [
    { required: true, message: '请选择投递渠道', trigger: 'change' },
  ],
};

// 计算属性
const companies = ref<Company[]>([]);

// 公司筛选
const filterCompany: SelectProps['filterOption'] = (input, option) => {
  const company = companies.value.find(c => c.id === option?.value);
  if (!company) return false;
  return company.name.toLowerCase().includes(input.toLowerCase()) ||
         (company.industry && company.industry.toLowerCase().includes(input.toLowerCase()));
};

// 自定义下拉渲染，添加"新建公司"选项
const dropdownRender: SelectProps['dropdownRender'] = ({ menuNode }) => {
  return h('div', [
    menuNode,
    h('div', { style: 'border-top: 1px solid #e8e8e8; padding: 8px; cursor: pointer;' }, [
      h('div', {
        style: 'display: flex; align-items: center; color: #1890ff;',
        onClick: () => {
          newCompanyModalVisible.value = true;
        }
      }, [
        h(PlusOutlined, { style: 'margin-right: 8px;' }),
        '新建公司'
      ])
    ])
  ]);
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitting.value = true;

    const processData: Omit<InterviewProcess, 'id' | 'createTime' | 'updateTime'> = {
      companyId: formData.companyId,
      position: formData.position,
      city: formData.city,
      status: formData.status,
      conclusion: formData.conclusion,
      sourceChannel: formData.sourceChannel,
      expectedSalary: { ...formData.expectedSalary },
      remarks: formData.remarks,
    };

    const newProcess = await interviewStore.addProcess(processData);
    message.success('面试流程创建成功');
    
    // 跳转到详情页
    router.push(`/interviews/${newProcess.id}`);
  } catch (error) {
    console.error('Failed to create process:', error);
    message.error('创建失败');
  } finally {
    submitting.value = false;
  }
};

// 返回
const goBack = () => {
  router.go(-1);
};

// 处理公司创建成功
const handleCompanyCreated = (company: Company) => {
  companies.value.push(company);
  formData.companyId = company.id;
  newCompanyModalVisible.value = false;
  message.success('公司创建成功');
};

// 加载数据
const loadData = async () => {
  try {
    await companyStore.loadCompanies();
    companies.value = companyStore.companies;
  } catch (error) {
    message.error('加载公司数据失败');
    console.error('Failed to load companies:', error);
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.new-interview {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.header-left h2 {
  margin: 0;
  color: #262626;
  font-size: 20px;
  font-weight: 500;
}

.company-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.company-name {
  font-weight: 500;
}

.company-industry {
  color: #999;
  font-size: 12px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}
</style>
