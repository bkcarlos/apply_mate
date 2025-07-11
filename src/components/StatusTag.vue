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
      evaluating: 'orange',
      screening: 'orange', 
      interviewing: 'cyan',
      negotiating: 'gold',
      offer: 'green',
      offered: 'green',
      rejected: 'red',
      withdrawn: 'gray',
      closed: 'gray'
    }
    return colors[status as keyof typeof colors] || 'gray'
  } else {
    const colors = {
      pending: 'orange',
      passed: 'green',
      failed: 'red',
      cancelled: 'gray'
    }
    return colors[status as keyof typeof colors] || 'orange'
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
