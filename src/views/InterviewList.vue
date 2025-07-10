<template>
  <div class="interview-list">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>面试管理</h2>
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>面试管理</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="goToNewInterview">
          <PlusOutlined />
          新建面试流程
        </a-button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <a-card class="filter-card" size="small">
      <a-row :gutter="16">
        <a-col :span="18">
          <a-form layout="inline" :model="filters">
            <a-form-item label="公司">
              <a-select
                v-model:value="filters.companyId"
                placeholder="选择公司"
                style="width: 150px"
                allow-clear
                show-search
                :filter-option="filterCompanyOption"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  v-for="company in companies"
                  :key="company.id"
                  :value="company.id"
                >
                  {{ company.name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="状态">
              <a-select
                v-model:value="filters.status"
                placeholder="选择状态"
                style="width: 120px"
                allow-clear
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="applied">已投递</a-select-option>
                <a-select-option value="screening">筛选中</a-select-option>
                <a-select-option value="interviewing">面试中</a-select-option>
                <a-select-option value="offer">已录用</a-select-option>
                <a-select-option value="rejected">已拒绝</a-select-option>
                <a-select-option value="withdrawn">已撤回</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="岗位">
              <a-input
                v-model:value="filters.position"
                placeholder="搜索岗位"
                style="width: 150px"
                allow-clear
              />
            </a-form-item>

            <a-form-item>
              <a-button @click="resetFilters">重置</a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="6" class="text-right">
          <a-space>
            <a-tooltip title="刷新数据">
              <a-button :icon="h(ReloadOutlined)" @click="loadData" :loading="loading" />
            </a-tooltip>
            <a-dropdown>
              <a-button :icon="h(DownOutlined)">
                批量操作
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="export" @click="exportSelectedData">
                    <FileExcelOutlined />
                    导出数据
                  </a-menu-item>
                  <a-menu-item key="delete" @click="batchDelete" :disabled="selectedRowKeys.length === 0">
                    <DeleteOutlined />
                    批量删除
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </a-col>
      </a-row>
    </a-card>

    <!-- 数据表格 -->
    <a-card class="table-card">
      <a-table
        :columns="columns"
        :data-source="filteredProcesses"
        :loading="loading"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          pageSize: pageSize,
          current: currentPage,
          total: filteredProcesses.length
        }"
        :row-selection="rowSelection"
        row-key="id"
        @change="handleTableChange"
      >
        <!-- 公司列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'company'">
            <div class="company-cell">
              <a-avatar
                v-if="getCompany(record.companyId)?.logoUrl"
                :src="getCompany(record.companyId)?.logoUrl"
                size="small"
              />
              <a-avatar v-else size="small">
                {{ getCompany(record.companyId)?.name?.charAt(0) || '?' }}
              </a-avatar>
              <span class="company-name">
                {{ getCompany(record.companyId)?.name || 'Unknown' }}
              </span>
            </div>
          </template>

          <!-- 状态列 -->
          <template v-else-if="column.key === 'status'">
            <StatusTag :status="record.status" type="process" />
          </template>

          <!-- 结论列 -->
          <template v-else-if="column.key === 'conclusion'">
            <a-tag :color="getConclusionColor(record.conclusion)">
              {{ record.conclusion }}
            </a-tag>
          </template>

          <!-- 薪资列 -->
          <template v-else-if="column.key === 'salary'">
            <div v-if="record.offeredSalary">
              <div class="salary-amount">
                ¥{{ formatSalary(record.offeredSalary.total) }}
              </div>
              <div class="salary-detail">
                总包/年
              </div>
            </div>
            <span v-else class="no-salary">暂无</span>
          </template>

          <!-- 更新时间列 -->
          <template v-else-if="column.key === 'updateTime'">
            <DateDisplay :date="record.updatedAt" format="relative" />
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="text" size="small" @click="viewDetail(record)">
                查看
              </a-button>
              <a-button type="text" size="small" @click="editProcess(record)">
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除这个面试流程吗？"
                @confirm="deleteProcess(record)"
              >
                <a-button type="text" size="small" danger>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <EditProcessModal
      v-model:visible="editModalVisible"
      :process="editingProcess"
      @updated="handleProcessUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { 
  PlusOutlined, 
  ReloadOutlined, 
  DownOutlined, 
  FileExcelOutlined, 
  DeleteOutlined 
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';

import { useInterviewStore } from '@/stores/interview';
import { useCompanyStore } from '@/stores/company';
import type { InterviewProcess } from '@/types';
import EditProcessModal from '@/components/EditProcessModal.vue';
import StatusTag from '@/components/StatusTag.vue';
import DateDisplay from '@/components/DateDisplay.vue';

const router = useRouter();
const interviewStore = useInterviewStore();
const companyStore = useCompanyStore();

// 状态
const loading = ref(false);
const editModalVisible = ref(false);
const editingProcess = ref<InterviewProcess | null>(null);
const selectedRowKeys = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

// 筛选条件
const filters = ref({
  companyId: '',
  status: '',
  position: '',
});

// 表格配置
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys;
  },
};

