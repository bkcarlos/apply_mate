<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.go(-1)
</script>

<template>
  <div class="interview-detail-view">
    <div class="page-header">
      <h1>面试详情</h1>
      <p class="page-description">查看面试流程详细信息</p>
    </div>

    <el-card>
      <div class="placeholder-content">
        <el-empty description="详情功能开发中" />
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.interview-detail-view {
  max-width: 1000px;
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