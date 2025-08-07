<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <el-button type="text" class="language-switcher">
      <el-icon><Connection /></el-icon>
      <span class="language-text">{{ currentLanguage.name }}</span>
      <el-icon class="arrow"><ArrowDown /></el-icon>
    </el-button>
    
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="locale in supportedLocales"
          :key="locale.code"
          :command="locale.code"
          :class="{ active: currentLocale === locale.code }"
        >
          <span class="flag">{{ locale.flag }}</span>
          <span class="name">{{ locale.name }}</span>
          <el-icon v-if="currentLocale === locale.code" class="check">
            <Check />
          </el-icon>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Connection, ArrowDown, Check } from '@element-plus/icons-vue'
import { setLocale, getLocale, supportedLocales } from '@/i18n'

const currentLocale = computed(() => getLocale())

const currentLanguage = computed(() => {
  return supportedLocales.find(lang => lang.code === currentLocale.value) || supportedLocales[0]
})

const handleCommand = (command: string) => {
  if (command !== currentLocale.value) {
    setLocale(command)
    // 刷新页面以确保所有组件都更新
    window.location.reload()
  }
}
</script>

<style lang="scss" scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 107, 53, 0.1);
  }
  
  .language-text {
    font-size: 14px;
    color: #606266;
  }
  
  .arrow {
    font-size: 12px;
    color: #909399;
    transition: transform 0.3s ease;
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  
  &.active {
    background-color: rgba(255, 107, 53, 0.1);
    color: #FF6B35;
  }
  
  .flag {
    font-size: 16px;
  }
  
  .name {
    flex: 1;
    font-size: 14px;
  }
  
  .check {
    font-size: 14px;
    color: #FF6B35;
  }
}
</style> 