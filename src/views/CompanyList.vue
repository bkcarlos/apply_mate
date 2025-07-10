<template>
  <div class="company-list">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>公司库</h2>
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>公司库</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="showNewCompanyModal">
          <PlusOutlined />
          新建公司
        </a-button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <a-card class="filter-card" size="small">
      <a-form layout="inline" :model="filters">
        <a-form-item label="行业">
          <a-select
            v-model:value="filters.industry"
            placeholder="选择行业"
            style="width: 150px"
            allow-clear
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="industry in industries" :key="industry" :value="industry">
              {{ industry }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="规模">
          <a-select
            v-model:value="filters.scale"
            placeholder="选择规模"
            style="width: 150px"
            allow-clear
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="scale in scales" :key="scale" :value="scale">
              {{ scale }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="公司名称">
          <a-input
            v-model:value="filters.name"
            placeholder="搜索公司名称"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>

        <a-form-item>
          <a-button @click="resetFilters">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 公司卡片列表 -->
    <a-row :gutter="[16, 16]">
      <a-col
        v-for="company in filteredCompanies"
        :key="company.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <a-card
          class="company-card"
          hoverable
          @click="viewCompanyDetail(company)"
        >
          <template #cover>
            <div class="company-cover">
              <a-avatar
                v-if="company.logoUrl"
                :src="company.logoUrl"
                :size="64"
              />
              <a-avatar v-else :size="64" class="company-avatar">
                {{ company.name.charAt(0) }}
              </a-avatar>
            </div>
          </template>

          <template #actions>
            <EditOutlined @click.stop="editCompany(company)" />
            <a-popconfirm
              title="确定要删除这个公司吗？"
              @confirm="deleteCompany(company)"
              @click.stop
            >
              <DeleteOutlined />
            </a-popconfirm>
          </template>

          <a-card-meta>
            <template #title>
              <div class="company-title">
                {{ company.name }}
              </div>
            </template>
            <template #description>
              <div class="company-info">
                <div v-if="company.industry" class="info-item">
                  <BankOutlined />
                  <span>{{ company.industry }}</span>
                </div>
                <div v-if="company.scale" class="info-item">
                  <TeamOutlined />
                  <span>{{ company.scale }}</span>
                </div>
                <div v-if="company.website" class="info-item">
                  <LinkOutlined />
                  <a :href="company.website" target="_blank" @click.stop>
                    访问官网
                  </a>
                </div>
                <div class="info-item">
                  <CalendarOutlined />
                  <span>{{ formatDate(company.createTime) }}</span>
                </div>
              </div>

              <!-- 面试流程统计 -->
              <div class="interview-stats">
                <a-tag color="blue">
                  {{ getInterviewCount(company.id) }} 个面试流程
                </a-tag>
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>

    <!-- 空状态 -->
    <a-empty v-if="filteredCompanies.length === 0" description="暂无公司数据">
      <a-button type="primary" @click="showNewCompanyModal">
        立即创建
      </a-button>
    </a-empty>

    <!-- 新建/编辑公司弹窗 -->
    <CompanyModal
      v-model:visible="companyModalVisible"
      :company="editingCompany"
      @saved="handleCompanySaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  TeamOutlined,
  LinkOutlined,
  CalendarOutlined,
} from '@ant-design/icons-vue';

import { useCompanyStore } from '@/stores/company';
import { useInterviewStore } from '@/stores/interview';
import type { Company } from '@/types';
import CompanyModal from '@/components/CompanyModal.vue';

const router = useRouter();
const companyStore = useCompanyStore();
const interviewStore = useInterviewStore();

// 状态
const loading = ref(false);
const companyModalVisible = ref(false);
const editingCompany = ref<Company | null>(null);

// 筛选条件
const filters = ref({
  industry: '',
  scale: '',
  name: '',
});

// 行业和规模选项
const industries = ['互联网', '金融', '电商', '游戏', '教育', '医疗', '汽车', '房地产', '制造业', '咨询', '其他'];
const scales = ['0-20人', '20-100人', '100-500人', '500-1000人', '1000-5000人', '5000-10000人', '10000人以上'];

// 计算属性
const filteredCompanies = computed(() => {
  return companyStore.companies.filter((company: Company) => {
    if (filters.value.industry && company.industry !== filters.value.industry) {
      return false;
    }
    if (filters.value.scale && company.scale !== filters.value.scale) {
      return false;
    }
    if (filters.value.name && !company.name.toLowerCase().includes(filters.value.name.toLowerCase())) {
      return false;
    }
    return true;
  });
});

// 工具函数
const formatDate = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

const getInterviewCount = (companyId: string) => {
  return interviewStore.getProcessesByCompany(companyId).length;
};

// 事件处理
const showNewCompanyModal = () => {
  editingCompany.value = null;
  companyModalVisible.value = true;
};

const editCompany = (company: Company) => {
  editingCompany.value = company;
  companyModalVisible.value = true;
};

const deleteCompany = async (company: Company) => {
  try {
    await companyStore.deleteCompany(company.id);
    message.success('删除成功');
  } catch (error: any) {
    message.error(error.message || '删除失败');
    console.error('Failed to delete company:', error);
  }
};

const viewCompanyDetail = (company: Company) => {
  // 可以跳转到公司详情页或显示详情弹窗
  message.info(`查看 ${company.name} 的详细信息`);
};

const resetFilters = () => {
  filters.value = {
    industry: '',
    scale: '',
    name: '',
  };
};

const handleCompanySaved = () => {
  companyModalVisible.value = false;
  editingCompany.value = null;
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      companyStore.loadCompanies(),
      interviewStore.loadProcesses(),
    ]);
  } catch (error) {
    message.error('加载数据失败');
    console.error('Failed to load data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.company-list {
  height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header-left h2 {
  margin: 0;
  color: #262626;
  font-size: 20px;
  font-weight: 500;
}

.filter-card {
  margin-bottom: 16px;
}

.company-card {
  transition: all 0.3s;
}

.company-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.company-cover {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  background: #fafafa;
}

.company-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
}

.company-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.company-info {
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
}

.info-item :deep(.anticon) {
  color: #999;
}

.info-item a {
  color: #1890ff;
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}

.interview-stats {
  margin-top: 8px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  :deep(.ant-col) {
    margin-bottom: 16px;
  }
}
</style>
