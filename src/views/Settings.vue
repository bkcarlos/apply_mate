<template>
  <div class="settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>设置</h2>
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>设置</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>

    <a-row :gutter="[24, 24]">
      <!-- 个人设置 -->
      <a-col :xs="24" :lg="12">
        <a-card title="个人设置" class="settings-card">
          <a-form
            :model="userProfile"
            layout="vertical"
            @finish="saveUserProfile"
          >
            <a-form-item label="当前税前月薪" name="currentMonthlySalary">
              <a-input-number
                v-model:value="userProfile.currentMonthlySalary"
                placeholder="用于年度收入模拟计算"
                style="width: 100%"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              />
              <div class="form-tip">
                此信息仅用于年度收入对比计算，不会上传到任何服务器
              </div>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="saving">
                保存设置
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <!-- 数据管理 -->
      <a-col :xs="24" :lg="12">
        <a-card title="数据管理" class="settings-card">
          <a-space direction="vertical" style="width: 100%;" :size="16">
            <!-- 数据导出 -->
            <div class="data-section">
              <h4>数据导出</h4>
              <p class="section-desc">
                导出您的所有数据，包括公司信息、面试流程和轮次记录
              </p>
              <a-button type="primary" @click="exportData" :loading="exporting">
                <DownloadOutlined />
                导出数据
              </a-button>
            </div>

            <a-divider />

            <!-- 数据导入 -->
            <div class="data-section">
              <h4>数据导入</h4>
              <p class="section-desc">
                从之前导出的文件中恢复数据
              </p>
              <a-upload
                :before-upload="beforeImport"
                :show-upload-list="false"
                accept=".json"
              >
                <a-button :loading="importing">
                  <UploadOutlined />
                  选择文件导入
                </a-button>
              </a-upload>
              
              <div style="margin-top: 8px;">
                <a-radio-group v-model:value="importStrategy" size="small">
                  <a-radio value="skip">跳过重复</a-radio>
                  <a-radio value="overwrite">覆盖重复</a-radio>
                </a-radio-group>
              </div>
            </div>

            <a-divider />

            <!-- 数据清除 -->
            <div class="data-section">
              <h4>数据清除</h4>
              <p class="section-desc danger">
                危险操作：这将删除所有本地数据，且无法恢复
              </p>
              <a-popconfirm
                title="确定要清除所有数据吗？此操作无法撤销！"
                ok-text="确定清除"
                cancel-text="取消"
                @confirm="clearAllData"
              >
                <a-button danger :loading="clearing">
                  <DeleteOutlined />
                  清除所有数据
                </a-button>
              </a-popconfirm>
            </div>
          </a-space>
        </a-card>
      </a-col>
    </a-row>

    <!-- 应用信息 -->
    <a-row style="margin-top: 24px;">
      <a-col :span="24">
        <a-card title="关于 ApplyMate">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="版本">v1.4.0</a-descriptions-item>
            <a-descriptions-item label="最后更新">2025年7月9日</a-descriptions-item>
            <a-descriptions-item label="技术栈">
              Vue 3 + TypeScript + Ant Design Vue + Pinia + IndexedDB
            </a-descriptions-item>
            <a-descriptions-item label="数据存储">
              所有数据仅存储在您的浏览器本地，不会上传到任何服务器
            </a-descriptions-item>
            <a-descriptions-item label="开源地址">
              <a href="https://github.com/your-repo/apply-mate" target="_blank">
                GitHub Repository
              </a>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import {
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';

import { useUserStore } from '@/stores/user';
import { dbService } from '@/services/database';
import type { ExportData, UserProfile } from '@/types';

const userStore = useUserStore();

// 状态
const saving = ref(false);
const exporting = ref(false);
const importing = ref(false);
const clearing = ref(false);
const importStrategy = ref<'skip' | 'overwrite'>('skip');

// 用户配置
const userProfile = reactive<Partial<UserProfile>>({
  currentMonthlySalary: undefined,
});

// 保存用户配置
const saveUserProfile = async () => {
  saving.value = true;
  try {
    await userStore.updateProfile(userProfile);
    message.success('设置保存成功');
  } catch (error) {
    console.error('Failed to save user profile:', error);
    message.error('保存失败');
  } finally {
    saving.value = false;
  }
};

// 导出数据
const exportData = async () => {
  exporting.value = true;
  try {
    const data = await dbService.exportData();
    
    // 创建下载链接
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接并触发下载
    const link = document.createElement('a');
    link.href = url;
    link.download = `apply-mate-backup-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.json`;
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    message.success('数据导出成功');
  } catch (error) {
    console.error('Failed to export data:', error);
    message.error('数据导出失败');
  } finally {
    exporting.value = false;
  }
};

// 导入数据前的处理
const beforeImport = (file: File) => {
  const isJson = file.type === 'application/json' || file.name.endsWith('.json');
  if (!isJson) {
    message.error('请选择 JSON 格式的文件');
    return false;
  }

  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error('文件大小不能超过 10MB');
    return false;
  }

  importData(file);
  return false; // 阻止默认上传行为
};

// 导入数据
const importData = async (file: File) => {
  importing.value = true;
  try {
    const text = await file.text();
    const data: ExportData = JSON.parse(text);
    
    // 验证数据格式
    if (!data.version || !data.companies || !data.interviewProcesses) {
      throw new Error('Invalid data format');
    }
    
    await dbService.importData(data, importStrategy.value);
    
    message.success(`数据导入成功 (策略: ${importStrategy.value === 'skip' ? '跳过重复' : '覆盖重复'})`);
    
    // 重新加载页面数据
    window.location.reload();
  } catch (error) {
    console.error('Failed to import data:', error);
    message.error('数据导入失败，请检查文件格式');
  } finally {
    importing.value = false;
  }
};

// 清除所有数据
const clearAllData = async () => {
  clearing.value = true;
  try {
    // 清除 IndexedDB 数据
    await dbService.importData({
      version: '1.4.0',
      exportDate: new Date(),
      companies: [],
      interviewProcesses: [],
      interviewRounds: [],
      userProfile: { id: 'default' },
    }, 'overwrite');
    
    message.success('所有数据已清除');
    
    // 重新加载页面
    window.location.reload();
  } catch (error) {
    console.error('Failed to clear data:', error);
    message.error('数据清除失败');
  } finally {
    clearing.value = false;
  }
};

// 加载用户配置
const loadUserProfile = async () => {
  try {
    await userStore.loadProfile();
    if (userStore.profile) {
      Object.assign(userProfile, userStore.profile);
    }
  } catch (error) {
    console.error('Failed to load user profile:', error);
  }
};

onMounted(() => {
  loadUserProfile();
});
</script>

<style scoped>
.settings {
  width: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  color: #262626;
  font-size: 20px;
  font-weight: 500;
}

.settings-card {
  height: 100%;
}

.data-section h4 {
  margin: 0 0 8px 0;
  color: #262626;
  font-weight: 600;
}

.section-desc {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.section-desc.danger {
  color: #ff4d4f;
}

.form-tip {
  margin-top: 4px;
  color: #999;
  font-size: 12px;
}

:deep(.ant-descriptions-item-label) {
  font-weight: 500;
  color: #666;
}

:deep(.ant-card-head-title) {
  font-weight: 600;
}
</style>
