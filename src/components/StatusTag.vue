<template>
  <a-tag :color="getStatusColor(status)" class="status-tag">
    {{ getStatusText(status) }}
  </a-tag>
</template>

<script setup lang="ts">
interface Props {
  status: string
  type?: 'process' | 'round'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'process'
})

const getStatusColor = (status: string) => {
  if (props.type === 'process') {
    const colors = {
      applied: 'blue',
      screening: 'orange', 
      interviewing: 'processing',
      offer: 'green',
      rejected: 'red',
      withdrawn: 'default'
    }
    return colors[status as keyof typeof colors] || 'default'
  } else {
    const colors = {
      pending: 'processing',
      passed: 'success',
      failed: 'error',
      cancelled: 'default'
    }
    return colors[status as keyof typeof colors] || 'processing'
  }
}

const getStatusText = (status: string) => {
  if (props.type === 'process') {
    const texts = {
      applied: '已投递',
      screening: '筛选中',
      interviewing: '面试中', 
      offer: '已录用',
      rejected: '已拒绝',
      withdrawn: '已撤回'
    }
    return texts[status as keyof typeof texts] || status
  } else {
    const texts = {
      pending: '待面试',
      passed: '通过',
      failed: '未通过',
      cancelled: '已取消'
    }
    return texts[status as keyof typeof texts] || status
  }
}
</script>

<style scoped>
.status-tag {
  font-size: 12px;
  border-radius: 4px;
}
</style>
