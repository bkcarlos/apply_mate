<template>
  <div class="interview-detail">
    <div class="detail-header">
      <div class="header-left">
        <el-button @click="$router.back()" link>
          <el-icon><ArrowLeft /></el-icon>
          {{ $t('interview.detail.back') }}
        </el-button>
        <h3>{{ $t('interview.detail.title') }}</h3>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="editInterview">{{ $t('interview.detail.edit') }}</el-button>
        <el-button type="danger" @click="deleteInterview">{{ $t('interview.detail.delete') }}</el-button>
      </div>
    </div>

    <div v-if="interview" class="detail-content">
      <!-- 基本信息 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('interview.detail.basicInfo') }}</span>
            <el-tag 
              :type="getStatusType(interview.status)" 
              size="large"
            >
              {{ interview.status }}
            </el-tag>
          </div>
        </template>
        
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="$t('interview.detail.company')">
            {{ getCompanyName(interview.companyId) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('interview.position')">
            {{ interview.position }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('interview.detail.city')">
            {{ interview.city }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('interview.detail.sourceChannel')">
            {{ interview.sourceChannel }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('interview.detail.expectedSalary')" :span="2">
            {{ interview.expectedSalary.min }}k - {{ interview.expectedSalary.max }}k
          </el-descriptions-item>
          <el-descriptions-item v-if="interview.offeredSalary" :label="$t('interview.detail.offeredSalary')" :span="2">
            {{ interview.offeredSalary.base }}k ({{ interview.offeredSalary.total }}k{{ $t('interview.detail.totalPackage') }})
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="rounds-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('interview.detail.rounds') }}</span>
            <el-button 
              type="primary" 
              size="small" 
              @click="addRound"
            >
              {{ $t('interview.detail.addRound') }}
            </el-button>
          </div>
        </template>
        
        <div v-if="rounds.length > 0" class="rounds-list">
          <div 
            v-for="round in rounds" 
            :key="round.id" 
            class="round-item"
          >
            <div class="round-info">
              <h4>{{ round.roundName }}</h4>
              <el-tag :type="getRoundStatusType(round.status)">
                {{ round.status }}
              </el-tag>
            </div>
            <div class="round-details">
              <p><strong>{{ $t('interview.detail.interviewer') }}：</strong>{{ round.interviewer || $t('interview.detail.notScheduled') }}</p>
              <p><strong>{{ $t('interview.detail.time') }}：</strong>{{ formatDateTime(round.scheduledTime) }}</p>
              <p v-if="round.feedback"><strong>{{ $t('interview.detail.feedback') }}：</strong>{{ round.feedback }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="no-rounds">
          <p>{{ $t('interview.detail.noRounds') }}</p>
        </div>
      </el-card>
    </div>

    <div v-else class="loading">
      <el-loading />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useInterviewStore } from '@/stores/interview';
import { useRoundStore } from '@/stores/round';
import { useCompanyStore } from '@/stores/company';
import type { InterviewProcess, InterviewRound } from '@/types';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const interviewStore = useInterviewStore();
const roundStore = useRoundStore();
const companyStore = useCompanyStore();

const interview = ref<InterviewProcess | null>(null);
const rounds = ref<InterviewRound[]>([]);

const getStatusType = (status: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const types: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    'applied': 'info',
    'screening': 'warning',
    'interview': 'primary',
    'offer': 'success',
    'rejected': 'danger',
    'withdrawn': 'info'
  };
  return types[status] || 'info';
};

const getRoundStatusType = (status: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const types: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    'pending': 'info',
    'scheduled': 'primary',
    'completed': 'success',
    'cancelled': 'danger'
  };
  return types[status] || 'info';
};

const getCompanyName = (companyId: string) => {
  const company = companyStore.getCompanyById(companyId);
  return company?.name || t('interview.detail.unknownCompany');
};

const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString();
};

const editInterview = () => {
  router.push(`/interviews/${interview.value?.id}/edit`);
};

const addRound = () => {
  router.push(`/interviews/${interview.value?.id}/rounds/new`);
};

const deleteInterview = async () => {
  if (!interview.value) return;
  
  try {
    await ElMessageBox.confirm(
      t('interview.detail.deleteConfirm'),
      t('interview.detail.deleteTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    );
    
    if (interview.value) {
      // TODO: 实现删除方法
      // await interviewStore.deleteInterview(interview.value.id);
      ElMessage.success(t('interview.detail.deleteSuccess'));
      router.push('/interviews');
    }
  } catch {
    // 用户取消删除
  }
};

onMounted(async () => {
  const id = route.params.id as string;
  if (id) {
    interview.value = interviewStore.getInterviewById(id) || null;
    rounds.value = roundStore.getRoundsByProcess(id);
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.interview-detail {
  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
      
      h3 {
        margin: 0;
        color: var(--text-color);
      }
    }
  }
  
  .detail-content {
    .info-card,
    .rounds-card {
      margin-bottom: 24px;
      
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        span {
          font-weight: 600;
          color: var(--text-color);
        }
      }
    }
    
    .rounds-list {
      .round-item {
        padding: 16px;
        border: 1px solid var(--border-color-lighter);
        border-radius: 8px;
        margin-bottom: 16px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .round-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          
          h4 {
            margin: 0;
            color: var(--text-color);
          }
        }
        
        .round-details {
          p {
            margin: 8px 0;
            color: var(--text-color-secondary);
            
            strong {
              color: var(--text-color);
            }
          }
        }
      }
    }
    
    .no-rounds {
      text-align: center;
      padding: 40px;
      color: var(--text-color-placeholder);
    }
  }
  
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
  }
}
</style>
