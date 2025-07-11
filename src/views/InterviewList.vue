<template>
  <div class="interview-list">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>{{ $t('pages.interviews.title') }}</h2>
        <a-breadcrumb>
          <a-breadcrumb-item>{{ $t('nav.dashboard') }}</a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('nav.interviews') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="goToNewInterview">
          <PlusOutlined />
          {{ $t('pages.interviews.new') }}
        </a-button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <a-card class="filter-card" size="small">
      <a-row :gutter="16">
        <a-col :span="18">
          <a-form layout="inline" :model="filters">
            <a-form-item :label="$t('form.company')">
              <a-select
                v-model:value="filters.companyId"
                :placeholder="$t('form.company')"
                style="width: 150px"
                allow-clear
                show-search
                :filter-option="filterCompanyOption"
              >
                <a-select-option value="">{{ $t('common.all') }}</a-select-option>
                <a-select-option
                  v-for="company in companies"
                  :key="company.id"
                  :value="company.id"
                >
                  {{ company.name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item :label="$t('form.status')">
              <a-select
                v-model:value="filters.status"
                :placeholder="$t('form.status')"
                style="width: 120px"
                allow-clear
              >
                <a-select-option value="">{{ $t('common.all') }}</a-select-option>
                <a-select-option value="applied">{{ $t('status.applied') }}</a-select-option>
                <a-select-option value="evaluating">{{ $t('status.evaluating') }}</a-select-option>
                <a-select-option value="interviewing">{{ $t('status.interviewing') }}</a-select-option>
                <a-select-option value="offered">{{ $t('status.offered') }}</a-select-option>
                <a-select-option value="rejected">{{ $t('status.rejected') }}</a-select-option>
                <a-select-option value="closed">{{ $t('status.closed') }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item :label="$t('form.position')">
              <a-input
                v-model:value="filters.position"
                :placeholder="$t('form.position')"
                style="width: 150px"
                allow-clear
              />
            </a-form-item>

            <a-form-item>
              <a-button @click="resetFilters">{{ $t('common.reset') }}</a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="6" class="text-right">
          <a-space>
            <a-tooltip :title="$t('interview.refreshData')">
              <a-button :icon="h(ReloadOutlined)" @click="loadData" :loading="loading" />
            </a-tooltip>
            <a-dropdown>
              <a-button :icon="h(DownOutlined)">
                {{ $t('interview.batchActions') }}
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="export" @click="exportSelectedData">
                    <FileExcelOutlined />
                    {{ $t('interview.exportData') }}
                  </a-menu-item>
                  <a-menu-item key="delete" @click="batchDelete" :disabled="selectedRowKeys.length === 0">
                    <DeleteOutlined />
                    {{ $t('interview.batchDelete') }}
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
          showTotal: (total: number) => `${t('stats.totalRecords', { total })}`,
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
                {{ getCompany(record.companyId)?.name || $t('interview.unknownCompany') }}
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
              {{ $t(`conclusion.${record.conclusion}`) }}
            </a-tag>
          </template>

          <!-- 薪资列 -->
          <template v-else-if="column.key === 'salary'">
            <div v-if="record.offeredSalary" class="salary-display">
              <div class="salary-range">
                {{ getSalaryRangeText(record.offeredSalary) }}
              </div>
              <div class="salary-detail">
                {{ $t('interview.baseSalaryFormat', { amount: formatSalary(record.offeredSalary.base) }) }}
              </div>
            </div>
            <span v-else class="no-salary">{{ $t('interview.noSalary') }}</span>
          </template>

          <!-- 更新时间列 -->
          <template v-else-if="column.key === 'updateTime'">
            <DateDisplay :date="record.updatedAt" format="relative" />
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="text" size="small" @click="viewDetail(record)">
                {{ $t('interview.view') }}
              </a-button>
              <a-button type="text" size="small" @click="editProcess(record)">
                {{ $t('interview.edit') }}
              </a-button>
              <a-popconfirm
                :title="$t('interview.confirmDelete')"
                @confirm="deleteProcess(record)"
              >
                <a-button type="text" size="small" danger>
                  {{ $t('interview.delete') }}
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <EditProcessModal
      v-model:open="editModalVisible"
      :process="editingProcess"
      @save="handleProcessUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
  import {
    IconPlus as PlusOutlined,
    IconRefresh as ReloadOutlined,
    IconDown as DownOutlined, 
    IconFile as FileExcelOutlined, 
    IconDelete as DeleteOutlined 
  } from '@arco-design/web-vue/es/icon';
import { Message, Modal } from '@arco-design/web-vue';

import { useInterviewStore } from '@/stores/interview';
import { useCompanyStore } from '@/stores/company';
import { useI18n } from 'vue-i18n';
import { SalaryCalculator } from '@/utils/salary';
import type { InterviewProcess } from '@/types';
import EditProcessModal from '@/components/EditProcessModal.vue';
import StatusTag from '@/components/StatusTag.vue';
import DateDisplay from '@/components/DateDisplay.vue';

const router = useRouter();
const { t } = useI18n();
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
const columns = computed(() => [
  {
    title: t('form.company'),
    key: 'company',
    width: 150,
  },
  {
    title: t('form.position'),
    dataIndex: 'position',
    key: 'position',
    width: 200,
  },
  {
    title: t('form.city'),
    dataIndex: 'city',
    key: 'city',
    width: 100,
  },
  {
    title: t('form.status'),
    key: 'status',
    width: 100,
  },
  {
    title: t('form.conclusion'),
    key: 'conclusion',
    width: 100,
  },
  {
    title: t('form.sourceChannel'),
    dataIndex: 'sourceChannel',
    key: 'sourceChannel',
    width: 120,
  },
  {
    title: t('form.salary'),
    key: 'salary',
    width: 120,
  },
  {
    title: t('form.updatedAt'),
    key: 'updateTime',
    width: 120,
  },
  {
    title: t('common.actions'),
    key: 'actions',
    width: 150,
    fixed: 'right' as const,
  },
]);

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

// 暂时注释未使用的函数
// const getStatusColor = (status: string) => {
//   const colorMap: Record<string, string> = {
//     'applied': 'blue',
//     'evaluating': 'processing',
//     'interviewing': 'orange',
//     'offered': 'success',
//     'rejected': 'error',
//     'closed': 'default',
//   };
//   return colorMap[status] || 'default';
// };

const getConclusionColor = (conclusion: string) => {
  const colorMap: Record<string, string> = {
    'not_started': 'default',
    'in_progress': 'processing',
    'passed': 'success',
    'failed': 'error',
    'pending': 'warning',
  };
  return colorMap[conclusion] || 'default';
};

const formatSalary = (amount: number) => {
  return SalaryCalculator.formatSalary(amount);
};

const getSalaryRangeText = (salary: any) => {
  return SalaryCalculator.getSalaryRangeText(salary);
};

// 暂时注释未使用的函数
// const formatDate = (date: Date) => {
//   return dayjs(date).format('YYYY-MM-DD');
// };

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
    Message.success(t('interview.deleteSuccess'));
  } catch (error) {
          Message.error(t('interview.deleteError'));
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
    Message.warning('请选择要导出的数据');
    return;
  }
  
  const dataToExport = selectedData.map(process => ({
    职位: process.position,
    公司: getCompany(process.companyId)?.name || 'Unknown',
    状态: process.status,
    投递时间: dayjs(process.appliedAt).format('YYYY-MM-DD'),
    更新时间: dayjs(process.updatedAt).format('YYYY-MM-DD'),
    薪资: process.offeredSalary ? getSalaryRangeText(process.offeredSalary) : '暂无',
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
  
      Message.success(`已导出 ${selectedData.length} 条记录`);
};

const batchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
          Message.warning('请选择要删除的数据');
    return;
  }
  
  Modal.confirm({
    title: '批量删除确认',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条面试流程吗？此操作不可恢复。`,
    okText: '确定删除',
    // okType: 'danger', // Arco Design Vue Modal 不支持此属性
    cancelText: '取消',
    async onOk() {
      try {
        for (const id of selectedRowKeys.value) {
          await interviewStore.deleteProcess(id);
        }
        selectedRowKeys.value = [];
        Message.success(`已删除 ${selectedRowKeys.value.length} 条记录`);
        await loadData();
      } catch (error) {
        Message.error('批量删除失败');
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
    Message.error('加载数据失败');
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

.salary-display {
  min-width: 120px;
}

.salary-range {
  font-weight: 600;
  color: #1890ff;
  font-size: 13px;
  line-height: 1.2;
}

.salary-detail {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
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
