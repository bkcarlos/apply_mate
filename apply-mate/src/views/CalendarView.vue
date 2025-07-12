<script setup lang="ts">
// Calendar view placeholder
</script>

<template>
  <div class="calendar-view">
    <div class="page-header">
      <h1>面试日历</h1>
      <p class="page-description">可视化管理面试日程</p>
    </div>

    <el-card>
      <div class="placeholder-content">
        <el-empty description="日历功能开发中" />
        <p>未来将展示面试日程安排</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.calendar-view {
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