<template>
  <div 
    class="dashboard-card" 
    :class="{ clickable, loading }"
    @click="handleClick"
  >
    <div class="card-content">
      <div class="card-icon" :style="{ backgroundColor: `${color}15`, color }">
        <el-icon :size="24">
          <component :is="icon" />
        </el-icon>
      </div>
      
      <div class="card-info">
        <div class="card-title">{{ title }}</div>
        <div class="card-value">
          <span class="value-number">{{ formattedValue }}</span>
          <div v-if="trend" class="trend-indicator" :class="trendClass">
            <el-icon :size="14">
              <component :is="trendIcon" />
            </el-icon>
            <span class="trend-text">{{ trend.text }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <el-icon class="loading-icon">
        <Loading />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUp, ArrowDown, Loading } from '@element-plus/icons-vue'

interface Props {
  title: string
  value: number | string
  icon: string
  color?: string
  trend?: {
    type: 'up' | 'down' | 'neutral'
    value: number
    text: string
  } | null
  clickable?: boolean
  loading?: boolean
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  color: '#F28A31',
  trend: null,
  clickable: false,
  loading: false
})

const emit = defineEmits<Emits>()

// 计算属性
const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const trendClass = computed(() => {
  if (!props.trend) return ''
  
  switch (props.trend.type) {
    case 'up':
      return 'trend-up'
    case 'down':
      return 'trend-down'
    default:
      return 'trend-neutral'
  }
})

const trendIcon = computed(() => {
  if (!props.trend) return null
  
  switch (props.trend.type) {
    case 'up':
      return ArrowUp
    case 'down':
      return ArrowDown
    default:
      return null
  }
})

// 方法
const handleClick = () => {
  if (props.clickable && !props.loading) {
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.dashboard-card {
  position: relative;
  background: $color-white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-light;
  border: 1px solid $border-light;
  transition: all $transition-base;
  overflow: hidden;
  
  &.clickable {
    cursor: pointer;
    
    &:hover {
      box-shadow: $shadow-deep;
      transform: translateY(-2px);
      border-color: lighten($primary-orange, 20%);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &.loading {
    pointer-events: none;
  }
  
  .card-content {
    display: flex;
    align-items: flex-start;
    gap: $spacing-md;
  }
  
  .card-icon {
    width: 56px;
    height: 56px;
    border-radius: $border-radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .card-info {
    flex: 1;
    
    .card-title {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin-bottom: $spacing-xs;
      font-weight: $font-weight-medium;
    }
    
    .card-value {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      flex-wrap: wrap;
      
      .value-number {
        font-size: $font-size-3xl;
        font-weight: $font-weight-bold;
        color: $color-text-primary;
        line-height: 1;
        
        @media (max-width: $breakpoint-sm) {
          font-size: $font-size-2xl;
        }
      }
      
      .trend-indicator {
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 2px 6px;
        border-radius: $border-radius-sm;
        font-size: $font-size-xs;
        font-weight: $font-weight-medium;
        
        &.trend-up {
          background-color: lighten($color-success, 45%);
          color: $color-success;
        }
        
        &.trend-down {
          background-color: lighten($color-danger, 45%);
          color: $color-danger;
        }
        
        &.trend-neutral {
          background-color: $bg-section;
          color: $color-text-secondary;
        }
        
        .trend-text {
          white-space: nowrap;
        }
      }
    }
  }
  
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius-lg;
    
    .loading-icon {
      font-size: 24px;
      color: $primary-orange;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 入场动画
.dashboard-card {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
