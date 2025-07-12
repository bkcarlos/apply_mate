<script setup lang="ts">
// Companies view placeholder
</script>

<template>
  <div class="companies-view">
    <div class="page-header">
      <h1>公司管理</h1>
      <p class="page-description">管理公司信息库</p>
    </div>

    <el-card>
      <div class="placeholder-content">
        <el-empty description="公司管理功能开发中" />
        <p>未来将展示公司信息和智能填充功能</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.companies-view {
  max-width: 1200px;
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