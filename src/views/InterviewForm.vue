<template>
  <div class="interview-form">
    <div class="form-header">
      <el-button 
        @click="$router.go(-1)" 
        :icon="ArrowLeft" 
        circle
        class="back-btn"
      />
      <h1>{{ isEdit ? $t('interviewFormView.titles.edit') : $t('interviewFormView.titles.add') }}</h1>
    </div>

    <el-form 
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="interview-form-content"
    >
      <el-card>
        <template #header>
          <span>{{ $t('interviewFormView.cardTitles.basicInfo') }}</span>
        </template>
        
        <el-form-item :label="$t('interviewFormView.labels.company')" prop="companyId">
          <el-autocomplete
            v-model="companyName"
            :fetch-suggestions="fetchCompanySuggestions"
            :placeholder="$t('interviewFormView.placeholders.company')"
            style="width: 100%"
            value-key="name"
            clearable
            @select="handleCompanySelect"
            @clear="form.companyId = ''"
          >
            <template #suffix>
              <span v-if="!form.companyId && companyName" class="new-company-hint">将自动新建</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        
        <el-form-item :label="$t('interviewFormView.labels.position')" prop="position">
          <el-input 
            v-model="form.position" 
            :placeholder="$t('interviewFormView.placeholders.position')"
          />
        </el-form-item>
        
        <el-form-item :label="$t('interviewFormView.labels.city')" prop="city">
          <el-input 
            v-model="form.city" 
            :placeholder="$t('interviewFormView.placeholders.city')"
          />
        </el-form-item>
        
        <el-form-item :label="$t('interviewFormView.labels.sourceChannel')" prop="sourceChannel">
          <el-input 
            v-model="form.sourceChannel" 
            :placeholder="$t('interviewFormView.placeholders.sourceChannel')"
          />
        </el-form-item>
        
        <el-form-item :label="$t('interviewFormView.labels.status')" prop="status">
          <el-select v-model="form.status" :placeholder="$t('interviewFormView.placeholders.status')">
            <el-option :label="$t('interviewFormView.statusOptions.applying')" value="applying" />
            <el-option :label="$t('interviewFormView.statusOptions.evaluating')" value="evaluating" />
            <el-option :label="$t('interviewFormView.statusOptions.interviewing')" value="interviewing" />
            <el-option :label="$t('interviewFormView.statusOptions.offered')" value="offered" />
            <el-option :label="$t('interviewFormView.statusOptions.rejected')" value="rejected" />
            <el-option :label="$t('interviewFormView.statusOptions.finished')" value="finished" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('interviewFormView.labels.conclusion')" prop="conclusion">
          <el-select v-model="form.conclusion" :placeholder="$t('interviewFormView.placeholders.conclusion')">
            <el-option :label="$t('interviewFormView.conclusionOptions.notStarted')" value="notStarted" />
            <el-option :label="$t('interviewFormView.conclusionOptions.inProgress')" value="inProgress" />
            <el-option :label="$t('interviewFormView.conclusionOptions.passed')" value="passed" />
            <el-option :label="$t('interviewFormView.conclusionOptions.failed')" value="failed" />
            <el-option :label="$t('interviewFormView.conclusionOptions.pending')" value="pending" />
          </el-select>
        </el-form-item>
      </el-card>

      <el-card style="margin-top: 20px;">
        <template #header>
          <span>{{ $t('interviewFormView.cardTitles.salaryInfo') }}</span>
        </template>
        
        <el-form-item :label="$t('interviewFormView.labels.expectedSalary')">
          <div class="salary-range">
            <el-input-number 
              v-model="form.expectedSalary.min"
              :min="0"
              :max="999"
              :placeholder="$t('interviewFormView.placeholders.minSalary')"
            />
            <span class="salary-separator">{{ $t('interviewFormView.salarySeparator') }}</span>
            <el-input-number 
              v-model="form.expectedSalary.max"
              :min="0"
              :max="999"
              :placeholder="$t('interviewFormView.placeholders.maxSalary')"
            />
            <span class="salary-unit">{{ $t('interviewFormView.salaryUnit') }}</span>
          </div>
        </el-form-item>
      </el-card>

      <el-card style="margin-top: 20px;">
        <template #header>
          <span>{{ $t('interviewFormView.cardTitles.remarksCard') }}</span>
        </template>
        
        <el-form-item :label="$t('interviewFormView.labels.remarks')">
          <el-input 
            v-model="form.remarks"
            type="textarea"
            :rows="4"
            :placeholder="$t('interviewFormView.placeholders.remarks')"
          />
        </el-form-item>
      </el-card>

      <div class="form-actions">
        <el-button @click="$router.go(-1)">{{ $t('interviewFormView.buttons.cancel') }}</el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit"
          :loading="loading"
        >
          {{ isEdit ? $t('interviewFormView.buttons.update') : $t('interviewFormView.buttons.create') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useInterviewStore } from '@/stores/interview';
import { useCompanyStore } from '@/stores/company';
import type { InterviewStatus, InterviewConclusion, Company } from '@/types';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const interviewStore = useInterviewStore();
const companyStore = useCompanyStore();

const formRef = ref<FormInstance>();
const loading = ref(false);
const isEdit = ref(false);

const form = reactive({
  companyId: '',
  position: '',
  city: '',
  status: 'applying' as InterviewStatus,
  conclusion: 'notStarted' as InterviewConclusion,
  sourceChannel: '',
  expectedSalary: {
    min: 0,
    max: 0
  },
  remarks: ''
});

const rules: FormRules = {
  position: [
    { required: true, message: t('interviewFormView.validation.positionRequired'), trigger: 'blur' }
  ],
  city: [
    { required: true, message: t('interviewFormView.validation.cityRequired'), trigger: 'blur' }
  ],
  status: [
    { required: true, message: t('interviewFormView.validation.statusRequired'), trigger: 'change' }
  ],
  conclusion: [
    { required: true, message: t('interviewFormView.validation.conclusionRequired'), trigger: 'change' }
  ],
  sourceChannel: [
    { required: true, message: t('interviewFormView.validation.sourceChannelRequired'), trigger: 'blur' }
  ]
};

const companyName = ref('');

const fetchCompanySuggestions = async (query: string, cb: (results: Company[]) => void) => {
  if (!query) {
    cb(companyStore.companies.slice(0, 10));
    return;
  }
  const results = await companyStore.searchCompanies(query);
  cb(results);
};

const handleCompanySelect = (item: Company) => {
  form.companyId = item.id;
  companyName.value = item.name;
};

const resolveCompanyId = async (): Promise<string> => {
  if (form.companyId) return form.companyId;
  if (!companyName.value.trim()) return '';
  // 先精确匹配
  const existing = companyStore.companies.find(
    c => c.name.toLowerCase() === companyName.value.trim().toLowerCase()
  );
  if (existing) return existing.id;
  // 不存在则自动新建
  const newCompany = await companyStore.addCompany({ name: companyName.value.trim() });
  ElMessage.success(`已新建公司「${newCompany.name}」`);
  return newCompany.id;
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  // 校验公司名
  if (!companyName.value.trim()) {
    ElMessage.warning(t('interviewFormView.validation.companyRequired'));
    return;
  }

  try {
    await formRef.value.validate();
    loading.value = true;

    const resolvedCompanyId = await resolveCompanyId();
    const data = {
      ...form,
      companyId: resolvedCompanyId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isEdit.value) {
      const id = route.params.id as string;
      await interviewStore.updateInterview(id, data);
      ElMessage.success(t('interviewFormView.messages.updateSuccess'));
    } else {
      await interviewStore.addInterview(data);
      ElMessage.success(t('interviewFormView.messages.createSuccess'));
    }

    router.push('/interviews');
  } catch (error) {
    console.error(t('interviewFormView.messages.saveFailed') + ':', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await companyStore.loadCompanies();
  const id = route.params.id as string;
  if (id) {
    isEdit.value = true;
    const interview = interviewStore.getInterviewById(id);
    if (interview) {
      Object.assign(form, interview);
      // 回填公司名
      const company = companyStore.getCompanyById(interview.companyId);
      if (company) companyName.value = company.name;
    }
  }
});
</script>

<style lang="scss" scoped>
.interview-form {
  .form-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    .back-btn {
      background-color: $bg-light;
      border-color: $border-base;
      
      &:hover {
        background-color: $primary-orange;
        border-color: $primary-orange;
        color: white;
      }
    }
    
    h1 {
      margin: 0;
      color: $color-text-primary;
    }
  }
  
  .new-company-hint {
    font-size: 11px;
    color: $primary-orange;
    white-space: nowrap;
  }

  .interview-form-content {
    max-width: 800px;
    
    .salary-range {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .salary-separator {
        color: $color-text-secondary;
      }
      
      .salary-unit {
        color: $color-text-secondary;
        font-size: 14px;
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
}
</style>