// 表格列配置
const columns = [
  {
    title: '公司',
    key: 'company',
    width: 150,
  },
  {
    title: '岗位',
    dataIndex: 'position',
    key: 'position',
    width: 200,
  },
  {
    title: '城市',
    dataIndex: 'city',
    key: 'city',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '结论',
    key: 'conclusion',
    width: 100,
  },
  {
    title: '渠道',
    dataIndex: 'sourceChannel',
    key: 'sourceChannel',
    width: 120,
  },
  {
    title: '薪资',
    key: 'salary',
    width: 120,
  },
  {
    title: '更新时间',
    key: 'updateTime',
    width: 120,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right' as const,
  },
];

// 计算属性
const companies = computed(() => companyStore.companies);

const filteredProcesses = computed(() => {
  return interviewStore.processes.filter((process: InterviewProcess) => {
    if (filters.value.companyId && process.companyId !== filters.value.companyId) {
      return false;
    }
    if (filters.value.status && process.status !== filters.value.status) {
      return false;
    }
    if (filters.value.position && !process.position.toLowerCase().includes(filters.value.position.toLowerCase())) {
      return false;
    }
    return true;
  });
});

// 工具函数
const getCompany = (companyId: string) => {
  return companyStore.getCompanyById(companyId);
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    '投递中': 'blue',
    '评估中': 'processing',
    '面试中': 'orange',
    '已发Offer': 'success',
    '已拒绝': 'error',
    '已结束': 'default',
  };
  return colorMap[status] || 'default';
};

const getConclusionColor = (conclusion: string) => {
  const colorMap: Record<string, string> = {
    '未开始': 'default',
    '进行中': 'processing',
    '通过': 'success',
    '未通过': 'error',
    '待定': 'warning',
  };
  return colorMap[conclusion] || 'default';
};

const formatSalary = (amount: number) => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}万`;
  }
  return amount.toLocaleString();
};

const formatDate = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

// 事件处理
const goToNewInterview = () => {
  router.push('/interviews/new');
};

const viewDetail = (record: InterviewProcess) => {
  router.push(`/interviews/${record.id}`);
};

const editProcess = (record: InterviewProcess) => {
  editingProcess.value = record;
  editModalVisible.value = true;
};

const deleteProcess = async (record: InterviewProcess) => {
  try {
    await interviewStore.deleteProcess(record.id);
    message.success('删除成功');
  } catch (error) {
    message.error('删除失败');
    console.error('Failed to delete process:', error);
  }
};

const resetFilters = () => {
  filters.value = {
    companyId: '',
    status: '',
    position: '',
  };
};

const handleProcessUpdated = () => {
  editModalVisible.value = false;
  editingProcess.value = null;
  // 刷新列表数据
  loadData();
};

// 表格分页处理
const handleTableChange = (pagination: any) => {
  currentPage.value = pagination.current;
  pageSize.value = pagination.pageSize;
};

// 公司搜索过滤
const filterCompanyOption = (input: string, option: any) => {
  return option.children[0].children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// 批量操作
const exportSelectedData = () => {
  const selectedData = filteredProcesses.value.filter(process => 
    selectedRowKeys.value.includes(process.id)
  );
  
  if (selectedData.length === 0) {
    message.warning('请选择要导出的数据');
    return;
  }
  
  const dataToExport = selectedData.map(process => ({
    职位: process.position,
    公司: getCompany(process.companyId)?.name || 'Unknown',
    状态: process.status,
    投递时间: dayjs(process.appliedAt).format('YYYY-MM-DD'),
    更新时间: dayjs(process.updatedAt).format('YYYY-MM-DD'),
    薪资: process.offeredSalary ? `${process.offeredSalary.total}元` : '暂无',
    备注: process.notes || ''
  }));
  
  const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `面试数据_${dayjs().format('YYYY-MM-DD')}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  message.success(`已导出 ${selectedData.length} 条记录`);
};

const batchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的数据');
    return;
  }
  
  Modal.confirm({
    title: '批量删除确认',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条面试流程吗？此操作不可恢复。`,
    okText: '确定删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        for (const id of selectedRowKeys.value) {
          await interviewStore.deleteProcess(id);
        }
        selectedRowKeys.value = [];
        message.success(`已删除 ${selectedRowKeys.value.length} 条记录`);
        await loadData();
      } catch (error) {
        message.error('批量删除失败');
        console.error('Failed to batch delete:', error);
      }
    }
  });
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      interviewStore.loadProcesses(),
      companyStore.loadCompanies(),
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
.interview-list {
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

.table-card {
  flex: 1;
}

.company-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.company-name {
  font-weight: 500;
}

.salary-amount {
  font-weight: 600;
  color: #52c41a;
}

.salary-detail {
  font-size: 12px;
  color: #999;
}

.no-salary {
  color: #999;
}

:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  :deep(.ant-table) {
    font-size: 12px;
  }
}
</style>
