<template>
  <div class="footer">
    <div class="footer-content">
      <span>ApplyMate © 2024 - {{ $t('footer.allRightsReserved') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.footer {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--color-border-2);
  background-color: var(--color-bg-2);
}

.footer-content {
  color: var(--color-text-3);
  font-size: 12px;
}
</style> 