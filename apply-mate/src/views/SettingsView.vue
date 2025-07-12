<script setup lang="ts">
// Settings view placeholder
</script>

<template>
  <div class="settings-view">
    <div class="page-header">
      <h1>系统设置</h1>
      <p class="page-description">个人设置和数据管理</p>
    </div>

    <el-card>
      <div class="placeholder-content">
        <el-empty description="设置功能开发中" />
        <p>未来将包含数据导入导出、个人配置等功能</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.settings-view {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.page-description {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  margin: 0;
}

.placeholder-content {
  text-align: center;
  padding: var(--spacing-xxl) 0;
}
</style>