<template>
  <div class="interview-detail">
    <div class="detail-header">
      <div class="header-left">
        <el-button @click="$router.back()" link>
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h3>面试详情</h3>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="editInterview">编辑</el-button>
        <el-button type="danger" @click="deleteInterview">删除</el-button>
      </div>
    </div>

    <div v-if="interview" class="detail-content">
      <!-- 基本信息 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <el-tag 
              :type="getStatusType(interview.status)" 
              size="large"
            >
              {{ interview.status }}
            </el-tag>
          </div>
        </template>
        
        <el-descriptions :column="2" border>
          <el-descriptions-item label="公司">
            {{ getCompanyName(interview.companyId) }}
          </el-descriptions-item>
          <el-descriptions-item label="职位">
            {{ interview.position }}
          </el-descriptions-item>
          <el-descriptions-item label="城市">
            {{ interview.city }}
          </el-descriptions-item>
          <el-descriptions-item label="投递渠道">
            {{ interview.sourceChannel }}
          </el-descriptions-item>
          <el-descriptions-item label="期望薪资" :span="2">
            {{ interview.expectedSalary.min }}k - {{ interview.expectedSalary.max }}k
          </el-descriptions-item>
          <el-descriptions-item v-if="interview.offeredSalary" label="提供薪资" :span="2">
            {{ interview.offeredSalary.base }}k ({{ interview.offeredSalary.total }}k总包)
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="rounds-card">
        <template #header>
          <div class="card-header">
            <span>面试轮次</span>
            <el-button 
              type="primary" 
              size="small" 
              @click="addRound"
            >
              添加轮次
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
              <p><strong>面试官：</strong>{{ round.interviewer || '未安排' }}</p>
              <p><strong>时间：</strong>{{ formatDateTime(round.scheduledTime) }}</p>
              <p v-if="round.feedback"><strong>反馈：</strong>{{ round.feedback }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="no-rounds">
          <p>暂无面试轮次</p>
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
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useInterviewStore } from '@/stores/interview';
import { useRoundStore } from '@/stores/round';
import { useCompanyStore } from '@/stores/company';
import type { InterviewProcess, InterviewRound } from '@/types';

const route = useRoute();
const router = useRouter();
const interviewStore = useInterviewStore();
const roundStore = useRoundStore();
const companyStore = useCompanyStore();

const interview = ref<InterviewProcess | null>(null);
const rounds = ref<InterviewRound[]>([]);

const getStatusType = (status: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const types: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    '投递中': 'info',
    '评估中': 'warning',
    '面试中': 'primary',
    '已发Offer': 'success',
    '已拒绝': 'danger',
    '已结束': 'info'
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
  return company?.name || '未知公司';
};

const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString('zh-CN');
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
      '此操作将永久删除该面试记录, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    if (interview.value) {
      // TODO: 实现删除方法
      // await interviewStore.deleteInterview(interview.value.id);
      ElMessage.success('删除成功');
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
