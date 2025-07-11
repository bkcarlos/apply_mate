<template>
  <a-tag :color="getStatusColor(status)" class="status-tag">
    {{ getStatusText(status) }}
  </a-tag>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  status: string
  type?: 'process' | 'round'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'process'
})

const { t } = useI18n()

const getStatusColor = (status: string) => {
  if (props.type === 'process') {
    const colors = {
      applied: 'blue',
      evaluating: 'processing',
      screening: 'orange', 
      interviewing: 'processing',
      negotiating: 'gold',
      offer: 'green',
      offered: 'green',
      rejected: 'red',
      withdrawn: 'default',
      closed: 'default'
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
    return t(`status.${status}`)
  } else {
    return t(`roundResult.${status}`)
  }
}
</script>

<style scoped>
.status-tag {
  font-size: 12px;
  border-radius: 4px;
}
</style>
