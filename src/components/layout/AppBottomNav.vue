<template>
  <nav class="app-bottom-nav">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ active: isActive(item) }"
    >
      <span class="nav-icon-wrap">
        <component :is="item.icon" class="nav-icon" />
      </span>
      <span class="nav-label">{{ $t(`nav.${item.key}`) }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { House, Calendar, Document, OfficeBuilding, DataAnalysis } from '@element-plus/icons-vue'

const route = useRoute()

const navItems = [
  { key: 'dashboard', path: '/dashboard', icon: House },
  { key: 'calendar',  path: '/calendar',  icon: Calendar },
  { key: 'interviews', path: '/interviews', icon: Document },
  { key: 'companies', path: '/companies', icon: OfficeBuilding },
  { key: 'analysis',  path: '/analysis',  icon: DataAnalysis },
]

const isActive = (item: typeof navItems[0]) => {
  if (item.path === '/interviews') return route.path.startsWith('/interviews')
  return route.path === item.path || route.path === '/' && item.path === '/dashboard'
}
</script>

<style lang="scss" scoped>
.app-bottom-nav {
  display: none;

  @media (max-width: $breakpoint-md) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: $color-white;
    border-top: 1px solid $border-light;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
    z-index: $z-sticky;
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: #909399;
  transition: color 0.2s ease;

  &.active {
    color: $primary-orange;

    .nav-icon-wrap {
      background-color: rgba(255, 107, 53, 0.1);
      border-radius: 12px;
    }
  }

  &:active {
    transform: scale(0.92);
  }
}

.nav-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  transition: background-color 0.2s ease;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
}
</style>
