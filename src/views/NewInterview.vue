<template>
  <div class="new-interview">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>{{ $t('pages.interviews.new') }}</h2>
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/dashboard">{{ $t('nav.dashboard') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link to="/interviews">{{ $t('nav.interviews') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('pages.interviews.new') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>

    <!-- 表单卡片 -->
    <a-card :title="$t('pages.interviews.basicInfo')">
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <!-- 公司选择 -->
        <a-form-item :label="$t('form.company')" name="companyId">
          <a-select
            v-model:value="formData.companyId"
            :placeholder="$t('interview.selectOrCreateCompany')"
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

        <!-- 状态信息 -->
        <a-row :gutter="16">
          <a-col :span="8">
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
          <a-col :span="8">
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
          <a-col :span="8">
            <a-form-item :label="$t('form.sourceChannel')" name="sourceChannel">
              <a-select v-model:value="formData.sourceChannel" :placeholder="$t('interview.channelPlaceholder')">
                <a-select-option value="boss">{{ $t('sourceChannels.boss') }}</a-select-option>
                <a-select-option value="lagou">{{ $t('sourceChannels.lagou') }}</a-select-option>
                <a-select-option value="zhilian">{{ $t('sourceChannels.zhilian') }}</a-select-option>
                <a-select-option value="qianchengwuyou">{{ $t('sourceChannels.qianchengwuyou') }}</a-select-option>
                <a-select-option value="liepin">{{ $t('sourceChannels.liepin') }}</a-select-option>
                <a-select-option value="referral">{{ $t('sourceChannels.referral') }}</a-select-option>
                <a-select-option value="linkedin">{{ $t('sourceChannels.linkedin') }}</a-select-option>
                <a-select-option value="official">{{ $t('sourceChannels.official') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 期望薪资 -->
        <a-form-item :label="$t('interview.salaryRangePlaceholder')" name="expectedSalary">
          <a-input-group compact>
            <a-input-number
              v-model:value="formData.expectedSalary.min"
              :placeholder="$t('interview.minSalaryPlaceholder')"
              style="width: 45%"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            />
            <span style="width: 10%; text-align: center; line-height: 32px;">-</span>
            <a-input-number
              v-model:value="formData.expectedSalary.max"
              :placeholder="$t('interview.maxSalaryPlaceholder')"
              style="width: 45%"
              :min="0"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            />
          </a-input-group>
        </a-form-item>

        <!-- 备注 -->
        <a-form-item :label="$t('form.notes')" name="notes">
          <a-textarea
            v-model:value="formData.notes"
            :placeholder="$t('interview.remarksPlaceholder')"
            :rows="3"
          />
        </a-form-item>

        <!-- 操作按钮 -->
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="submitting">
              {{ $t('interview.createProcess') }}
            </a-button>
            <a-button @click="goBack">
              {{ $t('interview.cancel') }}
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
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { FormInstance, SelectProps } from 'ant-design-vue';

import { useCompanyStore } from '@/stores/company';
import { useInterviewStore } from '@/stores/interview';
import type { Company, InterviewProcess } from '@/types';
import NewCompanyModal from '@/components/NewCompanyModal.vue';

const router = useRouter();
const { t } = useI18n();
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
  status: 'applied' as any,
  conclusion: 'not_started' as any,
  sourceChannel: '',
  expectedSalary: {
    min: 0,
    max: 0,
  },
  notes: '',
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
      appliedAt: new Date(),
      updatedAt: new Date(),
      notes: formData.notes,
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
