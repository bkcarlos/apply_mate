<template>
  <div class="interview-form">
    <div class="form-header">
      <el-button 
        @click="$router.go(-1)" 
        :icon="ArrowLeft" 
        circle
        class="back-btn"
      />
      <h1>{{ isEdit ? '编辑面试流程' : '添加面试流程' }}</h1>
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
          <span>基本信息</span>
        </template>
        
        <el-form-item label="公司" prop="companyId">
          <el-select 
            v-model="form.companyId" 
            placeholder="选择公司"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="company in companies"
              :key="company.id"
              :label="company.name"
              :value="company.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="职位" prop="position">
          <el-input 
            v-model="form.position" 
            placeholder="请输入职位名称"
          />
        </el-form-item>
        
        <el-form-item label="城市" prop="city">
          <el-input 
            v-model="form.city" 
            placeholder="请输入城市"
          />
        </el-form-item>
        
        <el-form-item label="投递渠道" prop="sourceChannel">
          <el-input 
            v-model="form.sourceChannel" 
            placeholder="如：Boss直聘、拉勾网等"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="选择状态">
            <el-option label="投递中" value="投递中" />
            <el-option label="评估中" value="评估中" />
            <el-option label="面试中" value="面试中" />
            <el-option label="已发Offer" value="已发Offer" />
            <el-option label="已拒绝" value="已拒绝" />
            <el-option label="已结束" value="已结束" />
          </el-select>
        </el-form-item>

        <el-form-item label="结论" prop="conclusion">
          <el-select v-model="form.conclusion" placeholder="选择结论">
            <el-option label="未开始" value="未开始" />
            <el-option label="进行中" value="进行中" />
            <el-option label="通过" value="通过" />
            <el-option label="未通过" value="未通过" />
            <el-option label="待定" value="待定" />
          </el-select>
        </el-form-item>
      </el-card>

      <el-card style="margin-top: 20px;">
        <template #header>
          <span>薪资信息</span>
        </template>
        
        <el-form-item label="期望薪资">
          <div class="salary-range">
            <el-input-number 
              v-model="form.expectedSalary.min"
              :min="0"
              :max="999"
              placeholder="最低"
            />
            <span class="salary-separator">-</span>
            <el-input-number 
              v-model="form.expectedSalary.max"
              :min="0"
              :max="999"
              placeholder="最高"
            />
            <span class="salary-unit">k</span>
          </div>
        </el-form-item>
      </el-card>

      <el-card style="margin-top: 20px;">
        <template #header>
          <span>备注</span>
        </template>
        
        <el-form-item label="备注">
          <el-input 
            v-model="form.remarks"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-card>

      <div class="form-actions">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit"
          :loading="loading"
        >
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useInterviewStore } from '@/stores/interview';
import { useCompanyStore } from '@/stores/company';
import type { InterviewStatus, InterviewConclusion } from '@/types';

const route = useRoute();
const router = useRouter();
const interviewStore = useInterviewStore();
const companyStore = useCompanyStore();

const formRef = ref<FormInstance>();
const loading = ref(false);
const isEdit = ref(false);

const form = reactive({
  companyId: '',
  position: '',
  city: '',
  status: '投递中' as InterviewStatus,
  conclusion: '未开始' as InterviewConclusion,
  sourceChannel: '',
  expectedSalary: {
    min: 0,
    max: 0
  },
  remarks: ''
});

const rules: FormRules = {
  companyId: [
    { required: true, message: '请选择公司', trigger: 'change' }
  ],
  position: [
    { required: true, message: '请输入职位名称', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  conclusion: [
    { required: true, message: '请选择结论', trigger: 'change' }
  ],
  sourceChannel: [
    { required: true, message: '请输入投递渠道', trigger: 'blur' }
  ]
};

const companies = ref(companyStore.companies);

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    loading.value = true;
    
    const data = {
      ...form,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (isEdit.value) {
      const id = route.params.id as string;
      await interviewStore.updateInterview(id, data);
      ElMessage.success('更新成功');
    } else {
      await interviewStore.addInterview(data);
      ElMessage.success('创建成功');
    }
    
    router.push('/interviews');
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const id = route.params.id as string;
  if (id) {
    isEdit.value = true;
    const interview = interviewStore.getInterviewById(id);
    if (interview) {
      Object.assign(form, interview);
    }
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

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
