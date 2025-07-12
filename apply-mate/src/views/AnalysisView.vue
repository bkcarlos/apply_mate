<script setup lang="ts">
// Analysis view placeholder
</script>

<template>
  <div class="analysis-view">
    <div class="page-header">
      <h1>数据分析</h1>
      <p class="page-description">薪资对比和求职数据分析</p>
    </div>

    <el-card>
      <div class="placeholder-content">
        <el-empty description="数据分析功能开发中" />
        <p>未来将展示薪资对比图表和Offer决策辅助工具</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.analysis-view {
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