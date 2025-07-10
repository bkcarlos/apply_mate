<template>
  <div :class="['loading-container', { fullscreen }]">
    <a-spin :size="size" :spinning="true">
      <template #indicator>
        <component :is="icon" class="loading-icon" />
      </template>
      <div v-if="text" class="loading-text">{{ text }}</div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue'

interface Props {
  size?: 'small' | 'default' | 'large'
  text?: string
  fullscreen?: boolean
  icon?: any
}

withDefaults(defineProps<Props>(), {
  size: 'default',
  fullscreen: false,
  icon: LoadingOutlined
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.loading-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.loading-icon {
  font-size: inherit;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
