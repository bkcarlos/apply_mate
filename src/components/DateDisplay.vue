<template>
  <span :class="['date-display', size]" :title="fullDateTime">
    {{ formatDate }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Props {
  date: Date | string
  format?: 'relative' | 'short' | 'full'
  size?: 'small' | 'default' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  format: 'relative',
  size: 'default'
})

const formatDate = computed(() => {
  const date = dayjs(props.date)
  
  switch (props.format) {
    case 'relative':
      // 计算天数差异
      const now = dayjs()
      const diffDays = now.diff(date, 'day')
      
      if (diffDays === 0) return '今天'
      if (diffDays === 1) return '昨天'
      if (diffDays === 2) return '前天'
      if (diffDays < 7) return `${diffDays}天前`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`
      return `${Math.floor(diffDays / 365)}年前`
    case 'short':
      return date.format('MM-DD')
    case 'full':
      return date.format('YYYY-MM-DD')
    default:
      // 默认也使用天级别的相对时间
      const nowDefault = dayjs()
      const diffDaysDefault = nowDefault.diff(date, 'day')
      
      if (diffDaysDefault === 0) return '今天'
      if (diffDaysDefault === 1) return '昨天'
      if (diffDaysDefault === 2) return '前天'
      if (diffDaysDefault < 7) return `${diffDaysDefault}天前`
      return date.format('YYYY-MM-DD')
  }
})

const fullDateTime = computed(() => {
  return dayjs(props.date).format('YYYY年MM月DD日')
})
</script>

<style scoped>
.date-display {
  color: #6b7280;
}

.date-display.small {
  font-size: 12px;
}

.date-display.default {
  font-size: 14px;
}

.date-display.large {
  font-size: 16px;
}
</style>
