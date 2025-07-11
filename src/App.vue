<template>
  <a-config-provider>
    <Layout />
  </a-config-provider>
</template>

<script setup lang="ts">
import Layout from './layout/simple.vue';
</script>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}

/* Arco Design 样式变量覆盖 */
:root {
  --color-primary-6: #165DFF;
  --color-primary-light-1: #F2F3FF;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--color-text-4);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-text-3);
}
</style>
