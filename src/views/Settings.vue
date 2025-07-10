<template>
  <div class="settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>{{ $t('pages.settings.title') }}</h2>
      <a-breadcrumb>
        <a-breadcrumb-item>{{ $t('nav.home') }}</a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('pages.settings.title') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <a-row :gutter="[16, 24]">
      <!-- 个人设置 -->
      <a-col :span="24">
        <a-card :title="$t('settings.personalSettings')" class="settings-card">
          <a-form
            :model="userConfig"
            layout="vertical"
            @finish="saveUserConfig"
          >
            <a-form-item :label="$t('settings.currentMonthlySalary')" name="currentMonthlySalary">
              <a-input-number
                v-model:value="userConfig.currentMonthlySalary"
                :placeholder="$t('settings.currentSalaryPlaceholder')"
                style="width: 100%"
                :min="0"
              />
            </a-form-item>
            
            <a-alert
              :message="$t('settings.currentSalaryHelp')"
              type="info"
              show-icon
              style="margin-bottom: 16px"
            />
            
            <a-form-item>
              <a-button type="primary" html-type="submit">
                {{ $t('settings.saveSettings') }}
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <!-- 数据管理 -->
      <a-col :span="24">
        <a-card :title="$t('settings.dataManagement')" class="settings-card">
          <!-- 数据导出 -->
          <div class="data-section">
            <h4>{{ $t('settings.exportDataTitle') }}</h4>
            <p>{{ $t('settings.exportDataDescription') }}</p>
            <a-button type="primary" @click="exportData">
              <DownloadOutlined />
              {{ $t('settings.exportData') }}
            </a-button>
          </div>

          <!-- 数据导入 -->
          <div class="data-section">
            <h4>{{ $t('settings.importDataTitle') }}</h4>
            <p>{{ $t('settings.importDataDescription') }}</p>
            
            <a-upload
              :before-upload="beforeUpload"
              :show-upload-list="false"
              accept=".json"
            >
              <a-button>
                <UploadOutlined />
                {{ $t('settings.selectFileImport') }}
              </a-button>
            </a-upload>
            
            <a-radio-group v-model:value="importStrategy" style="margin-top: 12px">
              <a-radio value="skip">{{ $t('settings.skipDuplicate') }}</a-radio>
              <a-radio value="overwrite">{{ $t('settings.overwriteDuplicate') }}</a-radio>
            </a-radio-group>
          </div>

          <!-- 数据清除 -->
          <div class="data-section">
            <h4>{{ $t('settings.clearDataTitle') }}</h4>
            <p>{{ $t('settings.clearDataDescription') }}</p>
            <a-popconfirm
              :title="$t('settings.clearDataConfirm')"
              :ok-text="$t('settings.clearDataOk')"
              :cancel-text="$t('common.cancel')"
              @confirm="clearAllData"
            >
              <a-button danger>
                <DeleteOutlined />
                {{ $t('settings.clearAllData') }}
              </a-button>
            </a-popconfirm>
          </div>
        </a-card>
      </a-col>

      <!-- 应用信息 -->
      <a-col :span="24">
        <a-card :title="$t('settings.aboutApp')">
          <a-descriptions :column="1">
            <a-descriptions-item :label="$t('settings.versionLabel')">v1.4.0</a-descriptions-item>
            <a-descriptions-item :label="$t('settings.lastUpdate')">2025年7月9日</a-descriptions-item>
            <a-descriptions-item :label="$t('settings.techStack')">
              Vue 3 + TypeScript + Ant Design Vue
            </a-descriptions-item>
            <a-descriptions-item :label="$t('settings.dataStorage')">
              {{ $t('settings.dataStorageDescription') }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('settings.sourceCode')">
              <a href="https://github.com/your-repo" target="_blank">GitHub</a>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import {
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';

import { useUserStore } from '@/stores/user';
import { useInterviewStore } from '@/stores/interview';
import { useCompanyStore } from '@/stores/company';
import { dbService } from '@/services/database';

const { t } = useI18n();
const userStore = useUserStore();
const interviewStore = useInterviewStore();
const companyStore = useCompanyStore();

// 状态
const loading = ref(false);

// 导入策略
const importStrategy = ref<'skip' | 'overwrite'>('skip');

// 用户配置
const userConfig = reactive({
  currentMonthlySalary: 0,
});

// 保存用户配置
const saveUserConfig = async () => {
  try {
    await userStore.updateProfile(userConfig);
    message.success(t('settings.settingsSaveSuccess'));
  } catch (error) {
    console.error('Save config error:', error);
    message.error(t('settings.settingsSaveError'));
  }
};

// 导出数据
const exportData = async () => {
  try {
    loading.value = true;
    
    // 获取所有数据
    const data = await dbService.exportData();
    
    // 创建下载链接
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    
    // 创建下载链接并触发下载
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `applymate-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    message.success(t('settings.exportSuccess'));
  } catch (error) {
    console.error('Export error:', error);
    message.error(t('settings.exportError'));
  } finally {
    loading.value = false;
  }
};

// 导入数据前的处理
const beforeUpload = (file: File) => {
  // 检查文件类型
  if (!file.name.endsWith('.json')) {
    message.error(t('settings.importFormatError'));
    return false;
  }
  
  // 检查文件大小（10MB）
  if (file.size > 10 * 1024 * 1024) {
    message.error(t('settings.importSizeError'));
    return false;
  }
  
  importData(file);
  return false; // 阻止默认上传行为
};

// 导入数据
const importData = async (file: File) => {
  try {
    loading.value = true;
    const text = await file.text();
    const data = JSON.parse(text);
    
    // 验证数据格式
    if (!data.companies || !data.processes || !data.rounds) {
      throw new Error('Invalid data format');
    }
    
    await dbService.importData(data, importStrategy.value);
    message.success(t('settings.importSuccess', { 
      strategy: importStrategy.value === 'skip' ? t('settings.skipDuplicate') : t('settings.overwriteDuplicate')
    }));
    
    // 重新加载页面数据
    await Promise.all([
      interviewStore.loadProcesses(),
      interviewStore.loadRounds(),
      companyStore.loadCompanies(),
    ]);
  } catch (error) {
    console.error('Import error:', error);
    message.error(t('settings.importError'));
  } finally {
    loading.value = false;
  }
};

// 清除所有数据
const clearAllData = async () => {
  try {
    loading.value = true;
    
    // 清除所有数据
    await dbService.importData({
      version: '1.4.0', 
      exportDate: new Date(),
      companies: [],
      interviewProcesses: [],
      interviewRounds: [],
      userProfile: { id: 'default' },
    }, 'overwrite');
    
    // 清除 store 数据
    interviewStore.$reset();
    companyStore.$reset();
    
    message.success(t('settings.clearSuccess'));
    
    // 重新加载页面
    window.location.reload();
  } catch (error) {
    console.error('Clear data error:', error);
    message.error(t('settings.clearError'));
  } finally {
    loading.value = false;
  }
};

// 加载用户配置
const loadUserConfig = async () => {
  await userStore.loadProfile();
  if (userStore.profile) {
    Object.assign(userConfig, userStore.profile);
  }
};

onMounted(() => {
  loadUserConfig();
});
</script>

<style scoped>
.settings {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.settings-card {
  margin-bottom: 16px;
}

.data-section {
  margin-bottom: 32px;
}

.data-section:last-child {
  margin-bottom: 0;
}

.data-section h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.data-section p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
}
</style>
